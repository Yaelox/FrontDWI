document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('user-form');
    const passwordLabel = document.getElementById('password-label');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Previene el envío normal del formulario

        // Obtiene los datos del formulario
        const email = document.getElementById('correo').value;
        const newPassword = document.getElementById('new-password').value;

        // Validación básica
        if (!email || !newPassword) {
            passwordLabel.textContent = 'Por favor, complete todos los campos.';
            passwordLabel.style.color = 'red';
            return;
        }

        try {
            // Envía los datos al servidor
            const response = await fetch('http://localhost:3000/api/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    newPassword: newPassword
                })
            });

            const result = await response.json();

            if (response.ok) {
                passwordLabel.textContent = 'Contraseña actualizada con éxito.';
                passwordLabel.style.color = 'green';
                form.reset(); // Opcional: Resetea el formulario
            } else {
                passwordLabel.textContent = result.message || 'Error al actualizar la contraseña.';
                passwordLabel.style.color = 'red';
            }
        } catch (error) {
            passwordLabel.textContent = 'Error en la solicitud. Inténtelo de nuevo más tarde.';
            passwordLabel.style.color = 'red';
        }
    });
});
