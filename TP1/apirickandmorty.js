const personajeContainer = document.querySelector('#principal2')

function fetchRickandMorty(id) {
    fetch(`https://rickandmortyapi.com/api/character/${id}/`)
    .then((res) => res.json())
    .then((data) => {
        createPersonaje(data);
    });
}

function fetchIteracion(number) {
    for (let i = 1; i <=number; i++) {
        fetchRickandMorty(i);
    }
}

function createPersonaje(personaje) {
    const card= document.createElement("div");
    card.classList.add("col-md-3");

    const spriteContainer = document.createElement("div");
    spriteContainer.classList.add("card");

    const imagen= document.createElement("img");
    imagen.classList.add("card-img-top")
    imagen.src = `https://rickandmortyapi.com/api/character/avatar/${personaje.id}.jpeg`; 

    spriteContainer.appendChild(imagen);
    const cardBody = document.createElement("div")
    cardBody.classList.add("card-body")

    const name = document.createElement("h5");
    name.classList.add("card-title");
    name.textContent = personaje.name;

    cardBody.appendChild(name);
    card.appendChild(spriteContainer);
    spriteContainer.appendChild(cardBody);

    personajeContainer.appendChild(card);
}

