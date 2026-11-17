import BarraInferior from "@/components/barraInferior";
import Botao from "@/components/botao";
import { cores, espaco, fonte } from "@/theme";
import { formatarPreco } from "@/utils/formatarPreco";
import { StyleSheet, Text, View } from "react-native";

type ResumoCarrinhoProps = {
    total: number; // em centavos
    quantidadeItens?: number;
    tituloBotao: string;
    onConfirmar: () => void;
    desabilitado?: boolean;
    loading?: boolean;
};

export default function ResumoCarrinho({ total, quantidadeItens, tituloBotao, onConfirmar, desabilitado, loading }: ResumoCarrinhoProps) {
    return (
        <BarraInferior>
            {quantidadeItens !== undefined && (
                <View style={styles.linha}>
                    <Text style={styles.label}>Subtotal ({quantidadeItens} {quantidadeItens === 1 ? "item" : "itens"})</Text>
                    <Text style={styles.label}>{formatarPreco(total)}</Text>
                </View>
            )}
            <View style={styles.linha}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValor}>{formatarPreco(total)}</Text>
            </View>
            <Botao title={tituloBotao} onPress={onConfirmar} disabled={desabilitado} loading={loading} />
        </BarraInferior>
    );
}

const styles = StyleSheet.create({
    linha: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        gap: espaco.md,
    },
    label: {
        fontSize: fonte.pequeno,
        color: cores.textoSecundario,
    },
    totalLabel: {
        fontSize: fonte.corpo,
        fontWeight: "600",
        color: cores.texto,
    },
    totalValor: {
        fontSize: fonte.secao,
        fontWeight: "800",
        letterSpacing: -0.5,
        color: cores.texto,
    },
});
