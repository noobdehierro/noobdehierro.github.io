const resultadoTarjetas = document.querySelector('.resultado__tarjetas');
const resultado = document.querySelector('.resultado');
const spinner = document.querySelector('#spinner');
const paginacionDiv = document.querySelector('#paginacion');
const pokedex = document.querySelector('.pokedex');
const formulario = document.querySelector('#formulario');

let totalPaginas;
let iteradorSiguiente;
let offset = 0;
let url;


window.onload = () => {

    setTimeout(() => {
        spinner.style.display = "none";
        consultar();

    }, 2000);
    formulario.addEventListener("submit", validarPokemon);

    paginacionDiv.addEventListener('click', direccionPaginacion);

}

async function consultar() {


    url = `https://pokeapi.co/api/v2/pokemon?limit=9&offset=${offset}`;
    const consulta = await fetch(url);
    const respuesta = await consulta.json();

    totalPaginas = calcularPaginas(respuesta.count);
    traerPokemons(respuesta);

}
function calcularPaginas(total) {
    return parseInt(Math.ceil(total / 9));
}

function traerPokemons(pokemons) {
    // spinner.style.display = "block";

    const url = pokemons.results;
    url.forEach(element => {
        const pokemons = element.url
        // console.log(typeof element);
        traerPokemon(pokemons)
    });

}

async function traerPokemon(pokemons) {
    const consulta = await fetch(pokemons);
    const respuesta = await consulta.json()
    imprimirPokemon(respuesta);

}

function imprimirPokemon(pokemon) {

    const id = pokemon.id;
    const peso = pokemon.weight;
    const altura = pokemon.height;
    const exp = pokemon.base_experience;
    const nombre = pokemon.name;
    const imgOriginal = pokemon.sprites.front_default;
    const img = pokemon.sprites.other.dream_world.front_default;

    const tipo = pokemon.types;
    let tiposArr = [];
    for (let i = 0; i < tipo.length; i++) {
        const resultado = pokemon.types[i].type.name;
        tiposArr.push(resultado)
    }

    let tipos = tiposArr.toString();

    resultadoTarjetas.innerHTML += `
    <div class="resultado__tarjetas-tarjeta">
                        <div class="resultado__tarjetas-tarjeta-fondo">
                            <img src="${img}" alt="arte" class="resultado__tarjetas-tarjeta-sprite">
                        </div>
                        <div class="resultado__tarjetas-tarjeta-info">
                            <h1 class="nombre">${nombre}</h1>
                            <p class="id">id: <span>#${id}</span></p>
                            <p class="peso">peso: <span>${peso}00 g</span></p>
                            <p class="altura">altura: <span>${altura}0</span> cm</p>
                            <p class="experiencia">Exp.base: <span>${exp}</span> exp</p>
                            <p class="tipo">tipo: <span>${tipos}</span></p>
                            <img src="${imgOriginal}" alt="oficial" class="poke">
                        </div>
                    </div>
    `;

    if (!iteradorSiguiente) {
        crearPaginacion();
    }
}

function crearPaginacion() {
    iteradorSiguiente = paginaSiguiente(totalPaginas);
    console.log(iteradorSiguiente);
    let numero = 0;

    while (true) {
        const { value, done } = iteradorSiguiente.next();

        if (done) return;

        const botonSiguiente = document.createElement('a');
        botonSiguiente.href = "#pokedex";
        botonSiguiente.dataset.pagina = offset + numero;
        botonSiguiente.textContent = value;
        botonSiguiente.classList.add('siguiente');
        paginacionDiv.appendChild(botonSiguiente);
        numero += 9;
    }
}

function* paginaSiguiente(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function direccionPaginacion(e) {
    e.preventDefault();

    if (e.target.classList.contains('siguiente')) {
        spinner.style.display = "block";

        offset = Number(e.target.dataset.pagina);
        removeChild(resultadoTarjetas);

        setTimeout(() => {
            spinner.style.display = "none";

            consultar();
        }, 2000);
        pokedex.scrollIntoView();

    }
}

function removeChild(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild)
    }
}

function validarPokemon(e) {
    e.preventDefault();
    const busqueda = document.querySelector("#pokemon").value;
    
    if (busqueda === '') {
        mostrarAlerta('Agrega un término de búsqueda');

        return;
    }
    spinner.style.display = "block";

    setTimeout(() => {
        buscarPokemon(busqueda);

    }, 2000);
}

async function buscarPokemon(dato) {
    removeChild(resultadoTarjetas);
    const urlBusqueda=`https://pokeapi.co/api/v2/pokemon/${dato}`;
    try {
        const consultar = await fetch(urlBusqueda);
        const respuesta = await consultar.json();
        spinner.style.display = "none";

            imprimirPokemon(respuesta);

        

    } catch (e) {
        spinner.style.display = "none";

        mostrarAlerta('pokemon no existe o mal escrito, revise de nuevo');
    }

}

function mostrarAlerta(mensaje) {
    const alerta = document.querySelector(".alerta");
    if (!alerta) {
        const alerta = document.createElement('div');
        alerta.classList.add('alerta');
        alerta.innerHTML=`
        <p><strong>Error!!</strong><br>
        <span>${mensaje}</span>
        </p>
        `;
        resultado.insertBefore(alerta,spinner);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
        
    }

}