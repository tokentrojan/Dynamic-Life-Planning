// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBgVISGMYHYzk79ScYJU3twGhBGbwAeK8I",
    authDomain: "dynamic-life-planning.firebaseapp.com",
    projectId: "dynamic-life-planning",
    storageBucket: "dynamic-life-planning.firebasestorage.app",
    messagingSenderId: "872066831285",
    appId: "1:872066831285:web:d4e0c8badf43718c19bffc",
    measurementId: "G-HWLTDZPRJS"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default app;
export {auth};
