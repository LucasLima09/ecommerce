import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

export default function CarrinhoVazio() {
    return (
        <View style={styles.container}>
            <Ionicons name="cart-outline" size={56} color="#C7C7CC" />
            <Text style={styles.texto}>Seu carrinho está vazio.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    texto: {
        fontSize: 16,
        color: "#8E8E93",
    },
});
