function redirectToRegister() {
    window.location.href = 'Formulario.html';
}
function adminMode(){
    window.location.href = 'Admin.html';
}
function weatherMode(){
    window.location.href = './css/weather/index.html';
}
function login() {
    let loginCliente = async () => {
        let campos = {};
        campos.mail = document.getElementById("loginEmail").value;
        campos.password = document.getElementById("loginPassword").value;

        const peticion = await fetch("http://localhost:8080/api/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(campos)
        });

        if (peticion.status === 200) {
            const respuesta = await peticion.json();
            console.log(respuesta.message);
            const clienteId = respuesta.clienteId;
            // Redirige al menú de usuario con el ID del cliente en la URL
            window.location.href = `UserMenu.html?clienteId=${clienteId}`;
        } else {
            console.log("Correo no registrado");
            alert("Contraseña incorrecta");
        }
    }

    loginCliente();
}
