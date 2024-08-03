document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const submitButton = document.getElementById('submit-button');
    const userIdField = document.getElementById('user-id');
    const cancelButton = document.getElementById('cancel-button');

    // Función para cargar usuarios
    const loadUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }
            const data = await response.json();
            renderUsers(data); // Función para renderizar los usuarios en la tabla
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Hubo un error al cargar los usuarios.');
        }
    };

    // Función para renderizar usuarios en la tabla
    const renderUsers = (users) => {
        const userTableBody = document.querySelector('#user-table-body tbody');
        userTableBody.innerHTML = ''; // Limpiar contenido anterior de la tabla

        users.forEach(user => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = user.ID_Usuario;
            row.appendChild(idCell);

            const userCell = document.createElement('td');
            userCell.textContent = user.usuario;
            row.appendChild(userCell);

            const birthDateCell = document.createElement('td');
            birthDateCell.textContent = user.fecha_nacimiento;
            row.appendChild(birthDateCell);

            const emailCell = document.createElement('td');
            emailCell.textContent = user.email;
            row.appendChild(emailCell);

            // Celula para el rol
            const roleCell = document.createElement('td');
            roleCell.textContent = user.role_name; // Suponiendo que `role_name` es el nombre del rol obtenido del backend
            row.appendChild(roleCell);

            // Botones de acciones (Editar y Eliminar)
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', () => handleEditUser(user));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', () => handleDeleteUser(user.ID_Usuario));
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);

            userTableBody.appendChild(row);
        });
    };

    // Función para manejar la edición de un usuario
    const handleEditUser = (user) => {
        // Llenar el formulario con los datos del usuario seleccionado
        userIdField.value = user.ID_Usuario;
        document.getElementById('usuario').value = user.usuario;
        document.getElementById('fecha_nacimiento').value = user.fecha_nacimiento;
        document.getElementById('email').value = user.email;

        // Seleccionar el rol del usuario en el formulario de edición
        const rolSelect = document.getElementById('rol');
        rolSelect.value = user.role_id; // Asumiendo que user.role_id es el ID del rol del usuario

        // Bloquear el campo de contraseña
        document.getElementById('password').disabled = true;

        // Cambiar texto y funcionalidad del botón de submit
        submitButton.textContent = 'Actualizar Usuario';
        userForm.removeEventListener('submit', handleAddUser); // Remover el listener anterior
        userForm.addEventListener('submit', handleUpdateUser); // Agregar el listener para actualizar usuario
    };

    // Función para manejar la actualización de un usuario
    const handleUpdateUser = async (event) => {
        event.preventDefault();

        const userId = userIdField.value;
        const usuario = document.getElementById('usuario').value;
        const fecha_nacimiento = new Date(document.getElementById('fecha_nacimiento').value).toISOString().slice(0, 10); // Formato YYYY-MM-DD
        const email = document.getElementById('email').value;
        const rol = document.getElementById('rol').value; // Obtener el valor del rol seleccionado

        try {
            const response = await fetch(`http://localhost:3000/api/crud/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, fecha_nacimiento, email, rol }) // Incluir el rol en el body
            });

            if (!response.ok) {
                throw new Error('Error al actualizar usuario');
            }

            const data = await response.json();
            alert(data.mensaje); // Muestra el mensaje de éxito o error

            // Recargar la página para reflejar los cambios
            loadUsers();

            // Limpiar el formulario después de actualizar el usuario
            userForm.reset();

            // Restaurar texto del botón
            submitButton.textContent = 'Agregar Usuario';

            // Remover el listener para actualizar usuario y agregar el de agregar usuario nuevamente
            userForm.removeEventListener('submit', handleUpdateUser);
            userForm.addEventListener('submit', handleAddUser);

            // Desbloquear el campo de contraseña para futuras operaciones
            document.getElementById('password').disabled = false;

        } catch (error) {
            console.error('Error al actualizar usuario:', error.message);
            alert('Hubo un error al actualizar el usuario.');

            // Desbloquear el campo de contraseña en caso de error
            document.getElementById('password').disabled = false;
        }
    };

 // Función para agregar usuarios
const handleAddUser = async (event) => {
    event.preventDefault();

    // Obtener los valores del formulario
    const usuario = document.getElementById('usuario').value;
    const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('password').value;
    const role_id = document.getElementById('rol').value; // Convertir a número

    console.log('Datos del usuario:', { usuario, fecha_nacimiento, email, contraseña, role_id });

    try {
        const response = await fetch('http://localhost:3000/api/crud/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, fecha_nacimiento, email, contraseña, role_id })
        });

        // Verifica si la respuesta es correcta
        if (!response.ok) {
            // Leer el contenido del error si está disponible
            const errorData = await response.json();
            throw new Error(errorData.mensaje || 'Error desconocido');
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
        alert(data.mensaje); // Muestra el mensaje de éxito

        // Limpiar el formulario después de agregar el usuario
        document.getElementById('user-form').reset();
        // Recargar la página
        location.reload();
    } catch (error) {
        console.error('Error al agregar usuario:', error.message);
        alert('Hubo un error al agregar el usuario.');
    }
};

document.getElementById('user-form').addEventListener('submit', handleAddUser);

// Agrega el botón para cancelar la agregación
document.getElementById('cancel-button');
cancelButton.addEventListener('click', () => {
    document.getElementById('user-form').reset();
    // Puedes agregar más acciones aquí si es necesario
});



    // Función para manejar la eliminación de un usuario
    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/crud/usuarios/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar usuario');
            }
            const data = await response.json();
            alert(data.mensaje);
            loadUsers(); // Recargar usuarios después de eliminar
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
            alert('Hubo un error al eliminar el usuario.');
        }
    };

    // Listener para manejar la adición de usuarios
    userForm.addEventListener('submit', handleAddUser);

    // Función para manejar la cancelación de la edición/creación de usuarios
    const handleCancelEdit = () => {
        // Limpiar el formulario
        userForm.reset();

        // Restaurar el texto y funcionalidad del botón de submit
        submitButton.textContent = 'Agregar Usuario';
        userForm.removeEventListener('submit', handleUpdateUser);
        userForm.addEventListener('submit', handleAddUser);

        // Desbloquear el campo de contraseña
        document.getElementById('password').disabled = false;

        // Limpiar el campo oculto de ID de usuario
        userIdField.value = '';
    };

    // Listener para el botón de cancelar
    cancelButton.addEventListener('click', handleCancelEdit);

    // Cargar usuarios al cargar la página
    loadUsers();
});
