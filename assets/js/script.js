const ts = Date.now().toString();
const publicAPIKey = "22842b0f6ab2385f1cdd27b0fa7cdaab"
const privateAPIKey = "6daca58e155b0840390f9c99cec436d6c153f417"
const mdhash = CryptoJS.MD5(ts + privateAPIKey + publicAPIKey).toString();


//acá pongo la url base de la api
const myURL = new URL ("https://gateway.marvel.com/v1/public/characters")
//y acá le agrego los params que requiere marvel  en la url
myURL.searchParams.append("ts", ts);
myURL.searchParams.append("apikey", publicAPIKey);
myURL.searchParams.append("hash", mdhash);
//myURL.searchParams.append("limit", 20);

const myHeaders = {
    "Accept": "application/json"
}

const myRequestParams = {
    method: "GET",
    headers: myHeaders
}

let cantidadFetch = 0;

function fetchearCharacters (from, limit){

    myURL.searchParams.set("offset", from)
    myURL.searchParams.set("limit", limit)

    const requestCharacters = new Request (myURL, myRequestParams)

    console.log(requestCharacters);
    console.log("URL Final:", myURL.toString());
    

    fetch(requestCharacters)
    .then(res => {
        //verificacion de autorización http
        if (!res.ok){
            console.log(`HTTP Error":${res.status}`);  
            error(`HTTP Error":${res.status}`)
        }
        return res.json()
    })    
    .then(data => {
        //console.log(data)
        console.log(data.data.results) //esto accede al objeto respuesta, al objeto que tiene la data, que tiene los datos de personajes en este caso

        console.log(cantidadFetch);
        
        //renderiza los datos
        if (cantidadFetch==0){
            acomodarDestino()
        }

        cargarCards(data.data.results)
        cantidadFetch++
        
    })
    .catch(err => {
        console.error(err);
        error(err)
    })

}

let inicio = 0;
let limite = 20;

//cuando se carga la pagina por primera vez
fetchearCharacters(inicio, limite)
inicio+=limite;

const loadMore = document.getElementById("loadMore");

loadMore.addEventListener('click', ()=>{
    fetchearCharacters(inicio, limite)
    inicio+=limite;
})

/*const observerCharacters = new IntersectionObserver ((entries)=>{
    //como es uno solo, agarro ese del array entries
    let entry = entries[0]

    if (entry.isIntersecting){
        console.log(inicio, limite);
        
        fetchearCharacters(inicio, limite)
        inicio+=limite;
    }

})

observerCharacters.observe(sentinel)*/

//CHARACTERS SECTION
const characters = document.getElementById("characters");
let cajaPersonajes = document.getElementById("cont-personajes");

function acomodarDestino(data){

    characters.classList.add("fondoGalaxia");
    loadMore.classList.remove("invisible");

    characters.innerHTML = `

        <h2 class="w80 blanco mt10 df centerX">CHARACTERS</h2>

    `

    cajaPersonajes.innerHTML = ""

}

function cargarCards (data){

    for (let personaje of data){

        let card = document.createElement("div");
        card.setAttribute("id", data.indexOf(personaje));
        card.classList.add("cardPersonaje", "df", "columna", "spaceb")

        let claseImagen;

        if (personaje.thumbnail.path === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"){

            claseImagen = "noImage"

        } else {

            claseImagen ="objCover"

        }

        card.innerHTML = `
            <a href="detalle.html?id=${personaje.id}" target="_blank">
            <img class="w100 ${claseImagen}" src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}">
            <h4 class="blanco">${personaje.name}</h4>
            </a>

        `

        cajaPersonajes.appendChild(card)

        //index++
        
    }

characters.appendChild(cajaPersonajes)

}

function error (error){

    cajaPersonajes.innerHTML = `
    
    <div class="df w100 vh100 centerX centerY">

        <div class="df columna w100 vh20 spacee">
            <p class="p-error">Ups! Se ha producido un error:</p>
            <span class="error">${error}</span>
        </div>
        
        <img class="objCover vh40" src="assets/imgs/error.webp">

    </div>

    `
}

//ANIMACIONES

const shields = document.querySelectorAll(".shield-loader");

const shieldMove = [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
]

const shieldTime = {
    duration: 1000,
    iterations: Infinity,
    easing: "linear"
}

shields.forEach((shield)=>{
    shield.animate(shieldMove, shieldTime)
})

const planetaPrincipal = document.getElementById("planetaPrincipal");
const contPlaneta = document.getElementById("contPlanet");

const planetMove = [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
]

const planetTime = {
    duration: 100000,
    iterations: Infinity,
    easing: "linear"
}

const movInicial = planetaPrincipal.animate(planetMove, planetTime)

