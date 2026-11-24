import AuthInput, { CampoEmail } from "@/components/authInput";
import TelaAuth from "@/components/telaAuth";
import { useAuth } from "@/context/AuthContext";
import { getMensagemErroApi } from "@/utils/errosApi";
import { validarEmail, validarSenha } from "@/utils/validacoes";
import { useState } from "react";

type Erros = { email?: string; password?: string; geral?: string };

export default function LoginScreen() {
    const { login } = useAuth();
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
            await login(email.trim(), password);
            // sucesso: o Stack.Protected redireciona sozinho para (tabs)
        } catch (error) {
            setErros({ geral: getMensagemErroApi(error) });
        } finally {
            setLoading(false);
        }
    }

    return (
        <TelaAuth
            titulo="Bem-vindo de volta"
            subtitulo="Entre na sua conta para continuar"
            erroGeral={erros.geral}
            acao="Entrar"
            onAcao={handleLogin}
            loading={loading}
            rodapeTexto="Não tem uma conta?"
            rodapeLink="Cadastre-se"
            rodapeHref="/registro"
        >
            <CampoEmail
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setErros((e) => ({ ...e, email: undefined, geral: undefined }));
                }}
                error={erros.email}
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
                textContentType="password"
                editable={!loading}
                returnKeyType="go"
                onSubmitEditing={handleLogin}
            />
        </TelaAuth>
    );
}
