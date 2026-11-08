import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { Platform } from "react-native";

const firebaseConfig = {
    apiKey: "AIzaSyDljKr0U5wBUfR5LcVhgheGALjz9thR7zk",
    authDomain: "ecommerce-a15b9.firebaseapp.com",
    projectId: "ecommerce-a15b9",
    storageBucket: "ecommerce-a15b9.firebasestorage.app",
    messagingSenderId: "387803348393",
    appId: "1:387803348393:web:8093279153b1f4c3a0d8b8"
};

const app = initializeApp(firebaseConfig);

// Por padrão, no React Native o Firebase guarda a sessão só na memória
// (o usuário teria que logar de novo toda vez que o app fecha).
// Com initializeAuth + AsyncStorage a sessão fica salva no dispositivo.
// No web o getAuth já persiste sozinho (IndexedDB do navegador).
export const auth = Platform.OS === "web"
    ? getAuth(app)
    : initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
