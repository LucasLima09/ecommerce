import apiClient from "../api/apiClient"
import { Compra } from "../types/compra"

export async function finalizarCompra(compra: Compra) {
    const response = await apiClient.post(`/compras`, compra)
    return response.data
}

export async function getCompras(userId: string) {
    const response = await apiClient.get(`/compras?usuarioId=${userId}`)
    return response.data
}

export async function getComprasDetalhes(compraId: string) {
    const response = await apiClient.get(`/compras/${compraId}`)
    return response.data
}