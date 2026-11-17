import { cores, raio } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps, useState } from "react";
import { Pressable, StyleSheet } from "react-native";

type BotaoIconeProps = {
    icone: ComponentProps<typeof Ionicons>["name"];
    onPress: () => void;
    descricao: string; // lida pelo leitor de tela
    cor?: string;
    tamanho?: number;
    comFundo?: boolean;
    // why: sobre a faixa preta da marca o fundo do botão precisa ser translúcido e o ícone branco.
    inverso?: boolean;
    disabled?: boolean;
};

export default function BotaoIcone({
    icone,
    onPress,
    descricao,
    cor,
    tamanho = 20,
    comFundo = false,
    inverso = false,
    disabled = false,
}: BotaoIconeProps) {
    const [hover, setHover] = useState(false);
    const corIcone = cor ?? (inverso ? cores.primariaTexto : cores.texto);

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            // why: com o hitSlop a área de toque passa dos 44 mesmo quando o ícone é pequeno.
            hitSlop={10}
            onHoverIn={() => setHover(true)}
            onHoverOut={() => setHover(false)}
            style={({ pressed }) => [
                comFundo && styles.fundo,
                comFundo && inverso && styles.fundoInverso,
                hover && !disabled && (inverso ? styles.hoverInverso : styles.hover),
                (pressed || disabled) && styles.apagado,
            ]}
            accessibilityRole="button"
            accessibilityLabel={descricao}
            accessibilityState={{ disabled }}
        >
            <Ionicons name={icone} size={tamanho} color={corIcone} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    fundo: {
        width: 36,
        height: 36,
        borderRadius: raio.pill,
        backgroundColor: cores.superficie,
        borderWidth: 1,
        borderColor: cores.borda,
        alignItems: "center",
        justifyContent: "center",
    },
    fundoInverso: {
        width: 44,
        height: 44,
        backgroundColor: "transparent",
        borderColor: cores.bordaInversa,
    },
    hover: {
        borderColor: cores.bordaHover,
        backgroundColor: cores.neutroAtivo,
        borderRadius: raio.pill,
    },
    hoverInverso: {
        borderColor: cores.primariaTexto,
        backgroundColor: cores.superficieInversaHover,
    },
    apagado: {
        opacity: 0.5,
    },
});
