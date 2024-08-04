document.addEventListener('DOMContentLoaded', () => {
    const roleForm = document.getElementById('role-form');
    const submitButton = document.getElementById('submit-button');
    const roleIdField = document.getElementById('role-id');
    const cancelButton = document.getElementById('cancel-button');

    // Función para cargar roles
    const loadRoles = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/roles');
            if (!response.ok) {
                throw new Error('Error al cargar roles');
            }
            const data = await response.json();
            renderRoles(data);
        } catch (error) {
            console.error('Error al cargar roles:', error);
            alert('Hubo un error al cargar los roles.');
        }
    };

    // Función para renderizar roles en la tabla
    const renderRoles = (roles) => {
        const rolesTableBody = document.querySelector('#roles-table-body');
        rolesTableBody.innerHTML = '';

        roles.forEach(role => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = role.id;
            row.appendChild(idCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = role.role_name;
            row.appendChild(nameCell);

            const permissionsCell = document.createElement('td');
            permissionsCell.textContent = JSON.stringify(role.permissions);
            row.appendChild(permissionsCell);

            // Celda para las acciones
            const actionsCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar';
            editButton.addEventListener('click', () => handleEditRole(role));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => handleDeleteRole(role.id));
            actionsCell.appendChild(deleteButton);

            row.appendChild(actionsCell);
            rolesTableBody.appendChild(row);
        });
    };

    // Función para manejar la edición de un rol
    const handleEditRole = (role) => {
        roleIdField.value = role.id;
        document.getElementById('role-name').value = role.role_name;
        document.getElementById('permissions').value = JSON.stringify(role.permissions, null, 2);

        submitButton.textContent = 'Actualizar Rol';
        roleForm.removeEventListener('submit', handleAddRole);
        roleForm.addEventListener('submit', handleUpdateRole);
    };

    // Función para manejar la actualización de un rol
    const handleUpdateRole = async (event) => {
        event.preventDefault();

        const roleId = roleIdField.value;
        const roleName = document.getElementById('role-name').value;
        const permissions = JSON.parse(document.getElementById('permissions').value);

        try {
            const response = await fetch(`http://localhost:3000/api/roles/${roleId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role_name: roleName, permissions })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar rol');
            }

            await response.json();
            loadRoles();
            roleForm.reset();
            submitButton.textContent = 'Agregar Rol';
            roleForm.removeEventListener('submit', handleUpdateRole);
            roleForm.addEventListener('submit', handleAddRole);
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            alert('Hubo un error al actualizar el rol.');
        }
    };

    // Función para agregar roles
    const handleAddRole = async (event) => {
        event.preventDefault();

        const roleName = document.getElementById('role-name').value;
        const permissions = JSON.parse(document.getElementById('permissions').value);

        try {
            const response = await fetch('http://localhost:3000/api/roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role_name: roleName, permissions })
            });

            if (!response.ok) {
                throw new Error('Error al agregar rol');
            }

            await response.json();
            loadRoles();
            roleForm.reset();
        } catch (error) {
            console.error('Error al agregar rol:', error);
            alert('Hubo un error al agregar el rol.');
        }
    };

    // Función para manejar la eliminación de un rol
    const handleDeleteRole = async (roleId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/roles/${roleId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar rol');
            }

            await response.json();
            loadRoles();
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            alert('Hubo un error al eliminar el rol.');
        }
    };

    // Listener para manejar la adición de roles
    roleForm.addEventListener('submit', handleAddRole);

    // Listener para el botón de cancelar
    cancelButton.addEventListener('click', () => {
        roleForm.reset();
        submitButton.textContent = 'Agregar Rol';
        roleForm.removeEventListener('submit', handleUpdateRole);
        roleForm.addEventListener('submit', handleAddRole);
    });

    // Cargar roles al cargar la página
    loadRoles();
});
