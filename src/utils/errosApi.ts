import { ErroApi } from "@/types/api";
import { isAxiosError } from "axios";

// invariant: o axios rejeita toda resposta fora de 2xx (o mesmo que conferir resposta.ok);
// quando a API responde { erro: "..." }, essa mensagem já está pronta para o usuário.
export function getMensagemErroApi(error: unknown, padrao = "Algo deu errado. Tente novamente."): string {
    if (isAxiosError<ErroApi>(error)) {
        const mensagem = error.response?.data?.erro;
        if (mensagem) return mensagem;
        if (!error.response) return "Sem conexão. Verifique sua internet e tente novamente.";
    }
    return padrao;
}
