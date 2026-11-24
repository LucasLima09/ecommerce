import BarraInferior from "@/components/barraInferior";
import Botao from "@/components/botao";
import BotaoIcone from "@/components/botaoIcone";
import { Carregando, Erro } from "@/components/estadoTela";
import FaixaMarca from "@/components/faixaMarca";
import { useCarrinho } from "@/context/CarrinhoContext";
import { getCategorias } from "@/service/categoriasService";
import { getProdutoById } from "@/service/produtosService";
import { cores, espaco, fonte, larguraConteudo, raio } from "@/theme";
import { estilosTela } from "@/theme/estilos";
import { Categoria, Produto } from "@/types/produto";
import { getMensagemErroApi } from "@/utils/errosApi";
import { formatarPreco } from "@/utils/formatarPreco";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ProdutoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { adicionar, atualizando } = useCarrinho();
    const [produto, setProduto] = useState<Produto | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [erro, setErro] = useState<string | null>(null);
    // why: incrementar dispara uma nova busca pelo botão "Tentar novamente"
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        // hazard: sem essa flag, a resposta chega depois da tela fechar e chama setState em tela desmontada.
        let ativo = true;
        async function carregar() {
            setErro(null);
            try {
                const data = await getProdutoById(Number(id));
                if (ativo) setProduto(data);
            } catch (e) {
                if (ativo) setErro(getMensagemErroApi(e, "Não foi possível carregar o produto."));
            }
        }
        carregar();
        return () => {
            ativo = false;
        };
    }, [id, tentativa]);

    // why: o produto só traz o id da categoria ("eletronicos"); se a lista falhar, a tela mostra o id mesmo.
    useEffect(() => {
        getCategorias().then(setCategorias).catch(() => setCategorias([]));
    }, []);

    async function adicionarAoCarrinho(item: Produto) {
        try {
            await adicionar(item.id);
            Alert.alert("Carrinho", `${item.nome} foi adicionado ao carrinho.`);
        } catch (e) {
            // why: a API explica o motivo da recusa (ex.: estoque insuficiente).
            Alert.alert("Não foi possível adicionar", (e as Error).message);
        }
    }

    function conteudo() {
        if (erro) return <Erro mensagem={erro} onTentarNovamente={() => setTentativa((t) => t + 1)} />;
        if (!produto) return <Carregando />;

        const semEstoque = produto.estoque <= 0;
        const nomeCategoria = categorias.find((c) => c.id === produto.categoria)?.nome ?? produto.categoria;

        return (
            <>
                <ScrollView
                    style={estilosTela.lista}
                    contentContainerStyle={[larguraConteudo, styles.conteudo]}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.imagemBox}>
                        <Image source={{ uri: produto.imagem }} style={styles.imagem} contentFit="cover" transition={200} />
                    </View>

                    <View style={styles.cartao}>
                        <View style={styles.selo}>
                            <Text style={styles.seloTexto}>{nomeCategoria}</Text>
                        </View>

                        <Text style={styles.nome}>{produto.nome}</Text>
                        <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>

                        <View style={styles.estoque}>
                            <Ionicons
                                name={semEstoque ? "close-circle" : "checkmark-circle"}
                                size={18}
                                color={semEstoque ? cores.erro : cores.sucesso}
                            />
                            <Text style={[styles.estoqueTexto, { color: semEstoque ? cores.erro : cores.sucesso }]}>
                                {semEstoque ? "Sem estoque" : `${produto.estoque} unidade(s) em estoque`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cartao}>
                        <Text style={styles.tituloSecao}>Descrição</Text>
                        <Text style={styles.descricao}>{produto.descricao}</Text>
                    </View>
                </ScrollView>

                <BarraInferior>
                    <Botao
                        title={semEstoque ? "Indisponível" : "Adicionar ao carrinho"}
                        onPress={() => adicionarAoCarrinho(produto)}
                        disabled={semEstoque}
                        loading={atualizando}
                    />
                </BarraInferior>
            </>
        );
    }

    return (
        <View style={estilosTela.container}>
            <FaixaMarca
                titulo="Detalhes"
                subtitulo="Confira as informações do produto"
                topo={<BotaoIcone icone="chevron-back" tamanho={20} comFundo inverso descricao="Voltar" onPress={router.back} />}
            />
            {conteudo()}
        </View>
    );
}

const styles = StyleSheet.create({
    conteudo: {
        padding: espaco.tela,
        gap: espaco.md,
    },
    imagemBox: {
        // why: na web larga a foto quadrada ficaria enorme; 480 mantém ela grande sem tomar a tela toda.
        width: "100%",
        maxWidth: 480,
        alignSelf: "center",
        borderRadius: raio.lg,
        borderWidth: 1,
        borderColor: cores.borda,
        backgroundColor: cores.superficie,
        overflow: "hidden",
    },
    imagem: {
        width: "100%",
        aspectRatio: 1,
    },
    cartao: {
        backgroundColor: cores.superficie,
        borderRadius: raio.lg,
        borderWidth: 1,
        borderColor: cores.borda,
        padding: espaco.lg,
        gap: espaco.sm,
    },
    selo: {
        alignSelf: "flex-start",
        backgroundColor: cores.neutroAtivo,
        paddingHorizontal: espaco.md,
        paddingVertical: espaco.xs,
        borderRadius: raio.pill,
    },
    seloTexto: {
        fontSize: fonte.legenda,
        fontWeight: "600",
        color: cores.texto,
        textTransform: "capitalize",
    },
    nome: {
        fontSize: fonte.secao,
        fontWeight: "800",
        letterSpacing: -0.3,
        color: cores.texto,
    },
    preco: {
        fontSize: fonte.secao,
        fontWeight: "700",
        color: cores.texto,
    },
    estoque: {
        flexDirection: "row",
        alignItems: "center",
        gap: espaco.xs,
    },
    estoqueTexto: {
        fontSize: fonte.pequeno,
        fontWeight: "600",
    },
    tituloSecao: {
        fontSize: fonte.corpo,
        fontWeight: "700",
        color: cores.texto,
    },
    descricao: {
        fontSize: fonte.corpo,
        lineHeight: 24,
        color: cores.textoSecundario,
    },
});
