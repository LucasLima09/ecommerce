import { Sessao } from "@/types/usuario";
import AsyncStorage from "@react-native-async-storage/async-storage";

// why: fica separado do authService para o apiClient poder ler o token sem import circular.
const CHAVE_SESSAO = "sessao";

export async function salvarSessao(sessao: Sessao): Promise<void> {
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

export async function lerSessao(): Promise<Sessao | null> {
    try {
        const salvo = await AsyncStorage.getItem(CHAVE_SESSAO);
        return salvo ? (JSON.parse(salvo) as Sessao) : null;
    } catch {
        // why: uma sessão corrompida não pode travar o app; o usuário só precisa entrar de novo.
        return null;
    }
}

export async function lerToken(): Promise<string | null> {
    return (await lerSessao())?.token ?? null;
}

export async function limparSessao(): Promise<void> {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
}
