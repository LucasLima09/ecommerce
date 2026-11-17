import BotaoIcone from "@/components/botaoIcone";
import { Carregando, Erro } from "@/components/estadoTela";
import FaixaMarca from "@/components/faixaMarca";
import OpcaoPagamento from "@/components/opcaoPagamento";
import ResumoCarrinho from "@/components/resumoCarrinho";
import { useCarrinho } from "@/context/CarrinhoContext";
import { getFormasPagamento } from "@/service/comprasService";
import { FormaPagamento, FormaPagamentoId } from "@/types/compra";
import { getMensagemErroApi } from "@/utils/errosApi";
import { larguraConteudo } from "@/theme";
import { estilosTela } from "@/theme/estilos";
import { entradaItem } from "@/utils/animacoes";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, View } from "react-native";
import Animated from "react-native-reanimated";

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
        <View style={estilosTela.container}>
            <FaixaMarca
                titulo="Pagamento"
                subtitulo="Escolha como prefere pagar"
                topo={<BotaoIcone icone="chevron-back" tamanho={20} comFundo inverso descricao="Voltar" onPress={router.back} />}
            />

            {loading ? (
                <Carregando />
            ) : erro ? (
                <Erro mensagem={erro} onTentarNovamente={tentarNovamente} />
            ) : (
                <FlatList
                    data={formas}
                    keyExtractor={(item) => item.id}
                    style={estilosTela.lista}
                    contentContainerStyle={[larguraConteudo, estilosTela.listaConteudo]}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={entradaItem(index)}>
                            <OpcaoPagamento
                                forma={item}
                                selecionada={item.id === selecionada}
                                onSelecionar={setSelecionada}
                                desabilitado={atualizando}
                            />
                        </Animated.View>
                    )}
                />
            )}

            <ResumoCarrinho
                total={carrinho?.total ?? 0}
                quantidadeItens={carrinho?.quantidadeTotal}
                tituloBotao="Confirmar pedido"
                // invariant: não é possível finalizar sem uma forma de pagamento escolhida.
                desabilitado={!selecionada}
                loading={atualizando}
                onConfirmar={confirmarPedido}
            />
        </View>
    );
}
