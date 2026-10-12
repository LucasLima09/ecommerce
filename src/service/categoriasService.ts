import apiClient from "../api/apiClient";

export async function getCategorias() {
    const response = await apiClient.get("/categorias");
    return response.data;
}