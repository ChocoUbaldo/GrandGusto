import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs , deleteDoc, doc, setDoc, getDoc, query, where, updateDoc  } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-storage.js";

document.addEventListener("DOMContentLoaded", async function() {
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
const storage = getStorage(app);

const formaction = document.querySelector('#form-action');
const formularioEdicion = document.querySelector('#formulario-edicion');
const tablaCuerpo = document.querySelector('#product-list');


const entrada =  document.querySelector('#entrada');
const salida = document.querySelector('#salida');
const cantidadStock = document.getElementById('cantidadStock');
const entradaedit = document.querySelector('#entradaedit');
const salidaedit = document.querySelector('#salidaedit');
const cantidadStockedit = document.getElementById('cantidadStockedit');

function actualizarCantidadStock(entradaElement, salidaElement, cantidadStockElement) {
    const entradaValor = parseInt(entradaElement.value) || 0;
    const salidaValor = parseInt(salidaElement.value) || 0;
    const cantidadStockResult = Math.max(0, entradaValor - salidaValor);
    cantidadStockElement.value = cantidadStockResult;
}

entrada.addEventListener('input', () => actualizarCantidadStock(entrada, salida, cantidadStock));
salida.addEventListener('input', () => actualizarCantidadStock(entrada, salida, cantidadStock));
entradaedit.addEventListener('input', () => actualizarCantidadStock(entradaedit, salidaedit, cantidadStockedit));
salidaedit.addEventListener('input', () => actualizarCantidadStock(entradaedit, salidaedit, cantidadStockedit));

const bebidasRef = collection(db, "inventario");
let bebidasSnapshot = await getDocs(bebidasRef);
formaction.addEventListener('submit', async (event) => {
    event.preventDefault();

    const codigo = document.querySelector('#codigo').value;
    const producto = document.getElementById('producto').value;
   const descripcion = document.querySelector('#descripcion').value;
   
    let productoExistente = false;
    let nuevoproducto;

    bebidasSnapshot.forEach(doc => {
        if (doc.data().nombre === producto || doc.data().codigo === codigo) {
            productoExistente = true;
            alert("¡El producto ya existe en la base de datos!");
            return;
        }
    });
    
    if (!productoExistente) {

        const productData = {
            codigo: codigo,
            producto: producto,
            descripcion: descripcion,
            entrada: parseInt(entrada.value),
            salida: parseInt(salida.value),
            cantidadStock: parseInt(cantidadStock.value)
        };

       
        try {
           await addDoc(collection(db, "inventario"), productData);
           formaction.reset();
           showalert();
        } catch (error) {
            console.error("Error al agregar producto a Firestore:", error);
            alert("Hubo un error al agregar el producto. Por favor, inténtalo de nuevo.");
        }
    }
});

function crearFilaTabla(doc) {
    const codigo = doc.data().codigo;
    const producto = doc.data().producto;
    const cantidadStock = doc.data().cantidadStock;
    const descripcion = doc.data().descripcion;
    const entrada = doc.data().entrada;
    const salida = doc.data().salida;

    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${codigo}</td>
        <td>${producto}</td>
        <td>${descripcion}</td>
        <td>${entrada}</td>
        <td>${salida}</td>
        <td>${cantidadStock}</td>
        <td><img class='edit' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAaxJREFUSEvN1+txgkAQAODdq4R0INiAVhIZJnVE68gQTCXSgGAHUkjmNrPgmuN4eCc46l8XPvbhsSI86YNPcuG14EVWBkrrDQG+I1Culdqd4rCS6iy+ypVrpU4fYd4X28mYUdR0toIrUrgWfJGWGwTKHPEKgX6KZLk14ztwmBZ0DUDIgUCym4SXSfQ2CEfpMSPADQcg0L5IlnGUHrcE+Hm5qI1nZQC/EAxmriCQypDGtVn2Vsbhd3G4ZFiZTximBZdegBY+Vm6eBVR04JhR2OwdAu24L2YVDMQJd4ebweInbLKzeswTLq0AgJu4M8zWZar/8SbNijTG3KOxnttl94L7cBk0ubEr7g0P4HXPfXBnmAOV0isB7LLLwLniXjCPvwlMwb1h+3d3Lz4Z9u25HBazwLfwPmQ2eAjXWuU8lHKmz57x9X1sn3DWyfEweOSEqx/hobDgfa9Fef3N2mPHraMOuw8GjEHDdc/yASW2b+Dku9YiMPBmusfsXFMmUcvqLnvNIserzvBK4/coFQHuTkm4Ny/r3as589FdygN2Xm897jkp9LX+SUxKxfHiP4GUCD097+WZAAAAAElFTkSuQmCC"/></td>
        <td><img class='delete' data-id="${doc.id}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAS9JREFUSEvtltFtwkAMhm0XEFM0YQNAfW+YpO0khU3CJMB7FbpBwhYoqHZ1NInCiRO+gJQ+XF5j+zv/9vmM0NOHPXHBC3wYzZeug6JA8XzKUm0ianAF/bwReBWVmfNwbV8VOB+/JMS8UWajgl+APQHKc/yZMdFicvza1k7/BTyNiendKxWlMROnk+N3cTXjdox8PI0BBrEyrtOsLa+quYrhbIOIyT1gEdnGp/3iWgxnVwcwAKyMZCLyapfASIqIu0rSZsg8ROqozM5lcUywZmgcRnOpaxrAna5TkNoaCqG5zoKE69TpOpkNwjgS8xsA2G92ykTr6n+zIj1E6i7PY29gAEijMvvweo/NBkJMeZdMax97wVPV2BgZ+NMPJYLgvQLZO5adgGqvvidrl29v4F9yCi8u5DsT8AAAAABJRU5ErkJggg=="/></td>
       `;
      
       return fila;
}

tablaCuerpo.innerHTML = '';

bebidasSnapshot.forEach(doc => {
    const fila = crearFilaTabla(doc);
    tablaCuerpo.appendChild(fila);
});

tablaCuerpo.addEventListener('click', async e => {
    if (e.target.classList.contains('edit')) {
        
        const productName = e.target.parentNode.parentNode.querySelector('td:first-child').textContent;

        
        const bebidasRef = collection(db, "inventario");
        const querySnapshot = await getDocs(query(bebidasRef, where("codigo", "==", productName)));

        if (!querySnapshot.empty) {
            querySnapshot.forEach(doc => {
                const productData = doc.data();
                const productId = doc.id;
                console.log(productId)
               
                mostrarFormularioEdicion(productData)
            });
        }
    }else if(e.target.classList.contains('delete')){
    
        const productId = e.target.getAttribute('data-id');
        const docRef = doc(db, 'inventario', productId);

        try {
            await deleteDoc(docRef);
            showalertdelete();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("Hubo un error al eliminar el producto. Por favor, inténtalo de nuevo.");
        }
    }
});

function mostrarFormularioEdicion(productData) {
   
    formularioEdicion.querySelector('#codigoedit').value = productData.codigo;
    formularioEdicion.querySelector('#productoedit').value = productData.producto;
    formularioEdicion.querySelector('#descripcionedit').value = productData.descripcion;
    formularioEdicion.querySelector('#entradaedit').value = productData.entrada;
    formularioEdicion.querySelector('#salidaedit').value = productData.salida;
    formularioEdicion.querySelector('#cantidadStockedit').value = productData.cantidadStock;

    formularioEdicion.classList.toggle('active');
         if (formularioEdicion.classList.contains('active')) {
            formularioEdicion.style.animation = 'bounce-in 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
       }
}


document.querySelector('#form-edit').addEventListener('submit', async () => {
    event.preventDefault();
    
    const codigo = document.querySelector('#codigoedit').value;;

    const bebidasRef = collection(db, "inventario");
    const querySnapshot = await getDocs(query(bebidasRef, where("codigo", "==", codigo)));
    
    querySnapshot.forEach(async (doc) => {
        try {
             await updateDoc(doc.ref, {
                producto : document.querySelector('#productoedit').value,
                descripcion : document.querySelector('#descripcionedit').value,
                entrada : document.querySelector('#entradaedit').value,
                salida:  document.querySelector('#salidaedit').value,
                cantidadStock : document.querySelector('#cantidadStockedit').value
            });
            showalertupdate();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            alert('Hubo un error al actualizar el producto. Por favor, inténtalo de nuevo.');
        }
    });
});


const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredProducts = [];

    bebidasSnapshot = await getDocs(bebidasRef);
    bebidasSnapshot.forEach(doc => {
        const data = doc.data();
        if (data && data.producto) {
            const producto = data.producto.toLowerCase();
            if (producto.includes(searchTerm)) {
                filteredProducts.push(data);
            }
        }
    });

    actualizarTabla(filteredProducts);
});

function actualizarTabla(products) {
    tablaCuerpo.innerHTML = '';

    products.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
        <td>${producto.codigo}</td>
        <td>${producto.producto}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.entrada}</td>
        <td>${producto.salida}</td>
        <td>${producto.cantidadStock}</td>
        <td><img class='edit' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAaxJREFUSEvN1+txgkAQAODdq4R0INiAVhIZJnVE68gQTCXSgGAHUkjmNrPgmuN4eCc46l8XPvbhsSI86YNPcuG14EVWBkrrDQG+I1Culdqd4rCS6iy+ypVrpU4fYd4X28mYUdR0toIrUrgWfJGWGwTKHPEKgX6KZLk14ztwmBZ0DUDIgUCym4SXSfQ2CEfpMSPADQcg0L5IlnGUHrcE+Hm5qI1nZQC/EAxmriCQypDGtVn2Vsbhd3G4ZFiZTximBZdegBY+Vm6eBVR04JhR2OwdAu24L2YVDMQJd4ebweInbLKzeswTLq0AgJu4M8zWZar/8SbNijTG3KOxnttl94L7cBk0ubEr7g0P4HXPfXBnmAOV0isB7LLLwLniXjCPvwlMwb1h+3d3Lz4Z9u25HBazwLfwPmQ2eAjXWuU8lHKmz57x9X1sn3DWyfEweOSEqx/hobDgfa9Fef3N2mPHraMOuw8GjEHDdc/yASW2b+Dku9YiMPBmusfsXFMmUcvqLnvNIserzvBK4/coFQHuTkm4Ny/r3as589FdygN2Xm897jkp9LX+SUxKxfHiP4GUCD097+WZAAAAAElFTkSuQmCC"/></td>
        <td><img class='delete' data-id="${doc.id}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAS9JREFUSEvtltFtwkAMhm0XEFM0YQNAfW+YpO0khU3CJMB7FbpBwhYoqHZ1NInCiRO+gJQ+XF5j+zv/9vmM0NOHPXHBC3wYzZeug6JA8XzKUm0ianAF/bwReBWVmfNwbV8VOB+/JMS8UWajgl+APQHKc/yZMdFicvza1k7/BTyNiendKxWlMROnk+N3cTXjdox8PI0BBrEyrtOsLa+quYrhbIOIyT1gEdnGp/3iWgxnVwcwAKyMZCLyapfASIqIu0rSZsg8ROqozM5lcUywZmgcRnOpaxrAna5TkNoaCqG5zoKE69TpOpkNwjgS8xsA2G92ykTr6n+zIj1E6i7PY29gAEijMvvweo/NBkJMeZdMax97wVPV2BgZ+NMPJYLgvQLZO5adgGqvvidrl29v4F9yCi8u5DsT8AAAAABJRU5ErkJggg=="/></td>
       `;
        tablaCuerpo.appendChild(fila);
    });
}


document.querySelector('.none').addEventListener('click', ()=>{formularioEdicion.classList.remove('active');});


function showalert() {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Producto registrado con éxito.',
      confirmButtonColor: '#60421f',
      confirmButtonText: 'OK'
    }).then((result)=>{
        if(result.isConfirmed){
            location.reload();
        }
    })
}

function showalertdelete() {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Producto eliminado con éxito.',
      confirmButtonColor: '#60421f',
      confirmButtonText: 'OK'
    }).then((result)=>{
        if(result.isConfirmed){
            location.reload();
        }
    })
  }

function showalertupdate() {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: 'Producto actualizado con éxito.',
      confirmButtonColor: '#60421f',
      confirmButtonText: 'OK'   
    }).then((result)=>{
        if(result.isConfirmed){
            location.reload();
            document.getElementById('formulario-edicion').style.display = 'none';
        }
    })
}


});