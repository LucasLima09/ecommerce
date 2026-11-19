import { cores, espaco, raio } from "@/theme";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";

type EsqueletoGradeProps = {
    colunas: number;
    linhas?: number;
};

// why: enquanto os produtos carregam, a grade cinza no mesmo formato evita o "pulo" de layout quando os cards chegam.
export default function EsqueletoGrade({ colunas, linhas = 3 }: EsqueletoGradeProps) {
    const opacidade = useSharedValue(1);

    useEffect(() => {
        opacidade.value = withRepeat(withTiming(0.45, { duration: 800 }), -1, true);
    }, [opacidade]);

    const pulso = useAnimatedStyle(() => ({ opacity: opacidade.value }));

    return (
        <View style={styles.grade} accessibilityLabel="Carregando produtos" accessibilityRole="progressbar">
            {Array.from({ length: linhas }, (_, l) => (
                <View key={l} style={styles.linha}>
                    {Array.from({ length: colunas }, (_, c) => (
                        <Animated.View key={c} style={[styles.card, pulso]}>
                            <View style={styles.foto} />
                            <View style={styles.textos}>
                                <View style={[styles.barra, { width: "85%" }]} />
                                <View style={[styles.barra, { width: "55%" }]} />
                                <View style={[styles.barra, styles.preco]} />
                            </View>
                        </Animated.View>
                    ))}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grade: {
        gap: espaco.md,
    },
    linha: {
        flexDirection: "row",
        gap: espaco.md,
    },
    card: {
        flex: 1,
        backgroundColor: cores.superficie,
        borderRadius: raio.lg,
        borderWidth: 1,
        borderColor: cores.borda,
        overflow: "hidden",
    },
    foto: {
        aspectRatio: 1,
        backgroundColor: cores.neutroAtivo,
    },
    textos: {
        padding: espaco.md,
        gap: espaco.sm,
    },
    barra: {
        height: 12,
        borderRadius: raio.sm,
        backgroundColor: cores.neutroAtivo,
    },
    preco: {
        width: "40%",
        height: 16,
        marginTop: espaco.xs,
    },
});
