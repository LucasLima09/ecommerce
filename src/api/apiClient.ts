import { lerToken, limparSessao } from "@/api/sessaoStorage";
import { create, isAxiosError } from "axios";

const apiClient = create({
    baseURL: "https://loja-api-wheat.vercel.app",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
    },
});

// invariant: toda chamada sai com o token salvo, se houver; as telas e services não precisam repassá-lo.
apiClient.interceptors.request.use(async (config) => {
    const token = await lerToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// why: o AuthContext registra aqui como reagir à sessão expirada; o apiClient não pode importar o contexto.
let aoExpirarSessao: (() => void) | null = null;

export function definirAoExpirarSessao(callback: (() => void) | null) {
    aoExpirarSessao = callback;
}

// invariant: 401 numa chamada que levou token significa sessão inválida → apaga e volta para o login.
// why: o /login fica de fora porque lá o 401 é "senha errada", não sessão expirada.
apiClient.interceptors.response.use(undefined, async (error) => {
    if (
        isAxiosError(error) &&
        error.response?.status === 401 &&
        error.config?.headers?.Authorization &&
        error.config.url !== "/login"
    ) {
        await limparSessao();
        aoExpirarSessao?.();
    }
    return Promise.reject(error);
});

export default apiClient;
