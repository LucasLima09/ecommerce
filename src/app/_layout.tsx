import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CarrinhoProvider } from "@/context/CarrinhoContext";
import { HistoricoProvider } from "@/context/HistoricoContext";
import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { cores } from "@/theme";

export default function RootLayout() {

    return (
        <AuthProvider>
            {/* invariant: HistoricoProvider fica por fora porque o CarrinhoProvider registra a compra nele ao finalizar. */}
            <HistoricoProvider>
                <CarrinhoProvider>
                    <RootNavigator />
                </CarrinhoProvider>
            </HistoricoProvider>
        </AuthProvider>
    );
}

function RootNavigator(){
    const { usuario, loading } = useAuth();

    // Enquanto o AsyncStorage lê a sessão salva, mostra um loading.
    // Assim a tela de login não "pisca" para quem já está logado.
    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color={cores.texto} />
            </View>
        );
    }

    return(
        <Stack screenOptions={{ headerShown: false}}>

            <Stack.Protected guard = {!!usuario} >
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="pagamento" />
                {/* why: depois de comprar, o gesto de voltar levaria à tela de pagamento de um carrinho já vazio */}
                <Stack.Screen name="pedido/[id]" options={{ gestureEnabled: false }} />
            </Stack.Protected>

            <Stack.Protected guard = {!usuario} >
                <Stack.Screen name="(auth)" />
            </Stack.Protected>

        </Stack>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: cores.fundo,
    },
});
