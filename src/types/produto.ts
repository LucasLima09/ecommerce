type Categoria = "eletronicos" | "roupas" | "casa" | "livros";

export type Produto = {
    id: number;
    nome: string;
    descricao: string;
    preco: number; // em centavos
    categoria: Categoria;
    estoque: number;
    imagem: string; // URL da imagem
};