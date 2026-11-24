import { Produto } from "./produto";
import { Usuario } from "./usuario";

export type ItemCarrinho = {
    produtoId: Produto["id"];
    nome: string;
    preco: number; // em centavos
    imagem: string;
    quantidade: number;
    subtotal: number; // em centavos
};

export type Carrinho = {
    usuarioId: Usuario["id"];
    itens: ItemCarrinho[];
    quantidadeTotal: number;
    total: number; // em centavos
};

// invariant: corpo enviado no POST /carrinho/itens
export type AdicionarItemCarrinho = {
    produtoId: Produto["id"];
    quantidade: number;
};

// invariant: corpo enviado no PUT /carrinho/itens/:produtoId
export type AtualizarItemCarrinho = {
    quantidade: number;
};
