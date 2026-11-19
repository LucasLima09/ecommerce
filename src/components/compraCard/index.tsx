import { Compra } from "@/types/compra";
import { formatarData } from "@/utils/formatarData";
import { NOMES_PAGAMENTO } from "@/utils/formasPagamento";
import { formatarPreco } from "@/utils/formatarPreco";
import { StyleSheet, Text, View } from "react-native";

type CompraCardProps = {
    compra: Compra;
};

export default function CompraCard({ compra }: CompraCardProps) {
    return (
        <View style={styles.card}>
            <View style={styles.cabecalho}>
                <Text style={styles.numero}>Pedido nº {compra.id}</Text>
                <Text style={styles.data}>{formatarData(compra.criadaEm)}</Text>
            </View>

            <View style={styles.itens}>
                {compra.itens.map((item) => (
                    <View key={item.produtoId} style={styles.item}>
                        <Text style={styles.itemNome} numberOfLines={1}>
                            {item.quantidade}x {item.nome}
                        </Text>
                        <Text style={styles.itemValor}>{formatarPreco(item.subtotal)}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.rodape}>
                <Text style={styles.pagamento}>{NOMES_PAGAMENTO[compra.formaPagamento]}</Text>
                <Text style={styles.total}>{formatarPreco(compra.total)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        gap: 12,
        borderRadius: 12,
        backgroundColor: "#FFFFFF",
    },
    cabecalho: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 8,
    },
    numero: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1C1C1E",
    },
    data: {
        fontSize: 13,
        color: "#8E8E93",
    },
    itens: {
        gap: 6,
    },
    item: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    itemNome: {
        flex: 1,
        fontSize: 15,
        color: "#3A3A3C",
    },
    itemValor: {
        fontSize: 15,
        color: "#3A3A3C",
    },
    rodape: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E5E5EA",
    },
    pagamento: {
        fontSize: 14,
        color: "#636366",
    },
    total: {
        fontSize: 17,
        fontWeight: "700",
        color: "#1C1C1E",
    },
});
