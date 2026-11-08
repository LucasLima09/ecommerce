import { FirebaseError } from "firebase/app";

const MENSAGENS: Record<string, string> = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/user-not-found": "E-mail ou senha incorretos.",
    "auth/wrong-password": "E-mail ou senha incorretos.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/user-disabled": "Esta conta foi desativada.",
    "auth/email-already-in-use": "Este e-mail já está cadastrado.",
    "auth/weak-password": "Senha muito fraca. Use no mínimo 6 caracteres.",
    "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    "auth/network-request-failed": "Sem conexão. Verifique sua internet e tente novamente.",
    "auth/operation-not-allowed": "Este método de login não está habilitado.",
};

export function getMensagemErroAuth(error: unknown): string {
    if (error instanceof FirebaseError && MENSAGENS[error.code]) {
        return MENSAGENS[error.code];
    }
    return "Algo deu errado. Tente novamente.";
}
