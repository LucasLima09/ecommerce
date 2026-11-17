import { SimboloA } from "@/components/marca";
import { cores, espaco, fonte, larguraConteudo, raio } from "@/theme";
import { useIsFocused } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FaixaMarcaProps = {
    titulo: string;
    subtitulo?: string;
    // why: linha acima do título (logo e sair na Home, botão de voltar nas telas internas).
    topo?: ReactNode;
    // why: conteúdo abaixo do título dentro da faixa, como a busca da Home.
    children?: ReactNode;
};

export default function FaixaMarca({ titulo, subtitulo, topo, children }: FaixaMarcaProps) {
    const insets = useSafeAreaInsets();
    const focada = useIsFocused();

    return (
        <View style={[styles.faixa, { paddingTop: insets.top + espaco.lg }]}>
            {/* why: abas e telas da pilha ficam montadas; sem o foco, a barra de status clara vazaria para telas de fundo claro. */}
            {focada && <StatusBar style="light" />}
            <SimboloA style={styles.simbolo} />
            <View style={larguraConteudo}>
                {!!topo && <View style={styles.topo}>{topo}</View>}
                <Text style={styles.titulo} accessibilityRole="header">
                    {titulo}
                </Text>
                {!!subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
                {!!children && <View style={styles.extra}>{children}</View>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    faixa: {
        backgroundColor: cores.primaria,
        paddingHorizontal: espaco.tela,
        paddingBottom: espaco.xl,
        borderBottomLeftRadius: raio.xl,
        borderBottomRightRadius: raio.xl,
        overflow: "hidden",
    },
    simbolo: {
        position: "absolute",
        right: -espaco.xl,
        bottom: -espaco.xl,
        width: 150,
        opacity: 0.1,
    },
    topo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: espaco.lg,
    },
    titulo: {
        fontSize: fonte.titulo,
        fontWeight: "800",
        letterSpacing: -0.5,
        color: cores.primariaTexto,
    },
    subtitulo: {
        marginTop: espaco.xs,
        fontSize: fonte.pequeno,
        color: cores.textoInverso,
    },
    extra: {
        marginTop: espaco.lg,
    },
});
