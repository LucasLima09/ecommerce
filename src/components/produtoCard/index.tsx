import { Produto } from "@/types/produto";
import { formatarPreco } from "@/utils/formatarPreco";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ProdutoCardProps = {
    produto: Produto;
    onAddToCart?: (produto: Produto) => void;
    onPress?: (produto: Produto) => void;
};

export default function ProdutoCard({ produto, onAddToCart, onPress }: ProdutoCardProps) {
    const semEstoque = produto.estoque <= 0;

    return (
        <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => onPress?.(produto)}
            accessibilityRole="button"
            accessibilityLabel={`Ver detalhes de ${produto.nome}`}
        >
            <Image
                source={{ uri: produto.imagem }}
                style={styles.image}
                contentFit="cover"
                transition={200}
            />

            <View style={styles.content}>
                <Text style={styles.category}>{produto.categoria}</Text>
                <Text style={styles.name} numberOfLines={2}>
                    {produto.nome}
                </Text>
                <Text style={styles.description} numberOfLines={2}>
                    {produto.descricao}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.price}>{formatarPreco(produto.preco)}</Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.button,
                            semEstoque && styles.buttonDisabled,
                            pressed && !semEstoque && styles.buttonPressed,
                        ]}
                        onPress={() => onAddToCart?.(produto)}
                        disabled={semEstoque}
                        accessibilityRole="button"
                        accessibilityLabel={
                            semEstoque
                                ? "Produto indisponível"
                                : `Adicionar ${produto.nome} ao carrinho`
                        }
                    >
                        {semEstoque ? (
                            <Text style={styles.buttonText}>Indisponível</Text>
                        ) : (
                            <View style={styles.buttonContent}>
                                <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
                                <Text style={styles.buttonText}>Adicionar</Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: "#E5E5EA",
    },
    cardPressed: {
        opacity: 0.85,
    },
    image: {
        width: "100%",
        height: 180,
        backgroundColor: "#F2F2F7",
    },
    content: {
        padding: 16,
        gap: 6,
    },
    category: {
        fontSize: 12,
        fontWeight: "500",
        color: "#8E8E93",
        textTransform: "capitalize",
        letterSpacing: 0.3,
    },
    name: {
        fontSize: 17,
        fontWeight: "600",
        color: "#1C1C1E",
    },
    description: {
        fontSize: 14,
        lineHeight: 20,
        color: "#636366",
    },
    footer: {
        marginTop: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },
    price: {
        flex: 1,
        fontSize: 18,
        fontWeight: "700",
        color: "#1C1C1E",
    },
    button: {
        backgroundColor: "#1C1C1E",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 980,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonDisabled: {
        backgroundColor: "#C7C7CC",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
});
