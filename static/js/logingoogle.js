import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const firebaseConfig = {
    apiKey: "AIzaSyDVrFMPzj5uCYazmPfaMGUGLXlKbVNjT2U",
    authDomain: "grandgusto-bf307.firebaseapp.com",
    projectId: "grandgusto-bf307",
    storageBucket: "grandgusto-bf307.appspot.com",
    messagingSenderId: "894104978355",
    appId: "1:894104978355:web:b1ea9ff6fa551f627d41c6"
  };
  

        // Inicializar Firebase
        initializeApp(firebaseConfig);

        const auth = getAuth(); 
        const icons = document.getElementById('loginicon');

        icons.addEventListener('click', () => {
            const provider = new GoogleAuthProvider(); 
            signInWithPopup(auth, provider) // Utiliza el objeto de autenticación para iniciar sesión con el proveedor de Google
                .then((result) => {
                    
                    window.location.href = '/login-success';
               
                })
                .catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(errorCode, errorMessage);
                });
        });

    });