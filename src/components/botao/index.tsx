import { useHover } from "@/hooks/useHover";
import { cores, fonte, raio, sombra } from "@/theme";
import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";

type BotaoProps = {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
};

export default function Botao({ title, onPress, loading, disabled }: BotaoProps) {
    const inactive = disabled || loading;
    const { hover, hoverProps } = useHover();

    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                inactive && styles.buttonDisabled,
                hover && !inactive && styles.buttonHover,
                pressed && !inactive && styles.buttonPressed,
            ]}
            {...hoverProps}
            onPress={onPress}
            disabled={inactive}
            accessibilityRole="button"
            accessibilityLabel={title}
            accessibilityState={{ disabled: !!inactive, busy: !!loading }}
        >
            {loading ? (
                <ActivityIndicator color={cores.primariaTexto} />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: cores.primaria,
        height: 52,
        borderRadius: raio.md,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonHover: {
        backgroundColor: cores.primariaHover,
        transform: [{ translateY: -1 }],
        ...sombra.suave,
    },
    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
        backgroundColor: cores.desabilitado,
    },
    text: {
        color: cores.primariaTexto,
        fontSize: fonte.corpo,
        fontWeight: "600",
    },
});
