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
const storage = getStorage(app);

const form_action = document.getElementById('form-action');
const table_body = document.getElementById('product-list');
const bebidasRef = collection(db, "postres");
const searchInput = document.getElementById('searchInput');
const formularioEdicion = document.querySelector('#formulario-edicion');


form_action.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const descripcion = document.getElementById('descripcion').value;
    const costo = document.getElementById('costo').value;
    const precio_venta = document.getElementById('precio_venta').value;
    const imageInput = document.getElementById('imagen');
    const selectedFile = imageInput.files[0];

    const bebidasSnapshot = await getDocs(bebidasRef);
    let productoExistente =false;

    bebidasSnapshot.forEach(doc => {
        if (doc.data().nombre === nombre) {
            alert("¡El producto ya existe en la base de datos!");
            productoExistente = true;
            return;
        }
    });

    
if (!productoExistente) {
    
     const storageRef = ref(storage, 'images/' + selectedFile.name);
    await uploadBytes(storageRef, selectedFile);
    const imageUrl = await getDownloadURL(storageRef);

    const productData = {
        nombre: nombre,
        descripcion: descripcion,
        costo: costo,
        precio_venta: precio_venta,
        url: imageUrl
    };

    await addDoc(collection(db, "postres"), productData);

    alert("¡Producto registrado exitosamente!");
    // Limpiar formulario después de enviar
    document.getElementById('form-action').reset();
    mostrarDatosEnTabla();
}
});

