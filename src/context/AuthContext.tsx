import { auth } from "@/config/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, PropsWithChildren, use, useEffect, useState, } from "react";

type AuthContextType = { user: User | null; loading: boolean};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
    const value = use(AuthContext);
    if (!value) throw new Error("useAuth precisa estar dentro do AuthProvider");
    return value;
}

export function AuthProvider({children}: PropsWithChildren){
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                setUser(firebaseUser)
                setLoading(false)
        })
        return unsubscribe;
    },[])
    return <AuthContext value={{ user, loading }}>{children}</AuthContext>
    
}