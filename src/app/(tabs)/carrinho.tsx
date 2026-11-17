import { Carregando, Erro, EstadoVazio } from "@/components/estadoTela";
import FaixaMarca from "@/components/faixaMarca";
import ItemCarrinhoCard from "@/components/itemCarrinhoCard";
import ResumoCarrinho from "@/components/resumoCarrinho";
import { useCarrinho } from "@/context/CarrinhoContext";
import { larguraConteudo } from "@/theme";
import { estilosTela } from "@/theme/estilos";
import { entradaItem } from "@/utils/animacoes";
import { router } from "expo-router";
import { Alert, FlatList, View } from "react-native";
import Animated from "react-native-reanimated";

export default function CarrinhoScreen() {
    const { carrinho, loading, erro, atualizando, recarregar, alterarQuantidade, remover } = useCarrinho();

    // why: as ações rejeitam com a mensagem da API (ex.: estoque insuficiente), que precisa aparecer para o usuário.
    async function tentar(acao: () => Promise<void>) {
        try {
            await acao();
        } catch (e) {
            Alert.alert("Carrinho", (e as Error).message);
        }
    }

    const quantidade = carrinho?.quantidadeTotal ?? 0;
    const vazio = !carrinho || carrinho.itens.length === 0;

    function conteudo() {
        if (loading) return <Carregando />;
        if (erro || !carrinho) {
            return <Erro mensagem={erro ?? "Não foi possível carregar o carrinho."} onTentarNovamente={recarregar} />;
        }
        if (vazio) {
            return (
                <EstadoVazio
                    icone="bag-outline"
                    titulo="Seu carrinho está vazio"
                    mensagem="Explore a vitrine e adicione os produtos que quiser."
                    acao="Explorar produtos"
                    onAcao={() => router.navigate("/")}
                />
            );
        }
        return (
            <>
                <FlatList
                    data={carrinho.itens}
                    keyExtractor={(item) => item.produtoId.toString()}
                    style={estilosTela.lista}
                    contentContainerStyle={[larguraConteudo, estilosTela.listaConteudo]}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={entradaItem(index)}>
                            <ItemCarrinhoCard
                                item={item}
                                desabilitado={atualizando}
                                onAumentar={() => tentar(() => alterarQuantidade(item.produtoId, item.quantidade + 1))}
                                onDiminuir={() => tentar(() => alterarQuantidade(item.produtoId, item.quantidade - 1))}
                                onRemover={() => tentar(() => remover(item.produtoId))}
                            />
                        </Animated.View>
                    )}
                />

                <ResumoCarrinho
                    total={carrinho.total}
                    quantidadeItens={quantidade}
                    tituloBotao="Finalizar compra"
                    onConfirmar={() => router.push("/pagamento")}
                />
            </>
        );
    }

    return (
        <View style={estilosTela.container}>
            <FaixaMarca
                titulo="Carrinho"
                subtitulo={vazio ? undefined : `${quantidade} ${quantidade === 1 ? "item" : "itens"} na sacola`}
            />
            {conteudo()}
        </View>
    );
}
