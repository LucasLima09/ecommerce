import Ionicons from "@expo/vector-icons/Ionicons";
import Botao from "@/components/botao";
import { Carregando, Erro } from "@/components/estadoTela";
import { getCompraById } from "@/service/comprasService";
import { Compra } from "@/types/compra";
import { getMensagemErroApi } from "@/utils/errosApi";
import { formatarPreco } from "@/utils/formatarPreco";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NOMES_PAGAMENTO: Record<Compra["formaPagamento"], string> = {
    pix: "Pix",
    cartao: "Cartão de crédito",
    boleto: "Boleto",
};

export default function PedidoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [compra, setCompra] = useState<Compra | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    // why: incrementar dispara uma nova busca pelo botão "Tentar novamente"
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        // hazard: sem essa flag, a resposta chega depois da tela fechar e chama setState em tela desmontada.
        let ativo = true;
        async function carregar() {
            setErro(null);
            try {
                const data = await getCompraById(Number(id));
                if (ativo) setCompra(data);
            } catch (e) {
                if (ativo) setErro(getMensagemErroApi(e, "Não foi possível carregar o pedido."));
            }
        }
        carregar();
        return () => {
            ativo = false;
        };
    }, [id, tentativa]);

    // why: a compra já esvaziou o carrinho; voltar para pagamento ou carrinho não faz sentido, então volta para a Home.
    const voltarParaLoja = () => router.dismissTo("/");

    if (erro) return <Erro mensagem={erro} onTentarNovamente={() => setTentativa((t) => t + 1)} />;
    if (!compra) return <Carregando />;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topo}>
                <Ionicons name="checkmark-circle" size={64} color="#34C759" />
                <Text style={styles.titulo}>Pedido confirmado!</Text>
                <Text style={styles.numero}>Pedido nº {compra.id}</Text>
                <Text style={styles.pagamento}>Pagamento: {NOMES_PAGAMENTO[compra.formaPagamento]}</Text>
            </View>

            <FlatList
                data={compra.itens}
                keyExtractor={(item) => item.produtoId.toString()}
                contentContainerStyle={styles.lista}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemNome} numberOfLines={2}>
                            {item.quantidade}x {item.nome}
                        </Text>
                        <Text style={styles.itemValor}>{formatarPreco(item.subtotal)}</Text>
                    </View>
                )}
            />

            <View style={styles.rodape}>
                <View style={styles.linhaTotal}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValor}>{formatarPreco(compra.total)}</Text>
                </View>
                <Botao title="Voltar para a loja" onPress={voltarParaLoja} />
            </View>
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
    topo: {
        alignItems: "center",
        gap: 6,
        paddingVertical: 16,
    },
    titulo: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1C1C1E",
    },
    numero: {
        fontSize: 17,
        fontWeight: "600",
        color: "#1C1C1E",
    },
    pagamento: {
        fontSize: 15,
        color: "#636366",
    },
    lista: {
        paddingVertical: 8,
        gap: 8,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
    },
    itemNome: {
        flex: 1,
        fontSize: 15,
        color: "#1C1C1E",
    },
    itemValor: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1C1C1E",
    },
    rodape: {
        paddingVertical: 16,
        gap: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E5E5EA",
    },
    linhaTotal: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    totalLabel: {
        fontSize: 17,
        color: "#636366",
    },
    totalValor: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1C1C1E",
    },
});
