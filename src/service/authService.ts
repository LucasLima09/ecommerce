import apiClient from "@/api/apiClient";
import { lerSessao, limparSessao, salvarSessao } from "@/api/sessaoStorage";
import { NovoUsuario, Sessao, Usuario } from "@/types/usuario";

export async function cadastro(novoUsuario: NovoUsuario): Promise<Usuario> {
    const { data } = await apiClient.post<Usuario>("/usuarios", novoUsuario);
    return data;
}

export async function login(email: string, senha: string): Promise<Sessao> {
    const { data } = await apiClient.post<Sessao>("/login", { email, senha });
    await salvarSessao(data);
    return data;
}

export async function logout(): Promise<void> {
    await limparSessao();
}

export async function getSessaoSalva(): Promise<Sessao | null> {
    return lerSessao();
}
