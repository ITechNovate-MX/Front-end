// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBbvI-Lk2xqOjIpFi9B3eumKFfPd5cHRwY",
    authDomain: "asr-facturacion-29832.firebaseapp.com",
    projectId: "asr-facturacion-29832",
    storageBucket: "asr-facturacion-29832.firebasestorage.app",
    messagingSenderId: "675191435493",
    appId: "1:675191435493:web:7a95297554ecf59690640c"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
