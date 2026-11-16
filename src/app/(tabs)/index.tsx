import BotaoIcone from "@/components/botaoIcone";
import CampoBusca from "@/components/campoBusca";
import FiltroCategorias from "@/components/filtroCategorias";
import { getCategorias } from "@/service/categoriasService";
import { Carregando, Erro } from "@/components/estadoTela";
import ProdutoCard from "@/components/produtoCard";
import { logoutUser } from "@/service/authService";
import { getProdutos } from "@/service/produtosService";
import { Categoria, Produto } from "@/types/produto";
import { useEffect, useState } from "react";
import { useCarrinho } from "@/context/CarrinhoContext";
import { router } from "expo-router";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {

    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    // incrementar dispara uma nova busca (botão "Tentar novamente")
    const [tentativa, setTentativa] = useState(0);
    const { adicionar } = useCarrinho();
    const [textoBusca, setTextoBusca] = useState("");
    const [busca, setBusca] = useState("");
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [categoria, setCategoria] = useState<Categoria["id"] | null>(null);

    // why: se as categorias falharem, a Home continua funcionando só sem os filtros.
    useEffect(() => {
        getCategorias().then(setCategorias).catch(() => setCategorias([]));
    }, []);

    // why: sem esse atraso, cada letra digitada faria uma chamada à API.
    useEffect(() => {
        const timer = setTimeout(() => setBusca(textoBusca.trim()), 400);
        return () => clearTimeout(timer);
    }, [textoBusca]);

    useEffect(() => {
        let ativo = true; // evita setState se a tela sair antes da resposta chegar

        async function carregar() {
            setLoading(true);
            setErro(null);
            try {
                const data = await getProdutos({ busca: busca || undefined, categoria: categoria ?? undefined });
                if (ativo) setProdutos(data);
            } catch {
                if (ativo) setErro("Não foi possível carregar os produtos.");
            } finally {
                if (ativo) setLoading(false);
            }
        }
        carregar();

        return () => {
            ativo = false;
        };
    }, [busca, categoria, tentativa]);

    async function adicionarAoCarrinho(produto: Produto) {
        try {
            await adicionar(produto.id);
            Alert.alert("Carrinho", `${produto.nome} foi adicionado ao carrinho.`);
        } catch (e) {
            Alert.alert("Não foi possível adicionar", (e as Error).message);
        }
    }

    const tentarNovamente = () => setTentativa((t) => t + 1);

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <View style={styles.header}>
                <Text style={styles.title}>ATTURA</Text>
                <BotaoIcone icone="log-out-outline" tamanho={26} descricao="Sair da conta" onPress={logoutUser} />
            </View>
            <Text style={styles.subtitle}>Bem vindo!</Text>
            <Text>Tudo que você precisa aqui</Text>
            <View style={styles.busca}>
                <CampoBusca valor={textoBusca} onChange={setTextoBusca} />
                {categorias.length > 0 && (
                    <FiltroCategorias categorias={categorias} selecionada={categoria} onSelecionar={setCategoria} />
                )}
            </View>
            {loading ? (
                <Carregando />
            ) : erro ? (
                <Erro mensagem={erro} onTentarNovamente={tentarNovamente} />
            ) : (
            <FlatList
                data={produtos}
                renderItem={({ item }) => (
                    <ProdutoCard
                        produto={item}
                        onAddToCart={adicionarAoCarrinho}
                        onPress={(produto) =>
                            router.push({ pathname: "/produto/[id]", params: { id: produto.id.toString() } })
                        }
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto encontrado.</Text>}
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
    busca: {
        marginTop: 16,
        gap: 12,
    },
    vazio: {
        marginTop: 32,
        fontSize: 15,
        color: "#8E8E93",
        textAlign: "center",
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