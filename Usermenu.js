$(document).ready(function() {
    $('#addSaldoButton').on('click', function() {
        $('#addSaldoModal').dialog({
            modal: true,
            buttons: {
                "Confirmar": function() {
                    const amount = parseFloat($('#saldoAmount').val());
                    if (!isNaN(amount) && amount > 0) {
                        addSaldo(amount);
                        $(this).dialog("close");
                    } else {
                        alert('Por favor, introduce una cantidad válida.');
                    }
                },
                "Cancelar": function() {
                    $(this).dialog("close");
                }
            }
        });
    });
    $('#canjearPuntosButton').on('click', function() {
        obtenerRecompensas();
    });

    function addSaldo(amount) {
        const clienteId = $('#clienteId').text();
        $.ajax({
            url: `http://localhost:8080/api/detalles/${clienteId}/${amount}`,
            method: 'PUT',
            success: function(response) {
                $('#clienteSaldo').text(response.saldo);
                alert('Has añadido ' + amount + '€ a tu cuenta');
            },
            error: function(error) {
                console.error('Error al añadir saldo:', error);
                alert('Límite de salario máximo alcanzado');
            }
        });
    }
    function obtenerRecompensas() {
        $.ajax({
            url: 'http://localhost:8080/api/recompensas',
            method: 'GET',
            success: function(recompensas) {
                mostrarRecompensas(recompensas);
            },
            error: function(error) {
                console.error('Error al obtener recompensas:', error);
            }
        });
    }

    function mostrarRecompensas(recompensas) {
        const recompensasList = $('#recompensasList');
        recompensasList.empty();

        recompensas.forEach(recompensa => {
            const item = `<li>
                <h3>${recompensa.nombre} - ${recompensa.precio} puntos</h3>
                <p>${recompensa.descripcion}</p>
                <button class="elegirRecompensaButton" data-id="${recompensa.id}" data-puntos="${recompensa.precio}">Elegir</button>
            </li>`;
            recompensasList.append(item);
        });

        $('#recompensasModal').dialog({
            modal: true,
            width: 600
        });

        $('.elegirRecompensaButton').on('click', function() {
            const recompensaId = $(this).data('id');
            const puntosRequeridos = $(this).data('puntos');
            confirmarCompra(recompensaId, puntosRequeridos);
        });
    }

    function confirmarCompra(recompensaId, puntosRequeridos) {
        const puntosActuales = parseInt($('#clientePuntos').text());
        if (puntosActuales >= puntosRequeridos) {
            $('#recompensaSeleccionada').text(`¿Deseas canjear ${puntosRequeridos} puntos por esta recompensa?`);
            $('#confirmarCompraModal').dialog({
                modal: true,
                buttons: {
                    "Confirmar": function() {
                        canjearRecompensa(recompensaId, puntosRequeridos);
                        $(this).dialog("close");
                    },
                    "Cancelar": function() {
                        $(this).dialog("close");
                    }
                }
            });
        } else {
            alert('No tienes suficientes puntos para esta recompensa.');
        }
    }

    function canjearRecompensa(recompensaId, puntosRequeridos) {
        const clienteId = $('#clienteId').text();
        $.ajax({
            url: `http://localhost:8080/api/recompensas/${recompensaId}`,
            method: 'PUT',
            success: function(response) {
                alert('Recompensa canjeada exitosamente. Te hemos enviado un correo con el código a canjear.');
                restarSaldoYpuntos(clienteId, 0, -puntosRequeridos, function() {
                    // Actualizar puntos del cliente
                    obtenerDetallesCliente(clienteId);
                    // Cerrar el modal y volver al menú del usuario
                    $('#confirmarCompraModal').dialog("close");
                    $('#recompensasModal').dialog("close");
                    // Aquí podrías añadir más lógica para volver al menú del usuario, por ejemplo:
                    // window.location.href = '/menuUsuario';
                });
            },
            error: function(error) {
                alert('Error al canjear la recompensa');
                console.error('Error al canjear la recompensa:', error);
            }
        });
    }

    $('#searchHotel').on('input', function() {
        const query = $(this).val();
        if (query.length > 0) {
            buscarHoteles(query);
        } else {
            $('#hotelList').empty();
        }
    });

    function buscarHoteles(nombre) {
        $.ajax({
            url: `http://localhost:8080/api/hoteles/${nombre}`,
            method: 'GET',
            success: function(response) {
                mostrarResultados(response);
            },
            error: function(error) {
                console.error('Error al buscar hoteles:', error);
            }
        });
    }

    function mostrarResultados(hoteles) {
        const hotelList = $('#hotelList');
        hotelList.empty();
        hoteles.forEach(hotel => {
            const hotelItem = `<li><button class="hotelButton" data-hotel="${hotel.nombre}" data-hotel-id="${hotel.idhotel}">${hotel.nombre}</button></li>`;
            hotelList.append(hotelItem);
        });

        $('.hotelButton').on('click', function() {
            const hotelNombre = $(this).data('hotel');
            const hotelId = $(this).data('hotel-id');
            $('#hotelSeleccionado').text("Has elegido " + hotelNombre);
            $('.hide').show();
            obtenerHabitaciones(hotelId);
        });
    }

    function obtenerHabitaciones(hotelId) {
        $.ajax({
            url: `http://localhost:8080/api/habitaciones/${hotelId}`,
            method: 'GET',
            success: function(response) {
                mostrarHabitaciones(response);
            },
            error: function(error) {
                console.error('Error al obtener habitaciones:', error);
            }
        });
    }

    function mostrarHabitaciones(habitaciones) {
        const habitacionesDisponibles = $('#habitacionesDisponibles');
        habitacionesDisponibles.empty();
        habitaciones.forEach(habitacion => {
            const option = `<option value="${habitacion.numHabitacion}">${habitacion.tipo}</option>`;
            habitacionesDisponibles.append(option);
        });

        habitacionesDisponibles.on('change', function() {
            const habitacionId = $(this).val();
            $('#idHabitacion').val(habitacionId);
        });
    }
});

