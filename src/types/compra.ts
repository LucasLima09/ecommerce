import { ItemCarrinho } from "./carrinho";

type FormaPagamento = "pix" | "cartao" | "boleto";

export type Compra = {
    id: number;
    usuarioId: string;
    itens: ItemCarrinho[];
    quantidadeTotal: number;
    total: number; // em centavos
    formaPagamento: FormaPagamento;
    status: "confirmada";
    criadaEm: string; // data ISO
};