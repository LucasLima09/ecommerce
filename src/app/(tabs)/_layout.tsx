import Ionicons from "@expo/vector-icons/Ionicons";
import { useCarrinho } from "@/context/CarrinhoContext";
import { cores, fonte } from "@/theme";
import { Tabs } from "expo-router";
import { ComponentProps } from "react";
import { ColorValue, StyleSheet } from "react-native";

type NomeIcone = ComponentProps<typeof Ionicons>["name"];

// why: a aba ativa troca o ícone vazado pelo preenchido, para não depender só da cor para indicar o estado.
const icone = (ativo: NomeIcone, inativo: NomeIcone) =>
    function TabIcone({ color, size, focused }: { color: ColorValue; size: number; focused: boolean }) {
        return <Ionicons name={focused ? ativo : inativo} color={color as string} size={size} />;
    };

const TabsLayout = () => {
    const { quantidadeTotal } = useCarrinho();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: cores.texto,
                tabBarInactiveTintColor: cores.textoSuave,
                tabBarStyle: styles.barra,
                tabBarLabelStyle: styles.rotulo,
                tabBarBadgeStyle: styles.badge,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: icone("home", "home-outline"),
                }}
            />
            <Tabs.Screen
                name="carrinho"
                options={{
                    title: "Carrinho",
                    // why: requisito de mostrar em lugar fixo quantos itens há no carrinho
                    tabBarBadge: quantidadeTotal > 0 ? quantidadeTotal : undefined,
                    tabBarIcon: icone("bag", "bag-outline"),
                }}
            />
            <Tabs.Screen
                name="historico"
                options={{
                    title: "Histórico",
                    tabBarIcon: icone("receipt", "receipt-outline"),
                }}
            />
        </Tabs>
    );
};

const styles = StyleSheet.create({
    barra: {
        backgroundColor: cores.superficie,
        borderTopWidth: 1,
        borderTopColor: cores.borda,
        // why: a sombra fica com a BarraInferior do carrinho, logo acima; aqui ela empilharia duas sombras.
        elevation: 0,
        shadowOpacity: 0,
    },
    rotulo: {
        fontSize: fonte.mini,
        fontWeight: "600",
    },
    badge: {
        backgroundColor: cores.primaria,
        color: cores.primariaTexto,
        fontSize: fonte.mini,
        fontWeight: "700",
    },
});

export default TabsLayout;
