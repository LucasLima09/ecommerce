import { Produto } from "./produto";

export type ItemCarrinho = {
    produtoId: Produto["id"];
    nome: string;
    preco: number; // em centavos
    imagem: string;
    quantidade: number;
    subtotal: number; // em centavos
};

export type Carrinho = {
    usuarioId: string;
    itens: ItemCarrinho[];
    quantidadeTotal: number;
    total: number; // em centavos
};

// Body de POST /carrinho/:usuarioId/itens
export type AdicionarItemCarrinho = {
    produtoId: Produto["id"];
    quantidade: number;
};

// Body de PUT /carrinho/:usuarioId/itens/:produtoId
export type AtualizarItemCarrinho = {
    quantidade: number;
};