$(function() {
    $("#fechaEntrada").datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function(dateText) {
            $('#fechaSalida').datepicker("option", "minDate", dateText);
        }
    });
    $("#fechaSalida").datepicker({
        dateFormat: 'yy-mm-dd',
        onSelect: function(dateText) {
            $('#fechaEntrada').datepicker("option", "maxDate", dateText);
        }
    });
});

function addReserva() {
    const clienteId = $('#clienteId').text();
    const fechaEntrada = $('#fechaEntrada').val();
    const fechaSalida = $('#fechaSalida').val();
    const numHabitacion = $('#idHabitacion').val();

    const reservaData = {
        idCliente: clienteId,
        fechaEntrada: fechaEntrada,
        fechaSalida: fechaSalida,
        idHabitacion: numHabitacion
    };

    // Verificar disponibilidad de la habitación
    $.ajax({
        url: 'http://localhost:8080/api/disponibilidad',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(reservaData),
        success: function(disponible) {
            if (disponible) {
                // Habitación disponible, proceder con el pago y la reserva
                $.ajax({
                    url: 'http://localhost:8080/api/precio',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(reservaData),
                    success: function(precio) {
                        // Mostrar cuadro de diálogo para confirmar el pago
                        confirmarPago(clienteId, precio, reservaData);
                    },
                    error: function(error) {
                        console.error('Error al obtener el precio:', error);
                        alert('Error al obtener el precio de la reserva.');
                    }
                });
            } else {
                // Habitación ocupada, mostrar mensaje de error
                alert('La habitación está ocupada en las fechas seleccionadas. No se puede realizar la reserva.');
            }
        },
        error: function(error) {
            console.error('Error al verificar disponibilidad:', error);
            alert('Error al verificar la disponibilidad de la habitación.');
        }
    });
}

function confirmarPago(clienteId, precio, reservaData) {
    const saldoActual = parseFloat($('#clienteSaldo').text());

    if (saldoActual < precio) {
        alert('No tienes suficiente saldo para realizar esta reserva.');
        return;
    }

    $('#confirmarPagoModal').text(`El precio de la reserva es ${precio} €. ¿Deseas confirmar la reserva?`);
    $('#confirmarPagoModal').dialog({
        modal: true,
        buttons: {
            "Confirmar": function() {
                procesarReserva(clienteId, precio, reservaData);
                $(this).dialog("close");
            },
            "Cancelar": function() {
                $(this).dialog("close");
            }
        }
    });
}

function procesarReserva(clienteId, precio, reservaData) {
    // Obtener los puntos nuevos de la reserva
    $.ajax({
        url: 'http://localhost:8080/api/puntos',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(reservaData),
        success: function(puntosNH) {
            // Restar el precio y los puntos del cliente
            restarSaldoYpuntos(clienteId, precio, puntosNH, function() {
                // Añadir la reserva
                $.ajax({
                    url: 'http://localhost:8080/api/reservas',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(reservaData),
                    success: function(response) {
                        alert('Reserva añadida exitosamente.');
                        // Actualizar detalles del cliente
                        obtenerDetallesCliente(clienteId);
                    },
                    error: function(error) {
                        console.error('Error al añadir la reserva:', error);
                        alert('Error al añadir la reserva.');
                    }
                });
            });
        },
        error: function(error) {
            console.error('Error al obtener los puntos:', error);
        }
    });
}

