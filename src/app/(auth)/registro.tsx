import AuthButton from "@/components/authButton";
import AuthInput from "@/components/authInput";
import { registerUser } from "@/service/authService";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {
        await registerUser(email, password)
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
                        <Text style={styles.title}>Crie sua conta</Text>
                        <Text style={styles.subtitle}>Leva menos de um minuto</Text>
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
                            placeholder="Mínimo de 6 caracteres"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoComplete="new-password"
                        />

                        <AuthInput
                            label="Confirmar senha"
                            icon="lock-closed-outline"
                            placeholder="Repita a senha"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            autoComplete="new-password"
                        />

                        <AuthButton title="Cadastrar" onPress={handleRegister} loading={loading} />
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Já tem uma conta?</Text>
                        <Link href="/" style={styles.link}>
                            Entrar
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
