import { lerToken } from "@/api/sessaoStorage";
import { create } from "axios";

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

export default apiClient;
