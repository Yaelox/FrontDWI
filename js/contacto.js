document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de manera tradicional

    // Captura los datos del formulario
    const formData = {
        Nombre: document.getElementById('Nombre').value,
        NombreUsuario: document.getElementById('NombreUsuario').value,
        Correo: document.getElementById('email').value,
        Mensaje: document.getElementById('message').value
    };

    // Envía los datos a la API usando fetch
    fetch('http://localhost:3000/api/contacto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        // Muestra una alerta y recarga la página si el envío fue exitoso
        alert('Contacto agregado exitosamente');
        console.log('Success:', data);
        document.getElementById('contactForm').reset(); // Limpia el formulario
        setTimeout(() => {
            window.location.reload(); // Recarga la página después de un pequeño retraso
        }, 1000); // Retraso de 1 segundo para asegurarse de que el formulario se limpie
    })
    .catch((error) => {
        // Muestra una alerta en caso de error
        alert('Error al agregar contacto');
        console.error('Error:', error);
    });
});
