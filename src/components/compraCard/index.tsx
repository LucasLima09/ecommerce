import { cores, espaco, fonte, raio } from "@/theme";
import { Compra } from "@/types/compra";
import { formatarData } from "@/utils/formatarData";
import { NOMES_PAGAMENTO } from "@/utils/formasPagamento";
import { formatarPreco } from "@/utils/formatarPreco";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

type CompraCardProps = {
    compra: Compra;
};

export default function CompraCard({ compra }: CompraCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cabecalho}>
                <View style={styles.cabecalhoTextos}>
                    <Text style={styles.numero}>Pedido nº {compra.id}</Text>
                    <Text style={styles.data}>{formatarData(compra.criadaEm)}</Text>
                </View>
                {compra.status === "confirmada" && (
                    <View style={styles.status}>
                        <Ionicons name="checkmark-circle" size={14} color={cores.sucesso} />
                        <Text style={styles.statusTexto}>Confirmado</Text>
                    </View>
                )}
            </View>

            <View style={styles.itens}>
                {compra.itens.map((item) => (
                    <View key={item.produtoId} style={styles.item}>
                        <View style={styles.itemTextos}>
                            <Text style={styles.itemNome} numberOfLines={2}>
                                {item.nome}
                            </Text>
                            <Text style={styles.itemQtd}>
                                {item.quantidade} × {formatarPreco(item.preco)}
                            </Text>
                        </View>
                        <Text style={styles.itemValor}>{formatarPreco(item.subtotal)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.rodape}>
                <View style={styles.pagamento}>
                    <Text style={styles.rotulo}>Pagamento</Text>
                    <Text style={styles.pagamentoNome}>{NOMES_PAGAMENTO[compra.formaPagamento]}</Text>
                </View>
                <View style={styles.totalBox}>
                    <Text style={styles.rotulo}>Total</Text>
                    <Text style={styles.total}>{formatarPreco(compra.total)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: raio.lg,
        borderWidth: 1,
        borderColor: cores.borda,
        backgroundColor: cores.superficie,
        overflow: "hidden",
    },
    cabecalho: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: espaco.sm,
        padding: espaco.lg,
        backgroundColor: cores.fundo,
        borderBottomWidth: 1,
        borderBottomColor: cores.borda,
    },
    cabecalhoTextos: {
        gap: 2,
    },
    numero: {
        fontSize: fonte.corpo,
        fontWeight: "700",
        color: cores.texto,
    },
    data: {
        fontSize: fonte.legenda,
        color: cores.textoSecundario,
    },
    status: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaco.xs,
        paddingHorizontal: espaco.sm,
        paddingVertical: espaco.xs,
        borderRadius: raio.pill,
        backgroundColor: cores.sucessoFundo,
    },
    statusTexto: {
        fontSize: fonte.legenda,
        fontWeight: "600",
        color: cores.sucesso,
    },
    itens: {
        padding: espaco.lg,
        gap: espaco.md,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: espaco.md,
    },
    itemTextos: {
        flex: 1,
        gap: 2,
    },
    itemNome: {
        fontSize: fonte.produto,
        fontWeight: "500",
        color: cores.texto,
    },
    itemQtd: {
        fontSize: fonte.legenda,
        color: cores.textoSecundario,
    },
    itemValor: {
        fontSize: fonte.produto,
        fontWeight: "600",
        color: cores.texto,
    },
    rodape: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: espaco.md,
        marginHorizontal: espaco.lg,
        paddingVertical: espaco.lg,
        borderTopWidth: 1,
        borderTopColor: cores.borda,
    },
    pagamento: {
        gap: 2,
    },
    rotulo: {
        fontSize: fonte.legenda,
        color: cores.textoSecundario,
    },
    pagamentoNome: {
        fontSize: fonte.pequeno,
        color: cores.textoSecundario,
        fontWeight: "500",
    },
    totalBox: {
        alignItems: "flex-end",
        gap: 2,
    },
    total: {
        fontSize: fonte.secao,
        fontWeight: "800",
        letterSpacing: -0.5,
        color: cores.texto,
    },
});
