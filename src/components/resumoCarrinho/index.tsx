import Botao from "@/components/botao";
import { formatarPreco } from "@/utils/formatarPreco";
import { StyleSheet, Text, View } from "react-native";

type ResumoCarrinhoProps = {
    total: number; // em centavos
    tituloBotao: string;
    onConfirmar: () => void;
    desabilitado?: boolean;
    loading?: boolean;
};

export default function ResumoCarrinho({ total, tituloBotao, onConfirmar, desabilitado, loading }: ResumoCarrinhoProps) {
    return (
        <View style={styles.container}>
            <View style={styles.linha}>
                <Text style={styles.label}>Total</Text>
                <Text style={styles.valor}>{formatarPreco(total)}</Text>
            </View>
            <Botao title={tituloBotao} onPress={onConfirmar} disabled={desabilitado} loading={loading} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        gap: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E5E5EA",
    },
    linha: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: 17,
        color: "#636366",
    },
    valor: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1C1C1E",
    },
});
