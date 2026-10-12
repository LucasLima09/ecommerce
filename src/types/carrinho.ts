export type ItemCarrinho = {
    produtoId: number;
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