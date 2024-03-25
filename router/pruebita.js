import express from "express";
const router = express.Router();
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configura tu aplicación Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAEQhoeGkOPI-MKpv3nJ7H0ekyvHHlFsYc",
    authDomain: "grandgusto-9b9c1.firebaseapp.com",
    databaseURL: "https://grandgusto-9b9c1-default-rtdb.firebaseio.com",
    projectId: "grandgusto-9b9c1",
    storageBucket: "grandgusto-9b9c1.appspot.com",
    messagingSenderId: "886817543492",
    appId: "1:886817543492:web:8cb65c0086e71796343311"
  };
  
initializeApp(firebaseConfig);
const db = getFirestore();

// Ruta por omisión
router.get('/', (req, res) => {
    res.render('index'); // Renderiza la vista principal
});

// Ruta para manejar el formulario de registro (POST)
router.post('/index', (req, res) => {
    res.render('index'); // Renderiza la vista principal
});

// Ruta para manejar el formulario de inicio de sesión (GET)
router.get('/login', (req, res) => {
    res.render('login'); // Renderiza la vista del formulario de inicio de sesión
});
// Ruta para manejar el formulario de inicio de sesión (POST)
router.post('/login', async (req, res) => {
    try {
        // Crea un documento con los datos del formulario
        const params = {
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password
        };

        // Inserta el documento en la colección 'usuarios'
        await addDoc(collection(db, 'usuarios'), params);

        // Redirige o renderiza una vista según tus necesidades
        res.render('login', { successMessage: 'Usuario registrado correctamente' });
    } catch (error) {
        console.error('Error al agregar el usuario a Firestore:', error);
        // Maneja el error de alguna manera (por ejemplo, renderizando una página de error)
        res.render('error', { errorMessage: 'Error al agregar el usuario a Firestore' });
    }
});


export default router;
