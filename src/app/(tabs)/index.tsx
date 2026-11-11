import ProdutoCard from "@/components/produtoCard";
import { logoutUser } from "@/service/authService";
import { getProdutos } from "@/service/produtosService";
import { Produto } from "@/types/produto";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { useCarrinho } from "@/context/CarrinhoContext";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    // incrementar dispara uma nova busca (botão "Tentar novamente")
    const [tentativa, setTentativa] = useState(0);
    const { adicionar } = useCarrinho();

    useEffect(() => {
        let ativo = true; // evita setState se a tela sair antes da resposta chegar

        getProdutos()
            .then((data) => {
                if (ativo) setProdutos(data);
            })
            .catch(() => {
                if (ativo) setErro("Não foi possível carregar os produtos.");
            })
            .finally(() => {
                if (ativo) setLoading(false);
            });

        return () => {
            ativo = false;
        };
    }, [tentativa]);

    async function adicionarAoCarrinho(produto: Produto) {
        try {
            await adicionar(produto.id);
            Alert.alert("Carrinho", `${produto.nome} foi adicionado ao carrinho.`);
        } catch (e) {
            Alert.alert("Não foi possível adicionar", (e as Error).message);
        }
    }

    function tentarNovamente() {
        setErro(null);
        setLoading(true);
        setTentativa((t) => t + 1);
    }

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
            {loading ? (
                <View style={styles.centro}>
                    <ActivityIndicator size="large" color="#1C1C1E" />
                </View>
            ) : erro ? (
                <View style={styles.centro}>
                    <Text style={styles.erro}>{erro}</Text>
                    <Pressable onPress={tentarNovamente} style={styles.botao} accessibilityRole="button">
                        <Text style={styles.botaoTexto}>Tentar novamente</Text>
                    </Pressable>
                </View>
            ) : (
            <FlatList
                data={produtos}
                renderItem={({ item }) => (
                    <ProdutoCard
                        produto={item}
                        onAddToCart={adicionarAoCarrinho}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
            )}
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
    centro: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    erro: {
        fontSize: 15,
        color: "#636366",
        textAlign: "center",
    },
    botao: {
        backgroundColor: "#1C1C1E",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 980,
    },
    botaoTexto: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
});