function restarSaldoYpuntos(clienteId, precio, puntosNH, callback) {
    // Restar saldo
    $.ajax({
        url: `http://localhost:8080/api/detalles/${clienteId}/-${precio}`,
        method: 'PUT',
        success: function(response) {
            console.log('Saldo restado exitosamente:', response.saldo);
            // Restar puntos
            $.ajax({
                url: `http://localhost:8080/api/puntos/${clienteId}/${puntosNH}`,
                method: 'PUT',
                success: function(response) {
                    console.log('Puntos restados exitosamente:', response.puntosNH);
                    callback(); // Llamada al callback después de restar los puntos
                },
                error: function(error) {
                    console.error('Error al restar puntos:', error);
                }
            });
        },
        error: function(error) {
            console.error('Error al restar saldo:', error);
        }
    });
}


async function verReservas() {
    const idCliente = $('#clienteId').text();

    try {
        const respuesta = await fetch(`http://localhost:8080/api/reservas/${idCliente}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (respuesta.ok) {
            const reservas = await respuesta.json();
            document.getElementById('reservasRealizadasTitulo').style.display = 'block';
            document.getElementById('InfoReservas').style.display = 'table';
            mostrarReservas(reservas);
        } else {
            alert("Error al obtener la información del cliente");
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
        alert("Error al realizar la solicitud");
    }
}

function mostrarReservas(reservas) {
    const tbody = $('#InfoReservas tbody');
    tbody.empty();

    reservas.forEach(reserva => {
        const fila = $(`
            <tr>
                <td class="hotelNombre"></td>
                <td>${reserva.fechaEntrada}</td>
                <td>${reserva.fechaSalida}</td>
                <td>${reserva.idHabitacion}</td>
                
            </tr>
        `);

        // Append the row first without the hotel name
        tbody.append(fila);

        // Fetch the hotel name based on the room number
        fetchHotelName(reserva.idHabitacion, fila.find('.hotelNombre'));
    });
}

function fetchHotelName(numHab, element) {
    $.ajax({
        url: `http://localhost:8080/api/busqueda/${numHab}`,
        method: 'GET',
        success: function(response) {
            element.text(response);
        },
        error: function(error) {
            console.error('Error fetching hotel name:', error);
            element.text('Unknown Hotel');
        }
    });
}

async function obtenerCliente(clienteId) {
    const respuesta = await fetch(`http://localhost:8080/api/cliente/${clienteId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (respuesta.ok) {
        const cliente = await respuesta.json();
        mostrarCliente(cliente);
    } else {
        alert("Error al obtener la información del cliente");
    }
}

function mostrarCliente(cliente) {
    let nombreCliElement = document.getElementById('nombreCli');
    nombreCliElement.textContent = cliente.name;
    let clienteTabla = document.getElementById("InfoCliente").getElementsByTagName('tbody')[0];
    clienteTabla.innerHTML = "";

    let fila = clienteTabla.insertRow();
    
    let celdaNombre = fila.insertCell(0);
    let celdaApellido = fila.insertCell(1);
    let celdaCorreo = fila.insertCell(2);
    let celdaTelefono = fila.insertCell(3);
    let celdaDireccion = fila.insertCell(4);
    let celdaDireccion2 = fila.insertCell(5);
    let celdaEstado = fila.insertCell(6);
    let celdaPais = fila.insertCell(7);
    let celdaCodigoPostal = fila.insertCell(8);
    let celdaArea = fila.insertCell(9);
    

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
}

async function obtenerDetallesCliente(clienteId) {
    
    const respuesta = await fetch(`http://localhost:8080/api/detalles/${clienteId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    if (respuesta.ok) {
        const detalles = await respuesta.json();
        mostrarDetallesCliente(detalles);
    } else {
        alert("Error al obtener los detalles del cliente");
    }
}

function mostrarDetallesCliente(detalles) {
    document.getElementById("clienteSaldo").innerHTML = detalles.saldo;
    document.getElementById("clientePuntos").innerHTML = detalles.puntosNH;
}

window.onload = async () => {
    const params = new URLSearchParams(window.location.search);
    const clienteId = params.get('clienteId');
    if (clienteId) {
        document.getElementById("clienteId").innerText = clienteId;
        await obtenerCliente(clienteId);
        await obtenerDetallesCliente(clienteId);
    } else {
        document.getElementById("clienteId").innerText = "ID no encontrado";
    }
};
