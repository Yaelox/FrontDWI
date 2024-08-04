// Cargar los productos en el desplegable
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:3000/api/pd');

        // Verificar que la respuesta sea exitosa
        if (!response.ok) {
            console.error('Error en la respuesta de la red:', response.status);
            throw new Error('Error en la respuesta de la red: ' + response.status);
        }

        const productos = await response.json();
        console.log('Productos recibidos:', productos); // Verificar los datos recibidos

        const modeloSelect = document.getElementById('modelo');
        
        // Limpiar el desplegable antes de agregar opciones
        modeloSelect.innerHTML = '<option value="">Seleccione un modelo</option>';

        // Asegurarse de que la respuesta contiene productos
        if (!Array.isArray(productos) || productos.length === 0) {
            console.log('No se encontraron productos.');
            return;
        }

        // Guardar los productos en una variable global para poder acceder a ellos después
        window.productos = productos;

        productos.forEach(producto => {
            if (producto.id && producto.nombre && producto.precio) { // Verificar campos necesarios
                const option = document.createElement('option');
                option.value = producto.id;
                option.setAttribute('data-precio', producto.precio);
                option.textContent = producto.nombre; // Solo mostrar el nombre
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
        // Limpiar los campos si no se selecciona ningún producto
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

    // Suponiendo que tienes una lista de tallas disponibles por producto
    const tallasDisponibles = [4, 5, 6, 7, 8, 9]; // Esto debería venir de tu base de datos

    tallasDisponibles.forEach(talla => {
        const option = document.createElement('option');
        option.value = talla;
        option.textContent = talla;
        tallaSelect.appendChild(option);
    });

    // Seleccionar la talla del producto si existe
    if (tallaId) {
        tallaSelect.value = tallaId;
    }
}

// Actualizar el precio total basado en la cantidad
function actualizarPrecioTotal() {
    const precio = document.getElementById('modelo').options[document.getElementById('modelo').selectedIndex].getAttribute('data-precio');
    const cantidad = document.getElementById('cantidad').value;
    const precioTotalLabel = document.getElementById('precio-total');

    if (precio && cantidad) {
        const total = precio * cantidad;
        precioTotalLabel.textContent = '$' + total;
    } else {
        precioTotalLabel.textContent = 'Seleccione un modelo y cantidad';
    }
}

// Cargar los productos al cargar la página
window.onload = () => {
    console.log('Cargando productos...');
    cargarProductos();

    // Agregar evento de cambio al desplegable de productos
    document.getElementById('modelo').addEventListener('change', manejarCambioProducto);
    document.getElementById('cantidad').addEventListener('input', actualizarPrecioTotal);
};
