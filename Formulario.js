document.addEventListener("DOMContentLoaded", () => {
    let boton = document.getElementById("btnRegistrar");
    boton.addEventListener("click", evento => {
        registrarCliente();
    });

    let registrarCliente = async () => {
        let campos = {};
        
        campos.name = document.getElementById("firstname").value;
        campos.password = document.getElementById("password").value;
        campos.surname = document.getElementById("lastname").value;
        campos.mail = document.getElementById("email").value;
        campos.phone = document.getElementById("phone").value;
        campos.address = document.getElementById("address").value;
        campos.address2 = document.getElementById("address2").value;
        campos.state = document.getElementById("state").value;
        campos.country = document.getElementById("country").value;
        campos.post = document.getElementById("post").value;
        campos.zip_code = document.getElementById("area").value;

        try {
            const peticion = await fetch("http://localhost:8080/api/register", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(campos)
            });

            if (!peticion.ok) {
                throw new Error("Error en la petición de registro");
            }

            // Suponiendo que `detalles` necesita algunos de los campos del registro anterior.
           

            const peticion2 = await fetch(`http://localhost:8080/api/detalles/${campos.mail}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify()
            });

            if (!peticion2.ok) {
                throw new Error("Error en la petición de detalles");
            }

            console.log("Registro y detalles completados exitosamente");

        } catch (error) {
            console.error("Error:", error);
        }
    };

    let botonMen = document.getElementById("btnMenu");
    botonMen.addEventListener("click", evento => {
        evento.preventDefault(); // Evitar el envío del formulario
        volverMenu();
    });

    function volverMenu() {
        console.log("Redirigiendo a la página de inicio...");
        window.location.href = 'LandingPage.html';
    }
});
