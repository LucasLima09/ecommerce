import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack } from "expo-router";


export default function RootLayout() {

    return (
        <AuthProvider>
            <RootNavigator />
        </AuthProvider>
    );
}

function RootNavigator(){
    const { user } = useAuth();

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