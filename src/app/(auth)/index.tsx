import AuthButton from "@/components/authButton";
import AuthInput from "@/components/authInput";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    function handleLogin() {
        // TODO: chamar loginUser, tratar erros e controlar o loading
    }

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Image
                            source={require("@/assets/images/Logotipo minimalista ATTURA em preto.png")}
                            style={styles.logo}
                            contentFit="contain"
                            accessibilityLabel="ATTURA"
                        />
                        <Text style={styles.title}>Bem-vindo de volta</Text>
                        <Text style={styles.subtitle}>Entre na sua conta para continuar</Text>
                    </View>

                    <View style={styles.form}>
                        <AuthInput
                            label="E-mail"
                            icon="mail-outline"
                            placeholder="seu@email.com"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoComplete="email"
                        />

                        <AuthInput
                            label="Senha"
                            icon="lock-closed-outline"
                            placeholder="Sua senha"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="password"
                        />

                        <AuthButton title="Entrar" onPress={handleLogin} loading={loading} />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Não tem uma conta?</Text>
                        <Link href="/registro" style={styles.link}>
                            Cadastre-se
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#F2F2F7",
    },
    flex: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 32,
        gap: 32,
    },
    header: {
        gap: 6,
    },
    logo: {
        width: 140,
        aspectRatio: 1546 / 217,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#1C1C1E",
    },
    subtitle: {
        fontSize: 16,
        color: "#636366",
    },
    form: {
        gap: 16,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
    footerText: {
        fontSize: 14,
        color: "#636366",
    },
    link: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1C1C1E",
    },
});
