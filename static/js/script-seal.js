import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs , deleteDoc, doc, setDoc, getDoc, query, where, updateDoc  } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDVrFMPzj5uCYazmPfaMGUGLXlKbVNjT2U",
    authDomain: "grandgusto-bf307.firebaseapp.com",
    projectId: "grandgusto-bf307",
    storageBucket: "grandgusto-bf307.appspot.com",
    messagingSenderId: "894104978355",
    appId: "1:894104978355:web:b1ea9ff6fa551f627d41c6"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form_action = document.querySelector('#form-action');
const table_body = document.querySelector('#table-page');
const bebidasRef = collection(db, "gastos");
let bebidasSnapshot = await getDocs(bebidasRef);
const searchInput = document.getElementById('searchInput');
const formularioEdicion = document.querySelector('#formulario-edicion');


form_action.addEventListener('submit', async function(event) {
    
    event.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const codigo = document.getElementById('codigo').value;
    const descripcion = document.getElementById('descripcion').value;
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const monto = document.getElementById('monto').value;

    let productoExistente =false;

    
if (!productoExistente) {

const inventarioRef = collection(db, "inventario");
const querySnapshot = await getDocs(query(inventarioRef, where("codigo", "==", codigo)));

if (!querySnapshot.empty) {
   
    const inventarioDoc = querySnapshot.docs[0];
    const inicial = inventarioDoc.data().entrada;
    const salida = inventarioDoc.data().salida;
    const total = inventarioDoc.data().cantidadStock;
    
    let inicialC= parseInt(inicial)-salida;

    inicialC=(inicialC < 0 ? 0 : inicialC);

    inicialC=inicialC+cantidad;

    const nuevasalida = Math.max(salida - cantidad, 0);
    
    await updateDoc(inventarioDoc.ref, { entrada: inicialC, salida: nuevasalida, cantidadStock:inicialC});   
} 


const productData = {
        fecha: fecha,
        codigo: codigo,
        descripcion: descripcion,
        cantidad: cantidad,
        monto: monto,
    };

    await addDoc(collection(db, "gastos"), productData);

    alert("¡Producto registrado exitosamente!");
  
    document.getElementById('form-action').reset();
    mostrarDatosEnTabla();
}
});

async function mostrarDatosEnTabla() {
    table_body.innerHTML = '';
    try {
        const bebidasRef = collection(db, "gastos");
        const querySnapshot = await getDocs(bebidasRef);

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${data.fecha}</td>
                <td>${data.codigo}</td>
                <td>${data.descripcion}</td>
                <td>${data.cantidad}</td>
                <td>${data.monto}</td>
                <td><img class='delete' data-id="${doc.id}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAS9JREFUSEvtltFtwkAMhm0XEFM0YQNAfW+YpO0khU3CJMB7FbpBwhYoqHZ1NInCiRO+gJQ+XF5j+zv/9vmM0NOHPXHBC3wYzZeug6JA8XzKUm0ianAF/bwReBWVmfNwbV8VOB+/JMS8UWajgl+APQHKc/yZMdFicvza1k7/BTyNiendKxWlMROnk+N3cTXjdox8PI0BBrEyrtOsLa+quYrhbIOIyT1gEdnGp/3iWgxnVwcwAKyMZCLyapfASIqIu0rSZsg8ROqozM5lcUywZmgcRnOpaxrAna5TkNoaCqG5zoKE69TpOpkNwjgS8xsA2G92ykTr6n+zIj1E6i7PY29gAEijMvvweo/NBkJMeZdMax97wVPV2BgZ+NMPJYLgvQLZO5adgGqvvidrl29v4F9yCi8u5DsT8AAAAABJRU5ErkJggg=="/></td>
               `;
            table_body.appendChild(fila);
        });
        mostrarTotalGastos();
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

searchInput.addEventListener('input', async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredProducts = [];

    bebidasSnapshot = await getDocs(bebidasRef);
    bebidasSnapshot.forEach(doc => {
        const data = doc.data();
        if (data && data.fecha) {
            const producto = data.fecha;
            if (producto.includes(searchTerm)) {
                filteredProducts.push(data);
            }
        }
    });

    actualizarTabla(filteredProducts);
});

function actualizarTabla(products) {
    table_body.innerHTML = '';

    products.forEach(data => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${data.fecha}</td>
            <td>${data.codigo}</td>
            <td>${data.descripcion}</td>
            <td>${data.cantidad}</td>
            <td>${data.monto}</td>
            <td><img class='delete' data-id="${data.id}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAS9JREFUSEvtltFtwkAMhm0XEFM0YQNAfW+YpO0khU3CJMB7FbpBwhYoqHZ1NInCiRO+gJQ+XF5j+zv/9vmM0NOHPXHBC3wYzZeug6JA8XzKUm0ianAF/bwReBWVmfNwbV8VOB+/JMS8UWajgl+APQHKc/yZMdFicvza1k7/BTyNiendKxWlMROnk+N3cTXjdox8PI0BBrEyrtOsLa+quYrhbIOIyT1gEdnGp/3iWgxnVwcwAKyMZCLyapfASIqIu0rSZsg8ROqozM5lcUywZmgcRnOpaxrAna5TkNoaCqG5zoKE69TpOpkNwjgS8xsA2G92ykTr6n+zIj1E6i7PY29gAEijMvvweo/NBkJMeZdMax97wVPV2BgZ+NMPJYLgvQLZO5adgGqvvidrl29v4F9yCi8u5DsT8AAAAABJRU5ErkJggg=="/></td>
        `;
        table_body.appendChild(fila);
    });
}

table_body.addEventListener('click', async e => {
    if(e.target.classList.contains('delete')){
    
        const productId = e.target.getAttribute('data-id');
        const docRef = doc(db, 'gastos', productId);

        try {
            await deleteDoc(docRef);
            alert("¡Producto eliminado exitosamente!");
            location.reload();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("Hubo un error al eliminar el producto. Por favor, inténtalo de nuevo.");
        }
    }
});

const totalGastosElement = document.querySelector('#all-outlay');

function mostrarTotalGastos() {
    let total = 0;
    const filas = document.querySelectorAll('#table-page tr'); // Ahora se declara aquí para que sea accesible desde esta función
    console.log(filas);
    filas.forEach(fila => {
        const monto = parseFloat(fila.querySelector('td:nth-child(5)').innerHTML);
        total += monto;
    });

    totalGastosElement.innerText = total.toFixed(2); 
}

document.querySelector('.all').addEventListener('click', ()=>{location.reload()})

mostrarDatosEnTabla();