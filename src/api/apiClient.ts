import axios from "axios";

const apiClient = axios.create({
    baseURL: "https://loja-api-wheat.vercel.app",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.EXPO_PUBLIC_API_KEY,
    },
});

export default apiClient;