document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-product');
    const productIdField = document.getElementById('product-id');
    const nombreField = document.getElementById('nombre');
    const descripcionField = document.getElementById('descripcion');
    const precioField = document.getElementById('precio');
    const tallaIdField = document.getElementById('talla_id');
    const categoriaField = document.getElementById('categoria');
    const stockField = document.getElementById('stock');
    const productTableBody = document.querySelector('#product-list tbody');
    const cancelButton = document.getElementById('cancelar');

    const apiUrl = 'http://localhost:3000/api/pd';

    // Cargar productos al inicio
    fetchProducts();

    // Manejar envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const product = {
            nombre: nombreField.value,
            descripcion: descripcionField.value,
            precio: precioField.value,
            talla_id: tallaIdField.value,
            categoria: categoriaField.value,
            stock: stockField.value
        };

        let method = 'POST';
        let url = apiUrl;

        if (productIdField.value) {
            method = 'PUT';
            url = `${apiUrl}/${productIdField.value}`;
        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                throw new Error('Error al guardar el producto');
            }

            form.reset();
            productIdField.value = '';
            fetchProducts();
        } catch (error) {
            console.error(error);
            alert('Error al guardar el producto');
        }
    });

    // Manejar clic en el botón de "Cancelar"
    cancelButton.addEventListener('click', () => {
        form.reset();
        productIdField.value = '';
    });

    // Obtener productos
    async function fetchProducts() {
        try {
            const response = await fetch(apiUrl);
            const products = await response.json();
            renderProducts(products);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    }

    // Renderizar productos en la tabla
    function renderProducts(products) {
        productTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.nombre}</td>
                <td>${product.descripcion}</td>
                <td>${product.precio}</td>
                <td>${product.talla_id}</td>
                <td>${product.categoria}</td>
                <td>${product.stock}</td>
                <td>
                    <button onclick="editProduct(${product.id})">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Eliminar</button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    }

    // Editar producto
    window.editProduct = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            const product = await response.json();
            productIdField.value = product.id;
            nombreField.value = product.nombre;
            descripcionField.value = product.descripcion;
            precioField.value = product.precio;
            tallaIdField.value = product.talla_id;
            categoriaField.value = product.categoria;
            stockField.value = product.stock;
        } catch (error) {
            console.error('Error al obtener el producto:', error);
        }
    };

    // Eliminar producto
    window.deleteProduct = async (id) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el producto');
                }

                fetchProducts();
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
                alert('Error al eliminar el producto');
            }
        }
    };
});
