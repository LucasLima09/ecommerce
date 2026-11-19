import CompraCard from "@/components/compraCard";
import { Carregando, EstadoVazio } from "@/components/estadoTela";
import FaixaMarca from "@/components/faixaMarca";
import { useHistorico } from "@/context/HistoricoContext";
import { larguraConteudo } from "@/theme";
import { estilosTela } from "@/theme/estilos";
import { entradaItem } from "@/utils/animacoes";
import { router } from "expo-router";
import { FlatList, View } from "react-native";
import Animated from "react-native-reanimated";

export default function HistoricoScreen() {
    const { compras, loading } = useHistorico();

    const quantidade = compras.length;
    const vazio = quantidade === 0;

    function conteudo() {
        if (loading) return <Carregando />;
        if (vazio) {
            return (
                <EstadoVazio
                    icone="receipt-outline"
                    titulo="Nenhuma compra ainda"
                    mensagem="Quando você finalizar um pedido, ele aparece aqui."
                    acao="Explorar produtos"
                    onAcao={() => router.navigate("/")}
                />
            );
        }
        return (
            <FlatList
                data={compras}
                keyExtractor={(item) => item.id.toString()}
                style={estilosTela.lista}
                contentContainerStyle={[larguraConteudo, estilosTela.listaConteudo]}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                    <Animated.View entering={entradaItem(index)}>
                        <CompraCard compra={item} />
                    </Animated.View>
                )}
            />
        );
    }

    return (
        <View style={estilosTela.container}>
            <FaixaMarca
                titulo="Histórico"
                subtitulo={
                    loading || vazio ? undefined : `${quantidade} ${quantidade === 1 ? "pedido realizado" : "pedidos realizados"}`
                }
            />
            {conteudo()}
        </View>
    );
}
