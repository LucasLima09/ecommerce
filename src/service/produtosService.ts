import apiClient from "@/api/apiClient";
import { Produto, FiltrosProdutos } from "@/types/produto";

export async function getProdutos(filtros?: FiltrosProdutos): Promise<Produto[]> {
    const { data } = await apiClient.get<Produto[]>("/produtos", { params: filtros });
    return data;
}

export async function getProdutoById(id: Produto["id"]): Promise<Produto> {
    const { data } = await apiClient.get<Produto>(`/produtos/${id}`);
    return data;
}
