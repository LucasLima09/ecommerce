import apiClient from "@/api/apiClient";
import { Compra, FormaPagamento, NovaCompra } from "@/types/compra";

export async function finalizarCompra(compra: NovaCompra): Promise<Compra> {
    const { data } = await apiClient.post<Compra>("/compras", compra);
    return data;
}

export async function getCompras(): Promise<Compra[]> {
    const { data } = await apiClient.get<Compra[]>("/compras");
    return data;
}

export async function getCompraById(compraId: Compra["id"]): Promise<Compra> {
    const { data } = await apiClient.get<Compra>(`/compras/${compraId}`);
    return data;
}

export async function getFormasPagamento(): Promise<FormaPagamento[]> {
    const { data } = await apiClient.get<FormaPagamento[]>("/formas-pagamento");
    return data;
}
