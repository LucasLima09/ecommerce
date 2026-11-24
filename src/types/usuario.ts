export type Usuario = {
    id: number; // ex.: 7
    nome: string;
    email: string; // sempre em minúsculas
};

// Resposta de POST /login
export type Sessao = {
    token: string;
    usuario: Usuario;
};

// Body de POST /usuarios
export type NovoUsuario = {
    nome: string;
    email: string;
    senha: string;
};
