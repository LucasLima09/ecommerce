import ProdutoCard from "@/components/produtoCard";
import { getProdutos } from "@/service/produtosService";
import { Produto } from "@/types/produto";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

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
        <View style={styles.container}>
            <Text style={styles.title}>ATTURA</Text>
            <Text style={styles.subtitle}>Bem vindo!</Text>
            <Text>Tudo que você precisa aqui</Text>
            <FlatList
                data={produtos}
                renderItem={({ item }) => (
                    <ProdutoCard
                        produto={item}
                        onAddToCart={(produto) => {
                            // TODO: integrar com carrinhoService / auth
                            console.log("Adicionar ao carrinho:", produto.id);
                        }}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        flex: 1,
        backgroundColor: "#F2F2F7",
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