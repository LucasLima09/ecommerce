import apiClient from "@/api/apiClient";
import { AdicionarItemCarrinho, AtualizarItemCarrinho, Carrinho } from "@/types/carrinho";
import { Produto } from "@/types/produto";

export async function getCarrinho(usuarioId: string): Promise<Carrinho> {
    const { data } = await apiClient.get<Carrinho>(`/carrinho/${usuarioId}`);
    return data;
}

export async function addItemCarrinho(usuarioId: string, item: AdicionarItemCarrinho): Promise<Carrinho> {
    const { data } = await apiClient.post<Carrinho>(`/carrinho/${usuarioId}/itens`, item);
    return data;
}

export async function editarItemCarrinho(
    usuarioId: string,
    produtoId: Produto["id"],
    item: AtualizarItemCarrinho,
): Promise<Carrinho> {
    const { data } = await apiClient.put<Carrinho>(`/carrinho/${usuarioId}/itens/${produtoId}`, item);
    return data;
}

export async function removerItemCarrinho(usuarioId: string, produtoId: Produto["id"]): Promise<Carrinho> {
    const { data } = await apiClient.delete<Carrinho>(`/carrinho/${usuarioId}/itens/${produtoId}`);
    return data;
}

export async function limparCarrinho(usuarioId: string): Promise<Carrinho> {
    const { data } = await apiClient.delete<Carrinho>(`/carrinho/${usuarioId}`);
    return data;
}
