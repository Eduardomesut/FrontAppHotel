document.getElementById("btnObtenerClientes").addEventListener("input", (event) => {
    const query = event.target.value;
    obtenerClientes(query);
});

const obtenerClientes = async (query) => {
    try {
        const respuesta = await fetch(`http://localhost:8080/api/clientes/${query}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (respuesta.ok) {
            const clientes = await respuesta.json();
            mostrarClientes(clientes);
        } else {
            alert("Error al obtener la lista de clientes");
        }
    } catch (error) {
        console.error("Error al obtener clientes:", error);
    }
}

const mostrarClientes = (clientes) => {
    const clientesTabla = document.getElementById("clientesTabla").getElementsByTagName('tbody')[0];
    clientesTabla.innerHTML = "";

    clientes.forEach(cliente => {
        const fila = clientesTabla.insertRow();
        
        const celdaNombre = fila.insertCell(0);
        const celdaApellido = fila.insertCell(1);
        const celdaCorreo = fila.insertCell(2);
        const celdaTelefono = fila.insertCell(3);
        const celdaDireccion = fila.insertCell(4);
        const celdaDireccion2 = fila.insertCell(5);
        const celdaEstado = fila.insertCell(6);
        const celdaPais = fila.insertCell(7);
        const celdaCodigoPostal = fila.insertCell(8);
        const celdaArea = fila.insertCell(9);
        const celdaAcciones = fila.insertCell(10);

        celdaNombre.innerHTML = cliente.name;
        celdaApellido.innerHTML = cliente.surname;
        celdaCorreo.innerHTML = cliente.mail;
        celdaTelefono.innerHTML = cliente.phone;
        celdaDireccion.innerHTML = cliente.address;
        celdaDireccion2.innerHTML = cliente.address2;
        celdaEstado.innerHTML = cliente.state;
        celdaPais.innerHTML = cliente.country;
        celdaCodigoPostal.innerHTML = cliente.post;
        celdaArea.innerHTML = cliente.zip_code;

        const botonEditar = document.createElement('button');
        botonEditar.textContent = 'Editar';
        botonEditar.onclick = () => editarCliente(cliente);

        const botonBorrar = document.createElement('button');
        botonBorrar.textContent = 'Borrar';
        botonBorrar.onclick = () => borrarCliente(cliente.id);

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonBorrar);
    });
}

const editarCliente = (cliente) => {
    document.getElementById('clienteId').value = cliente.id;
    document.getElementById('clienteNombre').value = cliente.name;
    
    document.getElementById('formularioEdicion').style.display = 'block';
};

document.getElementById('formEditarCliente').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const id = document.getElementById('clienteId').value;
    const nombre = document.getElementById('clienteNombre').value;
    const apellido = document.getElementById('clienteApellido').value;
    
    try {
        const respuesta = await fetch(`http://localhost:8080/api/cliente/${id}/${nombre}/${apellido}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: nombre })
        });

        if (respuesta.ok) {
            alert("Cliente actualizado correctamente");
            document.getElementById('formularioEdicion').style.display = 'none';
            const query = document.getElementById("btnObtenerClientes").value;
            obtenerClientes(query);
        } else {
            alert("Error al actualizar el cliente");
        }
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
    }
});

const borrarCliente = async (id) => {
    try {
        const respuesta = await fetch(`http://localhost:8080/api/clientes/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (respuesta.ok) {
            alert("Cliente borrado correctamente");
            const query = document.getElementById("btnObtenerClientes").value;
            obtenerClientes(query);
        } else {
            alert("Error al borrar el cliente");
        }
    } catch (error) {
        console.error("Error al borrar cliente:", error);
    }
}

document.getElementById("formHabitacion").addEventListener("submit", async (event) => {
    event.preventDefault();
    const numHabitacion = document.getElementById("numHabitacion").value;
    const tipo = document.getElementById("tipo").value;
    const hotel_id = document.getElementById("hotel_id").value;

    const habitacion = { numHabitacion, tipo, hotel_id };

    try {
        const respuesta = await fetch("http://localhost:8080/api/habitaciones", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(habitacion)
        });

        if (respuesta.ok) {
            alert("Habitación agregada correctamente");
        } else {
            alert("Error al agregar la habitación");
        }
    } catch (error) {
        console.error("Error al agregar la habitación:", error);
    }
});

document.getElementById("formHotel").addEventListener("submit", async (event) => {
    event.preventDefault();
    const nombre = document.getElementById("nombreHotel").value;
    const ubicacion = document.getElementById("direccionHotel").value;
    const numEstrellas = document.getElementById("estrellas").value;

    const hotel = { nombre, ubicacion, numEstrellas };

    try {
        const respuesta = await fetch("http://localhost:8080/api/hoteles", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(hotel)
        });

        if (respuesta.ok) {
            alert("Hotel agregado correctamente");
        } else {
            alert("Error al agregar el hotel");
        }
    } catch (error) {
        console.error("Error al agregar el hotel:", error);
    }
});

document.getElementById("formRecompensa").addEventListener("submit", async (event) => {
    event.preventDefault();
    const nombre = document.getElementById("nombreRecompensa").value;
    const descripcion = document.getElementById("descripcion").value;
    const precio = document.getElementById("precio").value;
    const stock = document.getElementById("stock").value;
    const recompensa = { nombre, descripcion, precio, stock };

    try {
        const respuesta = await fetch("http://localhost:8080/api/recompensas", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(recompensa)
        });

        if (respuesta.ok) {
            alert("Recompensa agregada correctamente");
        } else {
            alert("Error al agregar la recompensa");
        }
    } catch (error) {
        console.error("Error al agregar la recompensa:", error);
    }
});
