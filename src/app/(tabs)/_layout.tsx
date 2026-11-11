import Ionicons from "@expo/vector-icons/Ionicons";
import { useCarrinho } from "@/context/CarrinhoContext";
import { Tabs } from "expo-router";

const TabsLayout = () => {
    const { quantidadeTotal } = useCarrinho();

    return (
        <Tabs screenOptions={{ headerShown: false }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" color={color as string} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="carrinho"
                options={{
                    title: "Carrinho",
                    // why: requisito de mostrar em lugar fixo quantos itens há no carrinho
                    tabBarBadge: quantidadeTotal > 0 ? quantidadeTotal : undefined,
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="cart-outline" color={color as string} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;