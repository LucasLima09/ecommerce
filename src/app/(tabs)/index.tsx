import ProdutoCard from "@/components/produtoCard";
import { logoutUser } from "@/service/authService";
import { getProdutos } from "@/service/produtosService";
import { Produto } from "@/types/produto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {

    const [produtos, setProdutos] = useState<Produto[]>([]);

    async function buscarProdutos() {
        const data = await getProdutos();
        setProdutos(data);
    }

    useEffect(() => {
        buscarProdutos();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <Text style={styles.title}>ATTURA</Text>
                <Pressable
                    onPress={logoutUser}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Sair da conta"
                >
                    <Ionicons name="log-out-outline" size={26} color="#1C1C1E" />
                </Pressable>
            </View>
            <Text style={styles.subtitle}>Bem vindo!</Text>
            <Text>Tudo que você precisa aqui</Text>
            <FlatList
                data={produtos}
                renderItem={({ item }) => (
                    <ProdutoCard
                        produto={item}
                        onAddToCart={(produto) => {
                            console.log("Adicionar ao carrinho:", produto.id);
                        }}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        flex: 1,
        backgroundColor: "#F2F2F7",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    list: {
        paddingTop: 16,
        paddingBottom: 24,
        gap: 14,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1C1C1E",
        letterSpacing: 1,
    },
    subtitle: {
        fontSize: 16,
        color: "#636366",
        marginTop: 4,
    },
});