document.addEventListener(`DOMContentLoaded`, function () {


    const email =  {
        email: '',
        asunto: '',
        mensaje: ''
    }


    //Seleccionar los elementos de la interfaz
    const inputEmail = document.querySelector('#email');
    const inputAsunto = document.querySelector(`#asunto`);
    const inputMensaje = document.querySelector(`#mensaje`);
    const formulario = document.querySelector(`#formulario`);

    //Asignar eventos
    //blur es cuando te sales del campo 
    inputEmail.addEventListener(`blur`, validar);
    inputAsunto.addEventListener(`blur`, validar);
    inputMensaje.addEventListener(`blur`, validar);

    function validar(e) {
        if (e.target.value.trim() === ``) {
            mostrarAlerta(`El Campo ${e.target.id} es obligatorio`, e.target.parentElement);
            return;
        } 

        if (e.target.id === 'email' && !validarEmail(e.target.value)) {
            mostrarAlerta(`El Email No es Valido`, e.target.parentElement);
            return;
        }

        limpiarAlerta(e.target.parentElement);

        //asignar valores
        email[e.target.name] = e.target.value.trim().toLowerCase();
        
        //comprobar el obj email
        comprobarEmail();
    }

    function mostrarAlerta(mensaje, referencia) {

        limpiarAlerta(referencia);

        //generar alerta en HTML
        const error = document.createElement(`P`);
        error.textContent = mensaje;
        error.classList.add(`bg-red-600`, `text-center`, `p-2`, `text-white`);

        //Inyectar el error en el HTML
        referencia.appendChild(error);

    }

    function limpiarAlerta(referencia) {
        //comprobar si ya existe la alerta
        const alerta = referencia.querySelector(`.bg-red-600`);
        if (alerta !== null) {
            alerta.remove();
        }
    }

    function validarEmail(email) {
        const regex =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ ;
        const resultado = regex.test(email);
        return resultado;
    }

    function comprobarEmail() {
        console.log(Object.values(email).includes(''));
    }
})