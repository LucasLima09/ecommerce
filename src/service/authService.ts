import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../config/firebase";


export async function registerUser(email: string, password: string) {
    await createUserWithEmailAndPassword(auth, email, password);
}

export async function loginUser(email: string, password: string) {
    const user = await signInWithEmailAndPassword(auth, email, password);
    return user;
}

export async function logoutUser() {
    await signOut(auth);
}