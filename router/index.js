import express from "express";
const router = express.Router();
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Swal from 'sweetalert2';


// Configura tu aplicación Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDVrFMPzj5uCYazmPfaMGUGLXlKbVNjT2U",
    authDomain: "grandgusto-bf307.firebaseapp.com",
    projectId: "grandgusto-bf307",
    storageBucket: "grandgusto-bf307.appspot.com",
    messagingSenderId: "894104978355",
    appId: "1:894104978355:web:b1ea9ff6fa551f627d41c6"
  };
  
initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth();

router.get('/', async (req, res) => {
    let errorMessage='';
    res.render('login', {errorMessage});  // Renderiza la vista del formulario de inicio de sesión
});

router.get('/register', async (req, res) => {
        let errorMessage='';
        res.render('register', {errorMessage});  // Renderiza la vista del formulario de inicio de sesión
});

router.post('/register', async (req, res) => {
    let errorMessage='';
    try {
        const { email, password } = req.body;
        const {password2} = req.body;
        if(password === password2){

        // Crea el usuario en Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Obtiene el ID de usuario asignado por Firebase
        const userId = userCredential.user.uid;

        const userData = {
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password
        };

        // Guarda la información del usuario en Firestore
        await addDoc(collection(db, 'usuarios'), userData);

        // Redirige o renderiza una vista según tus necesidades
        res.redirect('/login-success');
    } else {
        throw new Error('Las contraseñas no coinciden. Por favor, inténtalo de nuevo.');
    }
    } catch (error) {
        errorMessage=error;
        console.error('Error al registrar el usuario:', error);
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'El correo electrónico ya está en uso. Por favor, utiliza otro.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La contraseña es demasiado débil. Por favor, elige una contraseña más segura.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'El formato del correo electrónico no es válido. Por favor, verifica tu correo electrónico.';
        }
        res.render('register', { errorMessage });  
    }
});

router.get('/login', (req, res) => {
    let errorMessage='';
    res.render('login', {errorMessage}); // Renderiza la vista del formulario de inicio de sesión
});

router.post('/login', async (req, res) => {
    let errorMessage = '';
    try {
        const { loginemail, loginpassword } = req.body;
        
        await signInWithEmailAndPassword(auth, loginemail, loginpassword);
        res.redirect('/login-success');
} catch (error) {
        console.error('Error al iniciar sesión:', error);
        if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            errorMessage = 'Credenciales de inicio de sesión incorrectas. Por favor, verifica tu correo electrónico y contraseña.';
        } else if (error.code === 'auth/user-not-found') {
            errorMessage = 'Usuario no encontrado. Por favor, verifica tu correo electrónico.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'El formato del correo electrónico no es válido. Por favor, verifica tu correo electrónico.';
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = 'Tu cuenta ha sido temporalmente deshabilitada debido a demasiados intentos de inicio de sesión fallidos. Por favor, espera un momento y luego intenta nuevamente.';
        } else {
            errorMessage = 'Se produjo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.';
        }
        res.render('login', { errorMessage });
    }

        
});

router.get('/login-success', (req, res) => {
    res.render('login-success');
});


router.get('/index', (req, res) => {
    res.render('index');
});
export default router;
