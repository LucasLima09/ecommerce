import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";
import { Pressable, StyleSheet } from "react-native";

type BotaoIconeProps = {
    icone: ComponentProps<typeof Ionicons>["name"];
    onPress: () => void;
    descricao: string; // lida pelo leitor de tela
    cor?: string;
    tamanho?: number;
    comFundo?: boolean;
    disabled?: boolean;
};

export default function BotaoIcone({
    icone,
    onPress,
    descricao,
    cor = "#1C1C1E",
    tamanho = 20,
    comFundo = false,
    disabled = false,
}: BotaoIconeProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            hitSlop={10}
            style={({ pressed }) => [comFundo && styles.fundo, (pressed || disabled) && styles.apagado]}
            accessibilityRole="button"
            accessibilityLabel={descricao}
        >
            <Ionicons name={icone} size={tamanho} color={cor} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    fundo: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#F2F2F7",
        alignItems: "center",
        justifyContent: "center",
    },
    apagado: {
        opacity: 0.5,
    },
});
