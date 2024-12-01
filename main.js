const API_URL = "https://storage.googleapis.com/campus-cvs/00000000000-images-lectures/pokemons.json";

class Pokemon {
    constructor(data) {
        this.name = data.name;
        this.type = data.type;
        this.weight = data.weight;
        this.moves = data.moves.map((move) => move.name);
    }

    renderCard() {
        return `
        <div class="card" data-name="${this.name}">
            <h2>${this.name}</h2>
            <p>Tipo: ${this.type.join(", ")}</p>
        </div>
        `;
    }

    renderDetails() {
        document.getElementById("pokemon-name").innerText = this.name;
        document.getElementById("pokemon-type").innerText = this.type.join(", ");
        document.getElementById("pokemon-weight").innerText = this.weight;
        document.getElementById("pokemon-moves").innerText = this.moves.join(", ");
    }
}

// Fetch Pokémon data
async function fetchPokemons() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.map((item) => new Pokemon(item));
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
        return [];
    }
}

// Render all Pokémon cards
function renderPokemons(pokemons) {
    const container = document.getElementById("pokedex-container");
    container.innerHTML = pokemons.map((pokemon) => pokemon.renderCard()).join("");
    setupCardClickListeners(pokemons);
}

// Set up search functionality
function setupSearch(pokemons) {
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredPokemons = pokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(query)
        );
        renderPokemons(filteredPokemons);
    });
}

// Set up card click listeners
function setupCardClickListeners(pokemons) {
    const cards = document.querySelectorAll(".card");
    const modal = document.getElementById("pokemon-modal");
    const closeButton = document.querySelector(".close-button");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const pokemonName = card.dataset.name;
            const selectedPokemon = pokemons.find((p) => p.name === pokemonName);
            selectedPokemon.renderDetails();
            modal.style.display = "block";
        });
    });

    closeButton.addEventListener("click", () => (modal.style.display = "none"));
    window.addEventListener("click", (event) => {
        if (event.target === modal) modal.style.display = "none";
    });
}

// Initialize Pokédex
async function initPokedex() {
    const pokemons = await fetchPokemons();
    renderPokemons(pokemons);
    setupSearch(pokemons);
}

initPokedex();
