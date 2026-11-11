import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CarrinhoProvider } from "@/context/CarrinhoContext";
import { Stack } from "expo-router";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function RootLayout() {

    return (
        <AuthProvider>
            <CarrinhoProvider>
                <RootNavigator />
            </CarrinhoProvider>
        </AuthProvider>
    );
}

function RootNavigator(){
    const { user, loading } = useAuth();

    // Enquanto o Firebase lê a sessão salva, mostra um loading.
    // Assim a tela de login não "pisca" para quem já está logado.
    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#1C1C1E" />
            </View>
        );
    }

    return(
        <Stack screenOptions={{ headerShown: false}}>

            <Stack.Protected guard = {!!user} >
                <Stack.Screen name="(tabs)" />
            </Stack.Protected>

            <Stack.Protected guard = {!user} >
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
        backgroundColor: "#F2F2F7",
    },
});
