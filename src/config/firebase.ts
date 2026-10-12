// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDljKr0U5wBUfR5LcVhgheGALjz9thR7zk",
    authDomain: "ecommerce-a15b9.firebaseapp.com",
    projectId: "ecommerce-a15b9",
    storageBucket: "ecommerce-a15b9.firebasestorage.app",
    messagingSenderId: "387803348393",
    appId: "1:387803348393:web:8093279153b1f4c3a0d8b8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);