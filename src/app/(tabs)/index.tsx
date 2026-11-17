import BotaoIcone from "@/components/botaoIcone";
import CampoBusca from "@/components/campoBusca";
import FiltroCategorias from "@/components/filtroCategorias";
import { getCategorias } from "@/service/categoriasService";
import { Erro, EstadoVazio } from "@/components/estadoTela";
import EsqueletoGrade from "@/components/esqueletoProduto";
import ProdutoCard from "@/components/produtoCard";
import { logoutUser } from "@/service/authService";
import { getProdutos } from "@/service/produtosService";
import { Categoria, Produto } from "@/types/produto";
import { useEffect, useState } from "react";
import { useCarrinho } from "@/context/CarrinhoContext";
import { router, useIsFocused } from "expo-router";
import { LogoBranco, SimboloA } from "@/components/marca";
import { StatusBar } from "expo-status-bar";
import { cores, espaco, fonte, raio } from "@/theme";
import { Alert, FlatList, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// why: no celular a vitrine usa 2 colunas; tablet e web larga ganham mais colunas sem esticar as fotos.
function colunasPara(largura: number) {
    if (largura >= 1000) return 4;
    if (largura >= 700) return 3;
    return 2;
}

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

    // why: o sucesso aparece no próprio botão do card ("Adicionado"); só o erro precisa de alerta.
    async function adicionarAoCarrinho(produto: Produto): Promise<boolean> {
        try {
            await adicionar(produto.id);
            return true;
        } catch (e) {
            Alert.alert("Não foi possível adicionar", (e as Error).message);
            return false;
        }
    }

    const tentarNovamente = () => setTentativa((t) => t + 1);
    const limparFiltros = () => {
        setTextoBusca("");
        setCategoria(null);
    };

    const insets = useSafeAreaInsets();
    const focada = useIsFocused();
    const { width } = useWindowDimensions();
    const colunas = colunasPara(width);
    const nomesCategoria = Object.fromEntries(categorias.map((c) => [c.id, c.nome]));
    const temFiltro = !!busca || categoria !== null;

    const tituloSecao = busca
        ? `Resultados para “${busca}”`
        : categoria
          ? (nomesCategoria[categoria] ?? "Produtos")
          : "Todos os produtos";

    const cabecalhoSecao = (
        <View style={styles.secao}>
            <Text style={styles.secaoTitulo} numberOfLines={1}>
                {tituloSecao}
            </Text>
            {!loading && !erro && (
                <Text style={styles.secaoContagem}>
                    {produtos.length} {produtos.length === 1 ? "item" : "itens"}
                </Text>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            {/* why: as abas ficam montadas; sem o foco, a barra de status clara vazaria para Carrinho e Histórico. */}
            {focada && <StatusBar style="light" />}
            <View style={[styles.hero, { paddingTop: insets.top + espaco.lg }]}>
                <SimboloA style={styles.simbolo} />
                <View style={styles.largura}>
                    <View style={styles.header}>
                        <LogoBranco style={styles.logo} />
                        <BotaoIcone icone="log-out-outline" tamanho={20} comFundo inverso descricao="Sair da conta" onPress={logoutUser} />
                    </View>
                    <Text style={styles.titulo} accessibilityRole="header">Explore a loja</Text>
                    <CampoBusca valor={textoBusca} onChange={setTextoBusca} />
                </View>
            </View>

            {categorias.length > 0 && (
                <View style={[styles.largura, styles.filtros]}>
                    <FiltroCategorias categorias={categorias} selecionada={categoria} onSelecionar={setCategoria} />
                </View>
            )}

            {loading ? (
                <View style={[styles.largura, styles.listaConteudo]}>
                    {cabecalhoSecao}
                    <EsqueletoGrade colunas={colunas} />
                </View>
            ) : erro ? (
                <Erro mensagem={erro} onTentarNovamente={tentarNovamente} />
            ) : (
            <FlatList
                // why: o FlatList não aceita trocar numColumns em tempo real; a key nova recria a lista.
                key={`colunas-${colunas}`}
                numColumns={colunas}
                data={produtos}
                ListHeaderComponent={produtos.length > 0 ? cabecalhoSecao : undefined}
                renderItem={({ item, index }) => (
                    <Animated.View
                        // why: atraso limitado para que listas longas não demorem a aparecer por inteiro.
                        entering={FadeInDown.duration(350).delay(Math.min(index, 8) * 60)}
                        style={[styles.celula, { maxWidth: `${100 / colunas}%` }]}
                    >
                        <ProdutoCard
                            produto={item}
                            nomeCategoria={nomesCategoria[item.categoria]}
                            onAddToCart={adicionarAoCarrinho}
                            onPress={(produto) =>
                                router.push({ pathname: "/produto/[id]", params: { id: produto.id.toString() } })
                            }
                        />
                    </Animated.View>
                )}
                keyExtractor={(item) => item.id.toString()}
                style={styles.lista}
                contentContainerStyle={[styles.largura, styles.listaConteudo]}
                columnWrapperStyle={styles.linha}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <EstadoVazio
                        icone="search-outline"
                        titulo="Nenhum produto encontrado"
                        mensagem={temFiltro ? "Tente outra busca ou categoria." : undefined}
                        acao={temFiltro ? "Limpar filtros" : undefined}
                        onAcao={temFiltro ? limparFiltros : undefined}
                    />
                }
            />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: cores.fundo,
    },
    hero: {
        backgroundColor: cores.primaria,
        paddingHorizontal: espaco.lg + espaco.xs,
        paddingBottom: espaco.xl,
        borderBottomLeftRadius: raio.lg + espaco.sm,
        borderBottomRightRadius: raio.lg + espaco.sm,
        overflow: "hidden",
    },
    simbolo: {
        position: "absolute",
        right: -espaco.xl,
        bottom: -espaco.xl,
        width: 150,
        opacity: 0.1,
    },
    largura: {
        width: "100%",
        // why: na web larga a vitrine fica centralizada em vez de esticar de ponta a ponta.
        maxWidth: 960,
        alignSelf: "center",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: {
        width: 128,
    },
    titulo: {
        marginTop: espaco.lg,
        marginBottom: espaco.lg,
        fontSize: fonte.titulo,
        fontWeight: "800",
        letterSpacing: -0.5,
        color: cores.primariaTexto,
    },
    filtros: {
        paddingTop: espaco.lg,
        paddingHorizontal: espaco.lg + espaco.xs,
    },
    lista: {
        flex: 1,
    },
    listaConteudo: {
        flexGrow: 1,
        paddingHorizontal: espaco.lg + espaco.xs,
        paddingTop: espaco.lg,
        paddingBottom: espaco.xl,
        gap: espaco.md,
    },
    linha: {
        gap: espaco.md,
    },
    secao: {
        flexDirection: "row",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: espaco.md,
    },
    secaoTitulo: {
        flex: 1,
        fontSize: fonte.subtitulo,
        fontWeight: "700",
        letterSpacing: -0.3,
        color: cores.texto,
    },
    secaoContagem: {
        fontSize: fonte.pequeno,
        color: cores.textoSecundario,
    },
    celula: {
        // why: o maxWidth por coluna (inline) impede que a última linha incompleta estique os cards.
        flex: 1,
    },
});
