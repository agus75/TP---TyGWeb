const pokemonContainer = document.querySelector('#principal2')

function fetchPokemon(id) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then((res) => res.json())
        .then((data) => {
            createPokemon(data);
        });
}

function fetchPokemons(number) {
    for (let i = 1; i <= number; i++) {
        fetchPokemon(i);
    }
}

function createPokemon(pokemon) {
    const card = document.createElement("div");
    card.classList.add("col-md-2");

    const spriteContainer = document.createElement("div");
    spriteContainer.classList.add("card");

    const sprite = document.createElement("img");
    sprite.classList.add("card-img-top")
    sprite.src = pokemon.sprites.front_default;

    spriteContainer.appendChild(sprite);
    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body")

    const name = document.createElement("h5");
    name.classList.add("card-title");
    name.textContent = pokemon.name;

    cardBody.appendChild(name);
    spriteContainer.appendChild(cardBody);
    card.appendChild(spriteContainer);

    pokemonContainer.appendChild(card);
}



