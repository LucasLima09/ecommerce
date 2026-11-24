import AuthInput, { CampoEmail } from "@/components/authInput";
import TelaAuth from "@/components/telaAuth";
import { useAuth } from "@/context/AuthContext";
import { getMensagemErroApi } from "@/utils/errosApi";
import { SENHA_MIN, validarConfirmacaoSenha, validarEmail, validarNome, validarSenha } from "@/utils/validacoes";
import { useState } from "react";

type Erros = { nome?: string; email?: string; password?: string; confirmPassword?: string; geral?: string };

export default function RegisterScreen() {
    const { cadastrar } = useAuth();
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [erros, setErros] = useState<Erros>({});

    function validar(): boolean {
        const novosErros: Erros = {
            nome: validarNome(nome),
            email: validarEmail(email),
            password: validarSenha(password),
            confirmPassword: validarConfirmacaoSenha(password, confirmPassword),
        };
        setErros(novosErros);
        return !novosErros.nome && !novosErros.email && !novosErros.password && !novosErros.confirmPassword;
    }

    // limpa o erro do campo editado (e o erro geral) enquanto o usuário digita
    function limparErro(campo: keyof Erros) {
        setErros((e) => ({ ...e, [campo]: undefined, geral: undefined }));
    }

    async function handleRegister() {
        if (loading || !validar()) return;

        setLoading(true);
        try {
            await cadastrar({ nome: nome.trim(), email: email.trim(), senha: password });
            // sucesso: o cadastrar já faz login e o Stack.Protected redireciona
        } catch (error) {
            setErros({ geral: getMensagemErroApi(error) });
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
            <AuthInput
                label="Nome"
                icon="person-outline"
                placeholder="Seu nome"
                value={nome}
                onChangeText={(text) => {
                    setNome(text);
                    limparErro("nome");
                }}
                error={erros.nome}
                autoCapitalize="words"
                autoComplete="name"
                textContentType="name"
                editable={!loading}
            />

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
