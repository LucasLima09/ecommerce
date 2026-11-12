import BotaoIcone from "@/components/botaoIcone";
import { Carregando, Erro } from "@/components/estadoTela";
import OpcaoPagamento from "@/components/opcaoPagamento";
import ResumoCarrinho from "@/components/resumoCarrinho";
import { useCarrinho } from "@/context/CarrinhoContext";
import { getFormasPagamento } from "@/service/comprasService";
import { FormaPagamento, FormaPagamentoId } from "@/types/compra";
import { getMensagemErroApi } from "@/utils/errosApi";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PagamentoScreen() {
    const { carrinho, atualizando, finalizar } = useCarrinho();
    const [formas, setFormas] = useState<FormaPagamento[]>([]);
    const [selecionada, setSelecionada] = useState<FormaPagamentoId | null>(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    // why: incrementar dispara uma nova busca pelo botão "Tentar novamente"
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        // hazard: sem essa flag, a resposta chega depois da tela fechar e chama setState em tela desmontada.
        let ativo = true;
        async function carregar() {
            setLoading(true);
            setErro(null);
            try {
                const data = await getFormasPagamento();
                if (ativo) setFormas(data);
            } catch (e) {
                if (ativo) setErro(getMensagemErroApi(e, "Não foi possível carregar as formas de pagamento."));
            } finally {
                if (ativo) setLoading(false);
            }
        }
        carregar();
        return () => {
            ativo = false;
        };
    }, [tentativa]);

    const tentarNovamente = () => setTentativa((t) => t + 1);

    async function confirmarPedido() {
        if (!selecionada) return;
        try {
            const compra = await finalizar(selecionada);
            // why: replace tira o pagamento da pilha, então voltar da confirmação não reabre a compra já feita.
            router.replace({ pathname: "/pedido/[id]", params: { id: compra.id.toString() } });
        } catch (e) {
            // why: a API explica o motivo da recusa (ex.: carrinho vazio, estoque insuficiente).
            Alert.alert("Pagamento", (e as Error).message);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BotaoIcone icone="chevron-back" tamanho={26} descricao="Voltar" onPress={router.back} />
                <Text style={styles.titulo}>Pagamento</Text>
            </View>
            <Text style={styles.subtitulo}>Escolha a forma de pagamento</Text>

            {loading ? (
                <Carregando />
            ) : erro ? (
                <Erro mensagem={erro} onTentarNovamente={tentarNovamente} />
            ) : (
                <FlatList
                    data={formas}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.lista}
                    renderItem={({ item }) => (
                        <OpcaoPagamento
                            forma={item}
                            selecionada={item.id === selecionada}
                            onSelecionar={setSelecionada}
                            desabilitado={atualizando}
                        />
                    )}
                />
            )}

            <ResumoCarrinho
                total={carrinho?.total ?? 0}
                tituloBotao="Confirmar pedido"
                // invariant: não é possível finalizar sem uma forma de pagamento escolhida.
                desabilitado={!selecionada}
                loading={atualizando}
                onConfirmar={confirmarPedido}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#F2F2F7",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    titulo: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1C1C1E",
    },
    subtitulo: {
        fontSize: 16,
        color: "#636366",
        marginTop: 4,
    },
    lista: {
        paddingVertical: 16,
        gap: 12,
    },
});
