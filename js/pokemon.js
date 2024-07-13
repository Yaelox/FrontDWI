async function getPokemon() {
    const pokemonId = document.getElementById('pokemonId').value.toLowerCase();
    try {
        const response = await fetch(`http://localhost:3000/api/pokemon/${pokemonId}`);
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }
        const data = await response.json(); // Aquí está el objeto de datos devuelto por la API

        // Verificar si la respuesta contiene datos válidos
        if (!data || !data.pokemon) {
            throw new Error('Pokemon not found');
        }

        displayPokemonData(data); // Mostrar los datos del Pokémon
    } catch (error) {
        console.error('Error fetching Pokemon data:', error.message);
        alert('Pokemon not found. Please try again.');
    }
}

function displayPokemonData(data) {
    const pokemonData = data.pokemon;
    const evolutions = data.evolutions;
    const tableBody = document.getElementById('pokemonData');
    tableBody.innerHTML = ''; // Limpiar contenido anterior

    // Crear una fila para el Pokémon principal
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${pokemonData.name}</td>
        <td>${pokemonData.abilities.map(a => a.ability.name).join(', ')}</td>
        <td>${pokemonData.weight}</td>
        <td>${pokemonData.height}</td>
        <td>${pokemonData.types.map(t => t.type.name).join(', ')}</td>
        <td><img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}"></td>
    `;
    tableBody.appendChild(row);

    // Agregar evoluciones si existen
    if (evolutions.length > 0) {
        evolutions.forEach(evolution => {
            const evolutionRow = document.createElement('tr');
            evolutionRow.innerHTML = `
                <td>${evolution.species.name}</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td><img src="${evolution.sprites.front_default}" alt="${evolution.species.name}"></td>
            `;
            tableBody.appendChild(evolutionRow);
        });
    }
}
