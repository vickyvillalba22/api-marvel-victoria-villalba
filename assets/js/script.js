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

    fetch(requestCharacters)
    .then(res => {
        //verificacion de autorización http
        if (!res.ok){
            console.log(`HTTP Error":${res.status}`);  
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

const sentinel = document.getElementById("sentinel");

const observerCharacters = new IntersectionObserver ((entries)=>{
    //como es uno solo, agarro ese del array entries
    let entry = entries[0]

    if (entry.isIntersecting){
        console.log(inicio, limite);
        
        fetchearCharacters(inicio, limite)
        inicio+=limite;
    }

})

observerCharacters.observe(sentinel)

//CHARACTERS SECTION
const characters = document.getElementById("characters");
let cajaPersonajes = document.getElementById("cont-personajes");

function acomodarDestino(data){

    characters.classList.add("fondoGalaxia");

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

        card.innerHTML = `
            <a href="detalle.html?id=${personaje.id}" target="_blank">
            <img class="w100 objCover" src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}">
            <h4 class="blanco">${personaje.name}</h4>
            </a>

        `

        /*card.animate([
            {opacity:0, transform: 'translateY(30px)'},
            {opacity:1, transform: 'translateY(0px)'}
        ], {
            duration: 2000,
            delay: index*100,
            easing: 'ease-out', 
            fill: 'forwards'
        })*/

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

const shield = document.getElementById("shield-loader");

const shieldMove = [
    { transform: 'rotate(0deg)' },
    { transform: 'rotate(360deg)' }
]

const shieldTime = {
    duration: 1000,
    iterations: Infinity,
    easing: "linear"
}

shield.animate(shieldMove, shieldTime)

const planetaPrincipal = document.getElementById("planetaPrincipal");

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
    movInicial.pause()

    const planetSize = [
    {transform: 'scale(1)'},
    {transform: 'scale(0.1)'}
    ];

    const sizeTime = {
        duration: 1,
        fill: 'forwards' //mantiene el ultimo estado
    }

    const cambioSize = planetaPrincipal.animate(planetSize, sizeTime);
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
urlEvents.searchParams.append("limit", 5)

const requestEvents = new Request (urlEvents, myRequestParams)

/*fetch (requestEvents)
    .then(res=>{
        if(!res.ok) throw new Error ("Error http")
        return res.json()
    })
    .then(data => {

        console.log(data.data.results);

        const arrayEventos = data.data.results

        //llamada a funcion

        return arrayEventos

    })*/

async function obtenerEventos (){

    const res = await fetch(requestEvents)
    const data = await res.json();
    const arrayEventos = data.data.results

    activarLogicaSlider(arrayEventos)
    sliderUpdate(arrayEventos)
}

obtenerEventos()

const contSlider = document.getElementById("slider")

let currentSlide = 0

function sliderUpdate (data){

    console.log(data);

    contSlider.innerHTML = `
    
        <img class="w70 bordeRedondo objCover vh60" src="${data[currentSlide].thumbnail.path}/landscape_incredible.${data[currentSlide].thumbnail.extension}" alt="">

        <div class="posAb w100 df columna centerY vh30 spacee">
            <h3>${data[currentSlide].title}</h3>
            <a href=""><button class="sinBorde">More info</button></a>
        </div>

    `
}


const slideBack = document.getElementById("slideBack")
const slideNext = document.getElementById("slideNext")

function activarLogicaSlider(data){

    console.log(slideBack);

    slideBack.addEventListener('click', ()=>{

        console.log("hola");

        currentSlide--

        if (currentSlide<0) {
            currentSlide = data.length-1
        }

        sliderUpdate(data)

    })

    slideNext.addEventListener('click', ()=>{

        currentSlide++

        if(currentSlide>=data.length-1){
            currentSlide = 0
        }

        sliderUpdate(data)

    })

}

