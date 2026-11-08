import AuthButton from "@/components/authButton";
import AuthInput from "@/components/authInput";
import { loginUser } from "@/service/authService";
import { getMensagemErroAuth } from "@/utils/errosFirebase";
import { validarEmail, validarSenha } from "@/utils/validacoes";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Erros = { email?: string; password?: string; geral?: string };

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [erros, setErros] = useState<Erros>({});

    function validar(): boolean {
        const novosErros: Erros = {
            email: validarEmail(email),
            // no login não exige mínimo: só verifica se foi preenchida
            password: validarSenha(password, { minimo: false }),
        };
        setErros(novosErros);
        return !novosErros.email && !novosErros.password;
    }

    async function handleLogin() {
        if (loading || !validar()) return;

        setLoading(true);
        try {
            await loginUser(email.trim(), password);
            // sucesso: o Stack.Protected redireciona sozinho para (tabs)
        } catch (error) {
            setErros({ geral: getMensagemErroAuth(error) });
        } finally {
            setLoading(false);
        }
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
                            onChangeText={(text) => {
                                setEmail(text);
                                setErros((e) => ({ ...e, email: undefined, geral: undefined }));
                            }}
                            error={erros.email}
                            keyboardType="email-address"
                            autoComplete="email"
                            editable={!loading}
                        />

                        <AuthInput
                            label="Senha"
                            icon="lock-closed-outline"
                            placeholder="Sua senha"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setErros((e) => ({ ...e, password: undefined, geral: undefined }));
                            }}
                            error={erros.password}
                            secureTextEntry
                            autoComplete="password"
                            editable={!loading}
                            returnKeyType="go"
                            onSubmitEditing={handleLogin}
                        />

                        {!!erros.geral && (
                            <Text style={styles.erroGeral} accessibilityRole="alert">
                                {erros.geral}
                            </Text>
                        )}

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
    erroGeral: {
        fontSize: 14,
        color: "#FF3B30",
        textAlign: "center",
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
