document.addEventListener('DOMContentLoaded', function() {

    // Cargar los productos cuando la página se carga
    const cargarProductos = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/pd');
            if (!response.ok) {
                throw new Error('Error al cargar productos: ' + response.status);
            }
            const productos = await response.json();
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
                    option.textContent = producto.nombre;
                    option.setAttribute('data-precio', producto.precio); // Agregar el precio como atributo
                    modeloSelect.appendChild(option);
                } else {
                    console.error('Producto con datos incompletos:', producto);
                }
            });
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    };

    const manejarCambioProducto = () => {
        const modeloSelect = document.getElementById('modelo');
        const productoId = modeloSelect.value;

        if (productoId) {
            const producto = window.productos.find(p => p.id == productoId);

            if (producto) {
                document.getElementById('precio').textContent = '$' + producto.precio;
                document.getElementById('cantidad-disponible').textContent = 'Cantidad disponible: ' + producto.stock;
                actualizarPrecioTotal();
            } else {
                console.error('Producto no encontrado:', productoId);
            }
        } else {
            document.getElementById('precio').textContent = 'Seleccione un modelo';
            document.getElementById('cantidad-disponible').textContent = 'Cantidad disponible:';
            actualizarPrecioTotal();
        }
    };

    const actualizarPrecioTotal = () => {
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
    };

    document.getElementById('modelo').addEventListener('change', manejarCambioProducto);

    cargarProductos();
    document.getElementById('cantidad').addEventListener('input', actualizarPrecioTotal);
    // Obtén el botón usando su clase
    var boton = document.querySelector('.btn-comprar');
    
    // Añade un event listener para el evento 'click'
    boton.addEventListener('click', function(event) {
        // Evita que el botón realice su acción predeterminada (si es necesario)
        event.preventDefault();
        
        // Muestra una alerta
        alert('Pedido con Exito');
        
        // Recarga la página
        location.reload();
    });
});

