// Cargar los clientes en el desplegable
async function cargarClientes() {
    try {
        const response = await fetch('http://localhost:3000/api/cliente');

        if (!response.ok) {
            console.error('Error en la respuesta de la red:', response.status);
            throw new Error('Error en la respuesta de la red: ' + response.status);
        }

        const clientes = await response.json();
        console.log('Clientes recibidos:', clientes);

        const clienteSelect = document.getElementById('cliente');
        clienteSelect.innerHTML = '<option value="">Selecciona un cliente</option>';

        if (!Array.isArray(clientes) || clientes.length === 0) {
            console.log('No se encontraron clientes.');
            return;
        }

        window.clientes = clientes;

        clientes.forEach(cliente => {
            if (cliente.id && cliente.nombre) {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nombre;
                clienteSelect.appendChild(option);
            } else {
                console.error('Cliente con datos incompletos:', cliente);
            }
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

// Manejar el cambio en el desplegable de clientes
function cargarInformacionCliente() {
    const clienteSelect = document.getElementById('cliente');
    const clienteId = clienteSelect.value;

    if (clienteId) {
        const cliente = window.clientes.find(c => c.id == clienteId);

        if (cliente) {
            document.getElementById('email').value = cliente.email || '';
            document.getElementById('telefono').value = cliente.telefono || '';
            document.getElementById('nombre').value = cliente.nombre || '';
            document.getElementById('direccion').value = cliente.direccion || '';
            document.getElementById('ciudad').value = cliente.ciudad || '';
            document.getElementById('estado').value = cliente.estado || '';
            document.getElementById('codigo-postal').value = cliente.codigo_postal || '';
            document.getElementById('pais').value = cliente.pais || '';
        } else {
            console.error('Cliente no encontrado:', clienteId);
        }
    } else {
        document.getElementById('email').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('nombre').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('ciudad').value = '';
        document.getElementById('estado').value = '';
        document.getElementById('codigo-postal').value = '';
        document.getElementById('pais').value = '';
    }
}

// Cargar los productos en el desplegable
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:3000/api/pd');

        if (!response.ok) {
            console.error('Error en la respuesta de la red:', response.status);
            throw new Error('Error en la respuesta de la red: ' + response.status);
        }

        const productos = await response.json();
        console.log('Productos recibidos:', productos);

        const modeloSelect = document.getElementById('modelo');
        modeloSelect.innerHTML = '<option value="">Seleccione un modelo</option>';

        if (!Array.isArray(productos) || productos.length === 0) {
            console.log('No se encontraron productos.');
            return;
        }

        window.productos = productos;

        productos.forEach(producto => {
            if (producto.id && producto.nombre && producto.precio) {
                const option = document.createElement('option');
                option.value = producto.id;
                option.setAttribute('data-precio', producto.precio);
                option.textContent = producto.nombre;
                modeloSelect.appendChild(option);
            } else {
                console.error('Producto con datos incompletos:', producto);
            }
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// Manejar el cambio en el desplegable de productos
function manejarCambioProducto() {
    const modeloSelect = document.getElementById('modelo');
    const productoId = modeloSelect.value;

    if (productoId) {
        const producto = window.productos.find(p => p.id == productoId);

        if (producto) {
            document.getElementById('precio').textContent = '$' + producto.precio;
            document.getElementById('cantidad-disponible').textContent = 'Cantidad disponible: ' + producto.stock;
            actualizarTallas(producto.talla_id);
            actualizarPrecioTotal();
        } else {
            console.error('Producto no encontrado:', productoId);
        }
    } else {
        document.getElementById('precio').textContent = 'Seleccione un modelo';
        document.getElementById('cantidad-disponible').textContent = 'Cantidad disponible:';
        document.getElementById('talla').innerHTML = '<option value="">Seleccione una talla</option>';
        actualizarPrecioTotal();
    }
}

// Actualizar las tallas disponibles
function actualizarTallas(tallaId) {
    const tallaSelect = document.getElementById('talla');
    tallaSelect.innerHTML = '<option value="">Seleccione una talla</option>';

    const tallasDisponibles = [4, 5, 6, 7, 8, 9]; // Esto debería venir de tu base de datos

    tallasDisponibles.forEach(talla => {
        const option = document.createElement('option');
        option.value = talla;
        option.textContent = talla;
        tallaSelect.appendChild(option);
    });

    if (tallaId) {
        tallaSelect.value = tallaId;
    }
}

// Actualizar el precio total basado en la cantidad
function actualizarPrecioTotal() {
    const modeloSelect = document.getElementById('modelo');
    const precio = modeloSelect.options[modeloSelect.selectedIndex]?.getAttribute('data-precio');
    const cantidad = document.getElementById('cantidad').value;
    const precioTotalLabel = document.getElementById('precio-total');

    if (precio && cantidad) {
        const total = precio * cantidad;
        precioTotalLabel.textContent = '$' + total;
    } else {
        precioTotalLabel.textContent = 'Seleccione un modelo y cantidad';
    }
}

// Manejar el envío del formulario de pago
document.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Recoger los valores del formulario
    const cliente_id = document.getElementById('cliente').value;
    const nombre_tarjeta = document.getElementById('nombre-tarjeta').value;
    const numero_tarjeta = document.getElementById('numero-tarjeta').value;
    const fecha_expiracion = document.getElementById('fecha-expiracion').value;
    const cvc = document.getElementById('cvc').value;

    // Verificar que todos los campos están llenos
    if (!cliente_id || !nombre_tarjeta || !numero_tarjeta || !fecha_expiracion || !cvc) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Convertir la fecha de expiración de formato 'YYYY-MM' a 'YYYY-MM-DD'
    const [year, month] = fecha_expiracion.split('-');
    const fechaExpiracionCompleta = `${year}-${month}-01`; // Agregar el día como '01'

    // Crear el objeto de datos para enviar
    const datosPedido = {
        cliente_id,
        nombre_tarjeta,
        numero_tarjeta,
        fecha_expiracion: fechaExpiracionCompleta,
        cvc
    };

    try {
        // Enviar los datos a la API
        const response = await fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosPedido)
        });

        // Verificar la respuesta de la API
        if (!response.ok) {
            throw new Error('Error al realizar el pago: ' + response.status);
        }

        const resultado = await response.json();
        alert('Pago realizado con éxito. ID del pedido: ' + resultado.pedidoId);

        // Opcional: Limpiar el formulario después de enviar
        document.querySelector('form').reset();
    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un problema al realizar el pago. Por favor, intenta de nuevo.');
    }
});
// Cargar los clientes y productos al cargar la página
window.onload = () => {
    console.log('Cargando clientes...');
    cargarClientes();
    console.log('Cargando productos...');
    cargarProductos();

    document.getElementById('modelo').addEventListener('change', manejarCambioProducto);
    document.getElementById('cantidad').addEventListener('input', actualizarPrecioTotal);
    document.getElementById('cliente').addEventListener('change', cargarInformacionCliente);
};
