import AuthButton from "@/components/authButton";
import AuthInput from "@/components/authInput";
import { registerUser } from "@/service/authService";
import { getMensagemErroAuth } from "@/utils/errosFirebase";
import { FirebaseError } from "firebase/app";
import { SENHA_MIN, validarConfirmacaoSenha, validarEmail, validarSenha } from "@/utils/validacoes";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Erros = { email?: string; password?: string; confirmPassword?: string; geral?: string };

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [erros, setErros] = useState<Erros>({});

    function validar(): boolean {
        const novosErros: Erros = {
            email: validarEmail(email),
            password: validarSenha(password),
            confirmPassword: validarConfirmacaoSenha(password, confirmPassword),
        };
        setErros(novosErros);
        return !novosErros.email && !novosErros.password && !novosErros.confirmPassword;
    }

    // limpa o erro do campo editado (e o erro geral) enquanto o usuário digita
    function limparErro(campo: keyof Erros) {
        setErros((e) => ({ ...e, [campo]: undefined, geral: undefined }));
    }

    async function handleRegister() {
        if (loading || !validar()) return;

        setLoading(true);
        try {
            await registerUser(email.trim(), password);
            // sucesso: o Firebase já loga o usuário e o Stack.Protected redireciona
        } catch (error) {
            const mensagem = getMensagemErroAuth(error);
            // e-mail já cadastrado é erro do campo e-mail; o resto vai como erro geral
            if (error instanceof FirebaseError && error.code === "auth/email-already-in-use") {
                setErros({ email: mensagem });
            } else {
                setErros({ geral: mensagem });
            }
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
                        <Text style={styles.title}>Crie sua conta</Text>
                        <Text style={styles.subtitle}>Leva menos de um minuto</Text>
                    </View>

                    <View style={styles.form}>
                        <AuthInput
                            label="E-mail"
                            icon="mail-outline"
                            placeholder="seu@email.com"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                limparErro("email");
                            }}
                            error={erros.email}
                            keyboardType="email-address"
                            autoComplete="email"
                            editable={!loading}
                        />

                        <AuthInput
                            label="Senha"
                            icon="lock-closed-outline"
                            placeholder={`Mínimo de ${SENHA_MIN} caracteres`}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                limparErro("password");
                            }}
                            error={erros.password}
                            secureTextEntry
                            autoComplete="new-password"
                            editable={!loading}
                        />

                        <AuthInput
                            label="Confirmar senha"
                            icon="lock-closed-outline"
                            placeholder="Repita a senha"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                limparErro("confirmPassword");
                            }}
                            error={erros.confirmPassword}
                            secureTextEntry
                            autoComplete="new-password"
                            editable={!loading}
                            returnKeyType="go"
                            onSubmitEditing={handleRegister}
                        />

                        {!!erros.geral && (
                            <Text style={styles.erroGeral} accessibilityRole="alert">
                                {erros.geral}
                            </Text>
                        )}

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
