function mostrarPokemon() {
    document.getElementById("principal2").innerHTML=""
    fetchPokemons(3);
}

function limpiar() {
    document.getElementById("principal2").innerHTML=""
}

function mostrarPersonajes() {
    document.getElementById("principal2").innerHTML=""
    fetchIteracion(3);
}
