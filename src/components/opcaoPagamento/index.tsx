import { useHover } from "@/hooks/useHover";
import { cores, espaco, fonte, raio } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FormaPagamento, FormaPagamentoId } from "@/types/compra";
import { ComponentProps } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
    const { hover, hoverProps } = useHover();

    return (
        <Pressable
            onPress={() => onSelecionar(forma.id)}
            disabled={desabilitado}
            {...hoverProps}
            style={({ pressed }) => [
                styles.container,
                hover && !selecionada && styles.hover,
                selecionada && styles.selecionada,
                pressed && styles.pressionada,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked: selecionada, disabled: desabilitado }}
            accessibilityLabel={forma.nome}
        >
            <View style={[styles.icone, selecionada && styles.iconeSelecionado]}>
                <Ionicons
                    name={ICONES[forma.id] ?? "wallet-outline"}
                    size={22}
                    color={selecionada ? cores.primariaTexto : cores.texto}
                />
            </View>
            <Text style={styles.nome}>{forma.nome}</Text>
            <Ionicons
                name={selecionada ? "checkmark-circle" : "ellipse-outline"}
                size={24}
                color={selecionada ? cores.texto : cores.bordaHover}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaco.md,
        padding: espaco.lg,
        borderRadius: raio.lg,
        borderWidth: 2,
        borderColor: cores.borda,
        backgroundColor: cores.superficie,
    },
    hover: {
        borderColor: cores.bordaHover,
    },
    selecionada: {
        borderColor: cores.primaria,
    },
    pressionada: {
        opacity: 0.8,
    },
    icone: {
        width: 44,
        height: 44,
        borderRadius: raio.md,
        backgroundColor: cores.neutroAtivo,
        alignItems: "center",
        justifyContent: "center",
    },
    iconeSelecionado: {
        backgroundColor: cores.primaria,
    },
    nome: {
        flex: 1,
        fontSize: fonte.corpo,
        fontWeight: "600",
        color: cores.texto,
    },
});
