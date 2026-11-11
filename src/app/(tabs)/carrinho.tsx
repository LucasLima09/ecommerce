import { Carregando, Erro } from "@/components/estadoTela";
import CarrinhoVazio from "@/components/carrinhoVazio";
import ItemCarrinhoCard from "@/components/itemCarrinhoCard";
import ResumoCarrinho from "@/components/resumoCarrinho";
import { useCarrinho } from "@/context/CarrinhoContext";
import { Alert, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

    if (loading) return <Carregando />;
    if (erro || !carrinho) {
        return <Erro mensagem={erro ?? "Não foi possível carregar o carrinho."} onTentarNovamente={recarregar} />;
    }

    const vazio = carrinho.itens.length === 0;

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Text style={styles.titulo}>Carrinho</Text>

            {vazio ? (
                <CarrinhoVazio />
            ) : (
                <FlatList
                    data={carrinho.itens}
                    keyExtractor={(item) => item.produtoId.toString()}
                    contentContainerStyle={styles.lista}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <ItemCarrinhoCard
                            item={item}
                            desabilitado={atualizando}
                            onAumentar={() => tentar(() => alterarQuantidade(item.produtoId, item.quantidade + 1))}
                            onDiminuir={() => tentar(() => alterarQuantidade(item.produtoId, item.quantidade - 1))}
                            onRemover={() => tentar(() => remover(item.produtoId))}
                        />
                    )}
                />
            )}

            <ResumoCarrinho
                total={carrinho.total}
                tituloBotao="Finalizar compra"
                desabilitado={vazio}
                onConfirmar={() => {}}
            />
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
    titulo: {
        fontSize: 28,
        fontWeight: "700",
        color: "#1C1C1E",
    },
    lista: {
        paddingVertical: 16,
        gap: 12,
    },
});