window.addEventListener("scroll", ()=>{

    //freno la rotacion inicial para que no se sobreescriba
    //movInicial.pause()

    const planetSize = [
    {transform: 'scale(1)'},
    {transform: 'scale(0.1)'}
    ];

    const sizeTime = {
        duration: 1,
        fill: 'forwards' //mantiene el ultimo estado
    }

    const cambioSize = contPlaneta.animate(planetSize, sizeTime);
    //aca tambien pauso esta para controlarla desde el scroll
    cambioSize.pause()

    //cantidad de px que se han scrolleado en vertical
    const scrollY = window.scrollY;
    //punto en el que el planeta debería llegar a su tamaño final
    const maxScroll = 1000;
    //calcula el progreso de la animacion: busca el minimo entre el primero y uno. siendo uno el maximo, que es la duracion de la animacion establecida más arriba
    const progress = Math.min(scrollY / maxScroll, 1)

    //con esto decidimos en que parte de la animacion queremos estar
    cambioSize.currentTime = progress
})


//EVENTOS SLIDER

const urlEvents = new URL ("https://gateway.marvel.com/v1/public/events")

urlEvents.searchParams.append("ts", ts);
urlEvents.searchParams.append("apikey", publicAPIKey);
urlEvents.searchParams.append("hash", mdhash);
urlEvents.searchParams.append("limit", 10)

const requestEvents = new Request (urlEvents, myRequestParams)

async function obtenerEventos (){

    try {
        const res = await fetch(requestEvents)

        if(!res.ok){
            console.log(`HTTP error! status: ${res.status}`);
            error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json();
        const arrayEventos = data.data.results

        activarLogicaSlider(arrayEventos)
        sliderUpdate(arrayEventos, moveDirection)

    } catch (err) {

        console.log(err);
        error(err)
        
    }
}

obtenerEventos()

const contSlider = document.getElementById("slider")

let currentSlide = 0
let moveDirection = 1000

function sliderUpdate (data, moveDirection){

    console.log(data);

    contSlider.innerHTML = `
    
        <img class="w70 bordeRedondo objCover vh60 bannerEvent" src="${data[currentSlide].thumbnail.path}/landscape_incredible.${data[currentSlide].thumbnail.extension}" alt="">

        <div class="posAb w100 df columna centerY vh30 spacee">
            <h3 class="textCenter">${data[currentSlide].title}</h3>
            <a href="detalleEvento.html?id=${data[currentSlide].id}" target="_blank"><button class="sinBorde">More info</button></a>
        </div>

    `

    //ANIMATE
    contSlider.animate([
        { opacity: 0, transform: `translateX(${moveDirection}px)` },
        { transform: 'translateX(0)' }
    ], {
        duration: 500,
        easing: 'ease-in',
        fill: 'forwards'
    });
}


const slideBack = document.getElementById("slideBack")
const slideNext = document.getElementById("slideNext")

function activarLogicaSlider(data){

    console.log(slideBack);

    slideBack.addEventListener('click', ()=>{

        //console.log(data.length);

        currentSlide--

        if (currentSlide<0) {
            currentSlide = data.length-1
        }

        moveDirection = -1000

        sliderUpdate(data, moveDirection)

    })

    slideNext.addEventListener('click', ()=>{

        currentSlide++

        if(currentSlide>data.length-1){
            currentSlide = 0
        }

        sliderUpdate(data)

        moveDirection = 1000

        sliderUpdate(data, moveDirection)

    })

}

//expandir con hover

const expand = [
    { transform: 'scale(1)' },
    { transform: 'scale(1.5)' }
]

const expandTime = {
    duration: 100,
    fill: 'forwards'
}

const small = [
    { transform: 'scale(1.5)' },
    { transform: 'scale(1)' }
]

const smallTime = {
    duration: 100,
    fill: 'forwards'
}


document.addEventListener("DOMContentLoaded", ()=>{

    const buttons = document.querySelectorAll("button")

    buttons.forEach((button)=>{
        button.addEventListener('mouseover', ()=>{
            button.animate(expand, expandTime)
        })
        button.addEventListener('mouseout', ()=>{
            button.animate(small, smallTime)
        })
    })

})

function maquina_de_escribir (elemento, texto, velocidad){

    elemento.textContent = "";

    let i=0;

    function escribir(){
        
            if (i<texto.length){

                elemento.textContent += texto.charAt(i);
                i++;
                setTimeout(escribir, velocidad);
            }
        
    }

    escribir()
    
}

const titulo = document.querySelector("h1");
const textoTitulo = titulo.textContent

maquina_de_escribir(titulo, textoTitulo, 50)

/*menu hamburguesa*/

let abrirMenu = document.getElementById("abrir-menu");
let cerrarMenu = document.getElementById("cerrar-menu");
let nav = document.getElementById("nav");

const items = document.querySelectorAll("header a li")

abrirMenu.addEventListener('click', ()=>{
    nav.classList.add("visible")

    items.forEach((item)=>{
        item.addEventListener('click', ()=>{
            nav.classList.remove("visible")
        })
    })

});

cerrarMenu.addEventListener('click', ()=>{
    nav.classList.remove("visible")
    nav.classList.add("invisible")
});



