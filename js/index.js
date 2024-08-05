document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('loginForm');
    if (formulario) {
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const usuario = document.getElementById('usuario').value;
            const contraseña = document.getElementById('password').value;
            const mensajeLogin = document.getElementById('mensajeLogin');
            
            if (!usuario || !contraseña) {
                mensajeLogin.innerText = 'Por favor, complete todos los campos.';
                return;
            }

            try {
                const respuesta = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ usuario, contraseña })
                });

                const resultado = await respuesta.json();
                console.log('Respuesta del servidor:', resultado); // Imprime el resultado para depuración
                mensajeLogin.innerText = resultado.mensaje;

                if (respuesta.status === 200) {
                    setTimeout(() => {
                        window.location.href = '../pages/inicio.html'; // Redirige a la página deseada
                    }, 1000); // Ajusta el tiempo si es necesario
                }
            } catch (error) {
                console.error('Error al enviar solicitud:', error);
                mensajeLogin.innerText = 'Error al enviar la solicitud. Inténtelo de nuevo.';
            }
        });
    }
});
