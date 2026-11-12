import Ionicons from "@expo/vector-icons/Ionicons";
import { FormaPagamento, FormaPagamentoId } from "@/types/compra";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const ICONES: Record<FormaPagamentoId, ComponentProps<typeof Ionicons>["name"]> = {
    pix: "qr-code-outline",
    cartao: "card-outline",
    boleto: "barcode-outline",
};

type OpcaoPagamentoProps = {
    forma: FormaPagamento;
    selecionada: boolean;
    onSelecionar: (id: FormaPagamentoId) => void;
    desabilitado?: boolean;
};

export default function OpcaoPagamento({ forma, selecionada, onSelecionar, desabilitado }: OpcaoPagamentoProps) {
    return (
        <Pressable
            onPress={() => onSelecionar(forma.id)}
            disabled={desabilitado}
            style={({ pressed }) => [styles.container, selecionada && styles.selecionada, pressed && styles.pressionada]}
            accessibilityRole="radio"
            accessibilityState={{ checked: selecionada, disabled: desabilitado }}
            accessibilityLabel={forma.nome}
        >
            <Ionicons name={ICONES[forma.id] ?? "wallet-outline"} size={24} color="#1C1C1E" />
            <Text style={styles.nome}>{forma.nome}</Text>
            <Ionicons
                name={selecionada ? "radio-button-on" : "radio-button-off"}
                size={22}
                color={selecionada ? "#1C1C1E" : "#C7C7CC"}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: "transparent",
        backgroundColor: "#FFFFFF",
    },
    selecionada: {
        borderColor: "#1C1C1E",
    },
    pressionada: {
        opacity: 0.7,
    },
    nome: {
        flex: 1,
        fontSize: 16,
        fontWeight: "500",
        color: "#1C1C1E",
    },
});
