// A lista de categorias vem da API (GET /categorias) e pode crescer,
// por isso o id é string e não uma união fixa.
export type Categoria = {
    id: string; // ex: "eletronicos"
    nome: string; // ex: "Eletrônicos"
};

export type Produto = {
    id: number;
    nome: string;
    descricao: string;
    preco: number; // em centavos
    categoria: Categoria["id"];
    estoque: number;
    imagem: string; // URL da imagem
};

// Query params de GET /produtos
export type FiltrosProdutos = {
    categoria?: Categoria["id"];
    busca?: string;
};
