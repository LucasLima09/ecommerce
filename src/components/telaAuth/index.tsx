import Botao from "@/components/botao";
import Ionicons from "@expo/vector-icons/Ionicons";
import { cores, espaco, fonte, raio, TOQUE_MIN } from "@/theme";
import { LogoBranco, SimboloA } from "@/components/marca";
import { Href, Link } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ReactNode, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type TelaAuthProps = {
    titulo: string;
    subtitulo: string;
    erroGeral?: string;
    children: ReactNode;
    acao: string;
    onAcao: () => void;
    loading: boolean;
    rodapeTexto: string;
    rodapeLink: string;
    rodapeHref: Href;
};

// why: abaixo dessa altura (Safari com as barras visíveis, celulares pequenos) a tela entra no modo compacto
// para o formulário inteiro caber sem precisar rolar.
const ALTURA_COMPACTA = 760;

export default function TelaAuth({ titulo, subtitulo, erroGeral, children, acao, onAcao, loading, rodapeTexto, rodapeLink, rodapeHref }: TelaAuthProps) {
    const insets = useSafeAreaInsets();
    const { width, height } = useWindowDimensions();
    const compacta = height < ALTURA_COMPACTA;
    const [linkHover, setLinkHover] = useState(false);

    // why: o slogan acompanha a largura da tela, sem ficar minúsculo no celular nem gigante na web.
    const tamanhoSlogan = Math.min(30, Math.max(22, width * 0.065));

    return (
        // why: o topo fica fora da área segura para a faixa preta passar por trás da barra de status.
        <SafeAreaView style={styles.safe} edges={["bottom", "left", "right"]}>
            <StatusBar style="light" />
            <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={[
                            styles.hero,
                            {
                                paddingTop: insets.top + (compacta ? espaco.xl : espaco.xxl + espaco.lg),
                            },
                        ]}
                    >
                        <Animated.View
                            entering={FadeIn.duration(900).delay(150)}
                            style={[styles.simbolo, { top: insets.top + (compacta ? espaco.lg : espaco.xxl) }]}
                        >
                            <SimboloA style={styles.flex} />
                        </Animated.View>

                        <Animated.View entering={FadeInDown.duration(500)} style={styles.largura}>
                            <LogoBranco style={[styles.logo, compacta && styles.logoCompacto]} />
                            <Text
                                style={[styles.slogan, { fontSize: tamanhoSlogan, lineHeight: tamanhoSlogan * 1.15 }]}
                                accessibilityRole="header"
                            >
                                Suas compras{"\n"}
                                <Text style={styles.sloganDestaque}>em um só lugar.</Text>
                            </Text>
                        </Animated.View>
                    </View>

                    <Animated.View
                        entering={FadeInDown.duration(550).delay(120)}
                        style={[styles.largura, styles.corpo, compacta && styles.corpoCompacto]}
                    >
                        <LinearGradient
                            colors={[cores.superficie, cores.cartaoDegrade]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={[styles.cartao, compacta && styles.cartaoCompacto]}
                        >
                            <View style={styles.header}>
                                <Text style={styles.titulo}>{titulo}</Text>
                                <Text style={styles.subtitulo}>{subtitulo}</Text>
                            </View>

                            <View style={[styles.form, compacta && styles.formCompacto]}>
                                {children}
                                {!!erroGeral && (
                                    <Text style={styles.erroGeral} accessibilityRole="alert">
                                        {erroGeral}
                                    </Text>
                                )}
                                <Botao title={acao} onPress={onAcao} loading={loading} />
                            </View>
                        </LinearGradient>

                        <View style={styles.rodape}>
                            <Text style={styles.rodapeTexto}>{rodapeTexto}</Text>
                            <Link href={rodapeHref} asChild>
                                <Pressable
                                    style={styles.link}
                                    accessibilityRole="link"
                                    hitSlop={4}
                                    onHoverIn={() => setLinkHover(true)}
                                    onHoverOut={() => setLinkHover(false)}
                                >
                                    {({ pressed }) => (
                                        <View style={[styles.linkConteudo, (linkHover || pressed) && styles.linkAtivo]}>
                                            <Text style={styles.linkTexto}>{rodapeLink}</Text>
                                            <Ionicons name="arrow-forward" size={16} color={cores.primariaTexto} />
                                        </View>
                                    )}
                                </Pressable>
                            </Link>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        // invariant: a tela inteira é preta; só o cartão do formulário é claro.
        backgroundColor: cores.primaria,
    },
    flex: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        // why: em telas altas o conteúdo fica centralizado em vez de colado no topo.
        justifyContent: "center",
        paddingBottom: espaco.lg,
    },
    hero: {
        paddingHorizontal: espaco.xl,
        paddingBottom: espaco.xl,
    },
    simbolo: {
        position: "absolute",
        right: espaco.xl,
        width: 112,
        aspectRatio: 554 / 516,
        opacity: 0.22,
    },
    largura: {
        width: "100%",
        // why: em tablets e na web larga o formulário esticado fica difícil de ler.
        maxWidth: 420,
        alignSelf: "center",
    },
    logo: {
        width: 140,
        marginBottom: espaco.lg,
    },
    logoCompacto: {
        width: 120,
        marginBottom: espaco.md,
    },
    slogan: {
        fontWeight: "800",
        color: cores.primariaTexto,
        letterSpacing: -0.5,
        // why: o slogan não pode passar por baixo do símbolo do A no canto direito.
        maxWidth: 240,
    },
    sloganDestaque: {
        color: cores.textoInverso,
        fontWeight: "600",
    },
    corpo: {
        paddingHorizontal: espaco.xl,
        gap: espaco.lg,
    },
    corpoCompacto: {
        gap: espaco.md,
    },
    cartao: {
        borderRadius: raio.lg,
        padding: espaco.xl,
        gap: espaco.xl,
    },
    cartaoCompacto: {
        padding: espaco.lg + espaco.xs,
        gap: espaco.lg,
    },
    header: {
        alignItems: "center",
        gap: espaco.xs,
        paddingBottom: espaco.lg,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: cores.borda,
    },
    titulo: {
        fontSize: fonte.secao + 2,
        fontWeight: "600",
        letterSpacing: -0.4,
        color: cores.texto,
        textAlign: "center",
    },
    subtitulo: {
        fontSize: fonte.pequeno,
        color: cores.textoSecundario,
        textAlign: "center",
    },
    form: {
        gap: espaco.lg,
    },
    formCompacto: {
        gap: espaco.md,
    },
    erroGeral: {
        fontSize: fonte.pequeno,
        color: cores.erro,
        textAlign: "center",
    },
    rodape: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: espaco.md,
    },
    rodapeTexto: {
        fontSize: fonte.corpo,
        color: cores.textoInverso,
    },
    link: {
        minHeight: TOQUE_MIN,
        justifyContent: "center",
    },
    linkConteudo: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaco.xs + 2,
        paddingVertical: espaco.sm,
        paddingHorizontal: espaco.md + 2,
        borderRadius: raio.pill,
        borderWidth: 1,
        borderColor: cores.bordaInversa,
    },
    linkAtivo: {
        backgroundColor: cores.superficieInversaHover,
        borderColor: cores.primariaTexto,
    },
    linkTexto: {
        fontSize: fonte.corpo,
        fontWeight: "700",
        color: cores.primariaTexto,
    },
});
