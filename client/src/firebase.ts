// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore , enableIndexedDbPersistence } from "firebase/firestore";

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
const googleProvider = new GoogleAuthProvider();

export default app;
export {auth, googleProvider};
export const db = getFirestore(app);

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.log('Persistence failed, multiple tabs open?');
    } else if (err.code == 'unimplemented') {
      console.log('Persistence is not available in this browser.');
    }
  });
