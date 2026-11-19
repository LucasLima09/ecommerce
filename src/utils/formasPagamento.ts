import { FormaPagamentoId } from "@/types/compra";

// why: a compra traz só o id da forma de pagamento; o nome legível vem daqui para não precisar buscar /formas-pagamento em cada tela.
export const NOMES_PAGAMENTO: Record<FormaPagamentoId, string> = {
    pix: "Pix",
    cartao: "Cartão de crédito",
    boleto: "Boleto",
};
