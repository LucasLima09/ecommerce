import Ionicons from "@expo/vector-icons/Ionicons";
import BarraInferior from "@/components/barraInferior";
import Botao from "@/components/botao";
import CompraCard from "@/components/compraCard";
import { Carregando, Erro } from "@/components/estadoTela";
import FaixaMarca from "@/components/faixaMarca";
import { getCompraById } from "@/service/comprasService";
import { Compra } from "@/types/compra";
import { getMensagemErroApi } from "@/utils/errosApi";
import { cores, espaco, larguraConteudo } from "@/theme";
import { estilosTela } from "@/theme/estilos";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function PedidoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [compra, setCompra] = useState<Compra | null>(null);
    const [erro, setErro] = useState<string | null>(null);
    // why: incrementar dispara uma nova busca pelo botão "Tentar novamente"
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        // hazard: sem essa flag, a resposta chega depois da tela fechar e chama setState em tela desmontada.
        let ativo = true;
        async function carregar() {
            setErro(null);
            try {
                const data = await getCompraById(Number(id));
                if (ativo) setCompra(data);
            } catch (e) {
                if (ativo) setErro(getMensagemErroApi(e, "Não foi possível carregar o pedido."));
            }
        }
        carregar();
        return () => {
            ativo = false;
        };
    }, [id, tentativa]);

    // why: a compra já esvaziou o carrinho; voltar para pagamento ou carrinho não faz sentido, então volta para a Home.
    const voltarParaLoja = () => router.dismissTo("/");

    return (
        <View style={estilosTela.container}>
            <FaixaMarca
                titulo="Pedido confirmado!"
                subtitulo="Obrigado pela compra. Ela também fica salva no seu histórico."
                topo={
                    <View style={styles.selo}>
                        <Ionicons name="checkmark" size={24} color={cores.primariaTexto} />
                    </View>
                }
            />
            {erro ? (
                <Erro mensagem={erro} onTentarNovamente={() => setTentativa((t) => t + 1)} />
            ) : !compra ? (
                <Carregando />
            ) : (
                <ScrollView style={estilosTela.lista} contentContainerStyle={[larguraConteudo, styles.conteudo]}>
                    <Animated.View entering={FadeInDown.duration(400)}>
                        <CompraCard compra={compra} />
                    </Animated.View>
                </ScrollView>
            )}
            <BarraInferior>
                <Botao title="Voltar para a loja" onPress={voltarParaLoja} />
            </BarraInferior>
        </View>
    );
}

const styles = StyleSheet.create({
    conteudo: {
        padding: espaco.tela,
    },
    selo: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: cores.sucesso,
        alignItems: "center",
        justifyContent: "center",
    },
});
