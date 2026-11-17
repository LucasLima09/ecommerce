import { cores, espaco, fonte, raio, sombra, TOQUE_MIN } from "@/theme";
import { Produto } from "@/types/produto";
import { formatarPreco } from "@/utils/formatarPreco";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

type ProdutoCardProps = {
    produto: Produto;
    // why: o produto só traz o id da categoria ("eletronicos"); o nome legível vem da lista de categorias da API.
    nomeCategoria?: string;
    // invariant: resolve true quando o produto entrou no carrinho; o card só mostra a confirmação nesse caso.
    onAddToCart?: (produto: Produto) => Promise<boolean>;
    onPress?: (produto: Produto) => void;
};

type EstadoBotao = "parado" | "adicionando" | "adicionado";

// why: tempo suficiente para o usuário perceber a confirmação sem travar novos cliques por muito tempo.
const DURACAO_CONFIRMACAO = 1600;

export default function ProdutoCard({ produto, nomeCategoria, onAddToCart, onPress }: ProdutoCardProps) {
    const semEstoque = produto.estoque <= 0;
    const [hoverCard, setHoverCard] = useState(false);
    const [hoverBotao, setHoverBotao] = useState(false);
    const [estado, setEstado] = useState<EstadoBotao>("parado");

    useEffect(() => {
        if (estado !== "adicionado") return;
        const timer = setTimeout(() => setEstado("parado"), DURACAO_CONFIRMACAO);
        return () => clearTimeout(timer);
    }, [estado]);

    async function adicionar() {
        if (!onAddToCart || estado === "adicionando") return;
        setEstado("adicionando");
        const ok = await onAddToCart(produto);
        setEstado(ok ? "adicionado" : "parado");
    }

    const bloqueado = semEstoque || estado === "adicionando";

    return (
        <View
            style={[styles.card, hoverCard && styles.cardHover]}
            onPointerEnter={() => setHoverCard(true)}
            onPointerLeave={() => setHoverCard(false)}
        >
            {/* hazard: no navegador o Pressable vira <button>; envolver o botão de adicionar geraria <button> dentro de <button>. */}
            <Pressable
                style={({ pressed }) => pressed && styles.cardPressed}
                onPress={() => onPress?.(produto)}
                accessibilityRole="button"
                accessibilityLabel={`Ver detalhes de ${produto.nome}`}
            >
                <View style={styles.imagemBox}>
                    <Image
                        source={{ uri: produto.imagem }}
                        style={[styles.image, hoverCard && styles.imageHover]}
                        contentFit="cover"
                        transition={200}
                    />
                    <View style={styles.selos}>
                        <View style={styles.seloCategoria}>
                            <Text style={styles.seloCategoriaTexto} numberOfLines={1}>
                                {nomeCategoria ?? produto.categoria}
                            </Text>
                        </View>
                        {semEstoque && (
                            <View style={styles.selo}>
                                <Text style={styles.seloTexto}>Esgotado</Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.name} numberOfLines={2}>
                        {produto.nome}
                    </Text>
                </View>
            </Pressable>

            <View style={styles.footer}>
                <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
                    {formatarPreco(produto.preco)}
                </Text>

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        hoverBotao && !bloqueado && styles.buttonHover,
                        estado === "adicionado" && styles.buttonSucesso,
                        semEstoque && styles.buttonDisabled,
                        pressed && !bloqueado && styles.buttonPressed,
                    ]}
                    onPress={adicionar}
                    // why: o círculo tem 40; o hitSlop leva a área de toque acima dos 44 recomendados.
                    hitSlop={4}
                    onHoverIn={() => setHoverBotao(true)}
                    onHoverOut={() => setHoverBotao(false)}
                    disabled={bloqueado}
                    accessibilityRole="button"
                    accessibilityState={{ disabled: bloqueado, busy: estado === "adicionando" }}
                    accessibilityLabel={
                        semEstoque
                            ? "Produto indisponível"
                            : estado === "adicionado"
                              ? `${produto.nome} adicionado ao carrinho`
                              : `Adicionar ${produto.nome} ao carrinho`
                    }
                >
                    {estado === "adicionando" ? (
                        <ActivityIndicator size="small" color={cores.primariaTexto} />
                    ) : (
                        <Ionicons
                            name={estado === "adicionado" ? "checkmark" : semEstoque ? "close" : "add"}
                            size={22}
                            color={cores.primariaTexto}
                        />
                    )}
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        backgroundColor: cores.superficie,
        borderRadius: raio.lg,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: cores.borda,
    },
    cardHover: {
        borderColor: cores.bordaHover,
        transform: [{ translateY: -2 }],
        ...sombra.suave,
    },
    cardPressed: {
        opacity: 0.9,
    },
    imagemBox: {
        backgroundColor: cores.neutroAtivo,
        overflow: "hidden",
    },
    image: {
        width: "100%",
        // invariant: todas as fotos quadradas, para os cards ficarem alinhados na grade.
        aspectRatio: 1,
    },
    imageHover: {
        transform: [{ scale: 1.04 }],
    },
    selos: {
        position: "absolute",
        top: espaco.sm,
        left: espaco.sm,
        right: espaco.sm,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: espaco.xs,
    },
    seloCategoria: {
        maxWidth: "100%",
        backgroundColor: "rgba(255,255,255,0.88)",
        paddingHorizontal: espaco.sm,
        paddingVertical: espaco.xs,
        borderRadius: raio.pill,
    },
    seloCategoriaTexto: {
        color: cores.texto,
        fontSize: fonte.legenda - 1,
        fontWeight: "600",
        textTransform: "capitalize",
    },
    selo: {
        backgroundColor: cores.primaria,
        paddingHorizontal: espaco.sm,
        paddingVertical: espaco.xs,
        borderRadius: raio.pill,
    },
    seloTexto: {
        color: cores.primariaTexto,
        fontSize: fonte.legenda - 1,
        fontWeight: "700",
    },
    content: {
        paddingHorizontal: espaco.md,
        paddingTop: espaco.md,
    },
    name: {
        fontSize: fonte.produto - 1,
        lineHeight: 20,
        fontWeight: "600",
        color: cores.texto,
        // why: reserva sempre duas linhas, para preços e botões ficarem na mesma altura em toda a grade.
        minHeight: 40,
    },
    footer: {
        paddingHorizontal: espaco.md,
        paddingTop: espaco.sm,
        paddingBottom: espaco.md,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: espaco.sm,
        marginTop: "auto",
    },
    price: {
        flex: 1,
        fontSize: fonte.corpo + 1,
        fontWeight: "700",
        letterSpacing: -0.3,
        color: cores.texto,
    },
    button: {
        width: TOQUE_MIN - 4,
        height: TOQUE_MIN - 4,
        borderRadius: raio.pill,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: cores.primaria,
    },
    buttonHover: {
        backgroundColor: cores.primariaHover,
        transform: [{ scale: 1.06 }],
    },
    buttonSucesso: {
        backgroundColor: cores.sucesso,
    },
    buttonPressed: {
        opacity: 0.85,
        transform: [{ scale: 0.94 }],
    },
    buttonDisabled: {
        backgroundColor: cores.desabilitado,
    },
});
