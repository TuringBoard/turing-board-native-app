import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDNS6tW71-jOsGKOGrh6V5dQWTfZSS6tCI",
    authDomain: "turing-board.firebaseapp.com",
    projectId: "turing-board",
    storageBucket: "turing-board.appspot.com",
    messagingSenderId: "1008426809841",
    appId: "1:1008426809841:web:0e490af3b6046f64aeec50"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export default app;