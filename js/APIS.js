document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('user-form');
    const submitButton = document.getElementById('submit-button');
    const userIdField = document.getElementById('user-id');
    const cancelButton = document.getElementById('cancel-button');

    const loadUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users');
            if (!response.ok) {
                throw new Error('Error al cargar usuarios');
            }
            const data = await response.json();
            renderUsers(data);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            alert('Hubo un error al cargar los usuarios.');
        }
    };

    const renderUsers = (users) => {
        const userTableBody = document.querySelector('#user-table-body tbody');
        userTableBody.innerHTML = '';

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

            const roleCell = document.createElement('td');
            roleCell.textContent = user.role_name;
            row.appendChild(roleCell);

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

    const handleEditUser = (user) => {
        userIdField.value = user.ID_Usuario;
        document.getElementById('usuario').value = user.usuario;
        document.getElementById('fecha_nacimiento').value = user.fecha_nacimiento;
        document.getElementById('email').value = user.email;
        const rolSelect = document.getElementById('rol');
        rolSelect.value = user.role_id;
        document.getElementById('password').disabled = true;
        submitButton.textContent = 'Actualizar Usuario';
        userForm.removeEventListener('submit', handleAddUser);
        userForm.addEventListener('submit', handleUpdateUser);
    };

    const handleUpdateUser = async (event) => {
        event.preventDefault();

        const userId = document.getElementById('user-id').value;
        const usuario = document.getElementById('usuario').value;
        const fecha_nacimiento = new Date(document.getElementById('fecha_nacimiento').value).toISOString().slice(0, 10);
        const email = document.getElementById('email').value;
        const rol = document.getElementById('rol').value;

        try {
            const response = await fetch(`http://localhost:3000/api/crud/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, fecha_nacimiento, email, rol })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error desconocido');
            }

            const data = await response.json();
            console.log('Response data:', data);
            alert(data.mensaje);
            loadUsers();
            userForm.reset();
            submitButton.textContent = 'Agregar Usuario';
            userForm.removeEventListener('submit', handleUpdateUser);
            userForm.addEventListener('submit', handleAddUser);
            document.getElementById('password').disabled = false;
        } catch (error) {
            console.error('Error al actualizar usuario:', error.message);
            alert('Hubo un error al actualizar el usuario.');
            document.getElementById('password').disabled = false;
        }
    };

    const handleAddUser = async (event) => {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
        const email = document.getElementById('email').value;
        const contraseña = document.getElementById('password').value;
        const role_id = document.getElementById('rol').value;

        console.log('Datos del usuario:', { usuario, fecha_nacimiento, email, contraseña, role_id });

        try {
            const response = await fetch('http://localhost:3000/api/crud/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usuario, fecha_nacimiento, email, contraseña, role_id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error desconocido');
            }

            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            alert(data.mensaje);
            userForm.reset();
            loadUsers();
        } catch (error) {
            console.error('Error al agregar usuario:', error.message);
            alert('Hubo un error al agregar el usuario.');
        }
    };

    userForm.addEventListener('submit', handleAddUser);

    const handleCancelEdit = () => {
        userForm.reset();
        submitButton.textContent = 'Agregar Usuario';
        userForm.removeEventListener('submit', handleUpdateUser);
        userForm.addEventListener('submit', handleAddUser);
        document.getElementById('password').disabled = false;
        userIdField.value = '';
    };

    cancelButton.addEventListener('click', handleCancelEdit);

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/crud/usuarios/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error desconocido');
            }
            const data = await response.json();
            alert(data.mensaje);
            loadUsers();
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
            alert('Hubo un error al eliminar el usuario.');
        }
    };

    loadUsers();
});
