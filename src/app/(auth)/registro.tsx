import AuthInput, { CampoEmail } from "@/components/authInput";
import TelaAuth from "@/components/telaAuth";
import { registerUser } from "@/service/authService";
import { getMensagemErroAuth } from "@/utils/errosFirebase";
import { FirebaseError } from "firebase/app";
import { SENHA_MIN, validarConfirmacaoSenha, validarEmail, validarSenha } from "@/utils/validacoes";
import { useState } from "react";

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
        <TelaAuth
            titulo="Crie sua conta"
            subtitulo="Leva menos de um minuto"
            erroGeral={erros.geral}
            acao="Cadastrar"
            onAcao={handleRegister}
            loading={loading}
            rodapeTexto="Já tem uma conta?"
            rodapeLink="Entrar"
            rodapeHref="/"
        >
            <CampoEmail
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    limparErro("email");
                }}
                error={erros.email}
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
                textContentType="newPassword"
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
                textContentType="newPassword"
                editable={!loading}
                returnKeyType="go"
                onSubmitEditing={handleRegister}
            />
        </TelaAuth>
    );
}
