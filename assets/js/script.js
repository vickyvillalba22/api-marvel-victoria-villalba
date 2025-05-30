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

function fetchearCharacters (from, limit){

    myURL.searchParams.append("offset", from)
    myURL.searchParams.append("limit", limit)

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
        console.log(data)
        //renderiza los datos
        mostrar_characters(data.data.results)
        console.log(data.data.results) //esto accede al objeto respuesta, al objeto que tiene la data, que tiene los datos de personajes en este caso
    })
    .catch(err => {
        console.error(err);
        error(err)
    })

}

fetchearCharacters(0, 20)

//CHARACTERS SECTION
const characters = document.getElementById("characters");
let cajaPersonajes = document.getElementById("cont-personajes");

function mostrar_characters(data){

    characters.classList.add("fondoGalaxia");

    characters.innerHTML = `

        <h2 class="w80 blanco mt10 df centerX">CHARACTERS</h2>

    `

    cajaPersonajes.innerHTML = ""

    //let index = 0

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
