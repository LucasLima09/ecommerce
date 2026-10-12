import apiClient from "../api/apiClient";

export async function getProdutos() {
    const response = await apiClient.get("/produtos");
    return response.data;
}

export async function getProdutoById(id: string) {
    const response = await apiClient.get(`/produtos/${id}`);
    return response.data;
}