async function mostrarDatosEnTabla() {
    table_body.innerHTML = '';
    try {
        const bebidasRef = collection(db, "postres");
        const querySnapshot = await getDocs(bebidasRef);

        querySnapshot.forEach(doc => {
            const data = doc.data();
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${data.nombre}</td>
                <td>${data.descripcion}</td>
                <td>${data.costo}</td>
                <td>${data.precio_venta}</td>
                <td><img src="${data.url}" alt="Imagen de producto"></td>
                <td><img class='edit' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAaxJREFUSEvN1+txgkAQAODdq4R0INiAVhIZJnVE68gQTCXSgGAHUkjmNrPgmuN4eCc46l8XPvbhsSI86YNPcuG14EVWBkrrDQG+I1Culdqd4rCS6iy+ypVrpU4fYd4X28mYUdR0toIrUrgWfJGWGwTKHPEKgX6KZLk14ztwmBZ0DUDIgUCym4SXSfQ2CEfpMSPADQcg0L5IlnGUHrcE+Hm5qI1nZQC/EAxmriCQypDGtVn2Vsbhd3G4ZFiZTximBZdegBY+Vm6eBVR04JhR2OwdAu24L2YVDMQJd4ebweInbLKzeswTLq0AgJu4M8zWZar/8SbNijTG3KOxnttl94L7cBk0ubEr7g0P4HXPfXBnmAOV0isB7LLLwLniXjCPvwlMwb1h+3d3Lz4Z9u25HBazwLfwPmQ2eAjXWuU8lHKmz57x9X1sn3DWyfEweOSEqx/hobDgfa9Fef3N2mPHraMOuw8GjEHDdc/yASW2b+Dku9YiMPBmusfsXFMmUcvqLnvNIserzvBK4/coFQHuTkm4Ny/r3as589FdygN2Xm897jkp9LX+SUxKxfHiP4GUCD097+WZAAAAAElFTkSuQmCC"/></td>
                <td><img class='delete' data-id="${doc.id}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAS9JREFUSEvtltFtwkAMhm0XEFM0YQNAfW+YpO0khU3CJMB7FbpBwhYoqHZ1NInCiRO+gJQ+XF5j+zv/9vmM0NOHPXHBC3wYzZeug6JA8XzKUm0ianAF/bwReBWVmfNwbV8VOB+/JMS8UWajgl+APQHKc/yZMdFicvza1k7/BTyNiendKxWlMROnk+N3cTXjdox8PI0BBrEyrtOsLa+quYrhbIOIyT1gEdnGp/3iWgxnVwcwAKyMZCLyapfASIqIu0rSZsg8ROqozM5lcUywZmgcRnOpaxrAna5TkNoaCqG5zoKE69TpOpkNwjgS8xsA2G92ykTr6n+zIj1E6i7PY29gAEijMvvweo/NBkJMeZdMax97wVPV2BgZ+NMPJYLgvQLZO5adgGqvvidrl29v4F9yCi8u5DsT8AAAAABJRU5ErkJggg=="/></td>
               `;
            table_body.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

searchInput.addEventListener('input', async () => {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const filteredProducts = [];

    const bebidasSnapshot = await getDocs(bebidasRef);
    bebidasSnapshot.forEach(doc => {
        const data = doc.data();
        if (data && data.nombre) {
            const producto = data.nombre.toLowerCase();
            if (producto.includes(searchTerm)) {
                filteredProducts.push(data);
            }
        }
    });

    actualizarTabla(filteredProducts);
});

function actualizarTabla(products) {
    const tablaCuerpo = document.getElementById('product-list');
    tablaCuerpo.innerHTML = '';

    products.forEach(producto => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.descripcion}</td>
                <td>${producto.costo}</td>
                <td>${producto.precio_venta}</td>
                <td><img src="${producto.url}" alt="Imagen de producto"></td>
                <td><img class='edit' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAaxJREFUSEvN1+txgkAQAODdq4R0INiAVhIZJnVE68gQTCXSgGAHUkjmNrPgmuN4eCc46l8XPvbhsSI86YNPcuG14EVWBkrrDQG+I1Culdqd4rCS6iy+ypVrpU4fYd4X28mYUdR0toIrUrgWfJGWGwTKHPEKgX6KZLk14ztwmBZ0DUDIgUCym4SXSfQ2CEfpMSPADQcg0L5IlnGUHrcE+Hm5qI1nZQC/EAxmriCQypDGtVn2Vsbhd3G4ZFiZTximBZdegBY+Vm6eBVR04JhR2OwdAu24L2YVDMQJd4ebweInbLKzeswTLq0AgJu4M8zWZar/8SbNijTG3KOxnttl94L7cBk0ubEr7g0P4HXPfXBnmAOV0isB7LLLwLniXjCPvwlMwb1h+3d3Lz4Z9u25HBazwLfwPmQ2eAjXWuU8lHKmz57x9X1sn3DWyfEweOSEqx/hobDgfa9Fef3N2mPHraMOuw8GjEHDdc/yASW2b+Dku9YiMPBmusfsXFMmUcvqLnvNIserzvBK4/coFQHuTkm4Ny/r3as589FdygN2Xm897jkp9LX+SUxKxfHiP4GUCD097+WZAAAAAElFTkSuQmCC"/></td>
                <td><img class='delete' data-id="${doc.id}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAS9JREFUSEvtltFtwkAMhm0XEFM0YQNAfW+YpO0khU3CJMB7FbpBwhYoqHZ1NInCiRO+gJQ+XF5j+zv/9vmM0NOHPXHBC3wYzZeug6JA8XzKUm0ianAF/bwReBWVmfNwbV8VOB+/JMS8UWajgl+APQHKc/yZMdFicvza1k7/BTyNiendKxWlMROnk+N3cTXjdox8PI0BBrEyrtOsLa+quYrhbIOIyT1gEdnGp/3iWgxnVwcwAKyMZCLyapfASIqIu0rSZsg8ROqozM5lcUywZmgcRnOpaxrAna5TkNoaCqG5zoKE69TpOpkNwjgS8xsA2G92ykTr6n+zIj1E6i7PY29gAEijMvvweo/NBkJMeZdMax97wVPV2BgZ+NMPJYLgvQLZO5adgGqvvidrl29v4F9yCi8u5DsT8AAAAABJRU5ErkJggg=="/></td>
        `;
        tablaCuerpo.appendChild(fila);
    });
}


table_body.addEventListener('click', async e => {
    if (e.target.classList.contains('edit')) {
        
        const productName = e.target.parentNode.parentNode.querySelector('td:first-child').textContent;

        
        const bebidasRef = collection(db, "postres");
        const querySnapshot = await getDocs(query(bebidasRef, where("nombre", "==", productName)));

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
        const docRef = doc(db, 'postres', productId);

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

function mostrarFormularioEdicion(productData) {
   
    formularioEdicion.querySelector('#nombreProducto').value = productData.nombre;
    formularioEdicion.querySelector('#descripcionedit').value = productData.descripcion;
    formularioEdicion.querySelector('#precioventa').value = productData.precio_venta;
    formularioEdicion.querySelector('#costoedit').value= productData.costo;
      
    const imagenPreview = formularioEdicion.querySelector('#imagen-preview');
    imagenPreview.src = productData.url;
    formularioEdicion.classList.toggle('active');
         if (formularioEdicion.classList.contains('active')) {
            formularioEdicion.style.animation = 'bounce-in 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
       }
}


document.querySelector('#form-edit').addEventListener('submit', async () => {
    event.preventDefault();
    
    const nombreProducto = document.querySelector('#nombreProducto').value;
    const descripcion= document.querySelector('#descripcionedit').value;
    const precioventa= document.querySelector('#precioventa').value;
    const costo = document.querySelector('#costoedit').value;
   
    const bebidasRef = collection(db, "postres");
    const querySnapshot = await getDocs(query(bebidasRef, where("nombre", "==", nombreProducto)));
    
    querySnapshot.forEach(async (doc) => {
        try {


             await updateDoc(doc.ref, {
                descripcion: descripcion,
                precio_venta: precioventa,
                costo: costo,
            });
            alert('¡Producto actualizado exitosamente!');
            document.getElementById('formulario-edicion').style.display = 'none';
            location.reload();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            alert('Hubo un error al actualizar el producto. Por favor, inténtalo de nuevo.');
        }
    });
});

document.querySelector('.none').addEventListener('click', ()=>{formularioEdicion.classList.remove('active');});


document.addEventListener("DOMContentLoaded", mostrarDatosEnTabla);

