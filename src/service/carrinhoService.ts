import apiClient from "@/api/apiClient";
import { AdicionarItemCarrinho, AtualizarItemCarrinho, Carrinho } from "@/types/carrinho";
import { Produto } from "@/types/produto";

// invariant: a API identifica o usuário pelo token do apiClient, então nenhuma rota leva usuarioId.

export async function getCarrinho(): Promise<Carrinho> {
    const { data } = await apiClient.get<Carrinho>("/carrinho");
    return data;
}

export async function addItemCarrinho(item: AdicionarItemCarrinho): Promise<Carrinho> {
    const { data } = await apiClient.post<Carrinho>("/carrinho/itens", item);
    return data;
}

export async function editarItemCarrinho(produtoId: Produto["id"], item: AtualizarItemCarrinho): Promise<Carrinho> {
    const { data } = await apiClient.put<Carrinho>(`/carrinho/itens/${produtoId}`, item);
    return data;
}

export async function removerItemCarrinho(produtoId: Produto["id"]): Promise<Carrinho> {
    const { data } = await apiClient.delete<Carrinho>(`/carrinho/itens/${produtoId}`);
    return data;
}

export async function limparCarrinho(): Promise<Carrinho> {
    const { data } = await apiClient.delete<Carrinho>("/carrinho");
    return data;
}
