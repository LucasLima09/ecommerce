import apiClient from "@/api/apiClient";
import { Categoria } from "@/types/produto";

export async function getCategorias(): Promise<Categoria[]> {
    const { data } = await apiClient.get<Categoria[]>("/categorias");
    return data;
}
