const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const logses = document.querySelector('#logses');
const sing = document.querySelector('.sign-in');
const regis = document.querySelector('#regis');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const homeBtn = document.querySelector('.home');

homeBtn.addEventListener( 'click' , ()=>{
    window.location.href = '../index.html';
});


document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('pass').value.trim();

    if (!nombre || !email || !pass) {
        alert('Todos los campos son obligatorios');
        return;
    }

    if (!validateEmail(email)) {
        alert('Por favor, ingrese una dirección de correo electrónico válida');
        return;
    }

    if (pass.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    console.log('Formulario validado correctamente');

    const men = document.createElement('p');
    men.textContent = 'USUARIO AGREGADO CON EXITO';
    men.clas
    regis.appendChild(men);

    console.log('hecha con exito');
});

function validateEmail(email) {
    const re = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return re.test(email);
}

sing.addEventListener('submit', function() {
    sing.reset();
});

