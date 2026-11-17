import { cores, espaco, larguraConteudo, raio, sombra } from "@/theme";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

// invariant: a barra fica no fluxo do layout, abaixo da lista, então nunca cobre o último item.
export default function BarraInferior({ children }: { children: ReactNode }) {
    return (
        <View style={styles.superficie}>
            <View style={[larguraConteudo, styles.conteudo]}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    superficie: {
        backgroundColor: cores.superficie,
        borderTopLeftRadius: raio.xl,
        borderTopRightRadius: raio.xl,
        borderWidth: 1,
        borderBottomWidth: 0,
        borderColor: cores.borda,
        paddingHorizontal: espaco.tela,
        paddingTop: espaco.tela,
        paddingBottom: espaco.lg,
        ...sombra.suave,
    },
    conteudo: {
        gap: espaco.md,
    },
});
