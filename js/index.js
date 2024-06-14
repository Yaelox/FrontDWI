document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('loginForm');
    if (formulario) {
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();
            const usuario = document.getElementById('usuario').value; // Asegúrate de que 'usuario' sea el ID correcto
            const contraseña = document.getElementById('password').value; // Asegúrate de que 'password' sea el ID correcto

            const respuesta = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, contraseña })
            });

            const resultado = await respuesta.json();
            document.getElementById('mensajeLogin').innerText = resultado.mensaje;

            // Si el inicio de sesión fue exitoso, redirigir a otra página
            if (respuesta.status === 200) {
                window.location.href = '../pages/inicio.html'; // Redirige a la página deseada
            }
        });
    }
});
