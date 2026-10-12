import apiClient from "../api/apiClient";
import { ItemCarrinho } from "../types/carrinho";

export async function getCarrinho(userId: string) {
    const response = await apiClient.get(`/carrinho/${userId}`);
    return response.data;
}

export async function addItemCarrinho(userId: string, item: ItemCarrinho) {
    const response = await apiClient.post(`/carrinho/${userId}/items`, item);
    return response.data;
}

export async function editarItemCarrinho(userId: string, produtoId: string, item: ItemCarrinho) {
    const response = await apiClient.put(`/carrinho/${userId}/items/${produtoId}`, item);
    return response.data;
}

export async function removerItemCarrinho(userId: string, produtoId: string) {
    const response = await apiClient.delete(`/carrinho/${userId}/items/${produtoId}`);
    return response.data;
}