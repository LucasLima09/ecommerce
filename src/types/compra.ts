import { ItemCarrinho } from "./carrinho";
import { Usuario } from "./usuario";

export type FormaPagamentoId = "pix" | "cartao" | "boleto";

// Item de GET /formas-pagamento
export type FormaPagamento = {
    id: FormaPagamentoId;
    nome: string; // ex: "Cartão de crédito"
};

export type StatusCompra = "confirmada";

export type Compra = {
    id: number;
    usuarioId: Usuario["id"];
    itens: ItemCarrinho[];
    quantidadeTotal: number;
    total: number; // em centavos
    formaPagamento: FormaPagamentoId;
    status: StatusCompra;
    criadaEm: string; // data ISO
};

// Body de POST /compras — itens, total, id, status e data são gerados pela API
// a partir do carrinho do usuário.
export type NovaCompra = {
    formaPagamento: FormaPagamentoId;
};
