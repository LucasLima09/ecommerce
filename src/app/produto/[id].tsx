import Botao from "@/components/botao";
import BotaoIcone from "@/components/botaoIcone";
import { Carregando, Erro } from "@/components/estadoTela";
import { useCarrinho } from "@/context/CarrinhoContext";
import { getProdutoById } from "@/service/produtosService";
import { Produto } from "@/types/produto";
import { getMensagemErroApi } from "@/utils/errosApi";
import { formatarPreco } from "@/utils/formatarPreco";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProdutoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { adicionar, atualizando } = useCarrinho();
    const [produto, setProduto] = useState<Produto | null>(null);
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

    async function adicionarAoCarrinho(item: Produto) {
        try {
            await adicionar(item.id);
            Alert.alert("Carrinho", `${item.nome} foi adicionado ao carrinho.`);
        } catch (e) {
            // why: a API explica o motivo da recusa (ex.: estoque insuficiente).
            Alert.alert("Não foi possível adicionar", (e as Error).message);
        }
    }

    if (erro) return <Erro mensagem={erro} onTentarNovamente={() => setTentativa((t) => t + 1)} />;
    if (!produto) return <Carregando />;

    const semEstoque = produto.estoque <= 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <BotaoIcone icone="chevron-back" tamanho={26} descricao="Voltar" onPress={router.back} />
            </View>

            <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
                <Image source={{ uri: produto.imagem }} style={styles.imagem} contentFit="cover" transition={200} />

                <Text style={styles.categoria}>{produto.categoria}</Text>
                <Text style={styles.nome}>{produto.nome}</Text>
                <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
                <Text style={styles.estoque}>
                    {semEstoque ? "Sem estoque" : `${produto.estoque} unidade(s) em estoque`}
                </Text>
                <Text style={styles.descricao}>{produto.descricao}</Text>
            </ScrollView>

            <View style={styles.rodape}>
                <Botao
                    title={semEstoque ? "Indisponível" : "Adicionar ao carrinho"}
                    onPress={() => adicionarAoCarrinho(produto)}
                    disabled={semEstoque}
                    loading={atualizando}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: "#F2F2F7",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    conteudo: {
        paddingVertical: 16,
        gap: 8,
    },
    imagem: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
    },
    categoria: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: "500",
        color: "#8E8E93",
        textTransform: "capitalize",
    },
    nome: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1C1C1E",
    },
    preco: {
        fontSize: 22,
        fontWeight: "700",
        color: "#1C1C1E",
    },
    estoque: {
        fontSize: 14,
        color: "#636366",
    },
    descricao: {
        marginTop: 8,
        fontSize: 16,
        lineHeight: 24,
        color: "#3A3A3C",
    },
    rodape: {
        paddingVertical: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E5E5EA",
    },
});
