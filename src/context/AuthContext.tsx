import { definirAoExpirarSessao } from "@/api/apiClient";
import * as authService from "@/service/authService";
import { NovoUsuario, Usuario } from "@/types/usuario";
import { createContext, PropsWithChildren, use, useEffect, useState } from "react";

type AuthContextType = {
    usuario: Usuario | null;
    token: string | null;
    loading: boolean;
    login: (email: string, senha: string) => Promise<void>;
    cadastrar: (novoUsuario: NovoUsuario) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const value = use(AuthContext);
    if (!value) throw new Error("useAuth precisa estar dentro do AuthProvider");
    return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Restaura a sessão salva no AsyncStorage ao abrir o app.
    useEffect(() => {
        authService.getSessaoSalva().then((sessao) => {
            setUsuario(sessao?.usuario ?? null);
            setToken(sessao?.token ?? null);
            setLoading(false);
        });
    }, []);

    // Quando a API recusa o token (401), o apiClient apaga a sessão e avisa aqui;
    // zerar o usuário faz o Stack.Protected levar para a tela de login.
    useEffect(() => {
        definirAoExpirarSessao(() => {
            setUsuario(null);
            setToken(null);
        });
        return () => definirAoExpirarSessao(null);
    }, []);

    async function login(email: string, senha: string) {
        const sessao = await authService.login(email, senha);
        setUsuario(sessao.usuario);
        setToken(sessao.token);
    }

    // why: o cadastro não devolve token, então entra logo em seguida para o usuário já cair no app.
    async function cadastrar(novoUsuario: NovoUsuario) {
        await authService.cadastro(novoUsuario);
        await login(novoUsuario.email, novoUsuario.senha);
    }

    async function logout() {
        await authService.logout();
        setUsuario(null);
        setToken(null);
    }

    return <AuthContext value={{ usuario, token, loading, login, cadastrar, logout }}>{children}</AuthContext>;
}
