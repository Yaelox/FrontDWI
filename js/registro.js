document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registroForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const usuario = document.getElementById('usuario').value;
        const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
        const email = document.getElementById('email').value;
        const contraseña = document.getElementById('contraseña').value;

        const respuesta = await fetch('http://localhost:3000/api/auth/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, fecha_nacimiento, email, contraseña })
        });

        const resultado = await respuesta.json();
        if (respuesta.ok) {
            alert(resultado.mensaje); // Alerta de éxito si el registro fue exitoso
            document.getElementById('mensajeRegistro').innerText = ''; // Limpia el mensaje de registro
            window.location.reload(); // Recarga la página
        } else {
            alert('Error al registrar usuario: ' + resultado.mensaje); // Alerta de error si el registro falló
        }
    });
});