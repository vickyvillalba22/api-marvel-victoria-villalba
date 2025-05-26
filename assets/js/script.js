const ts = Date.now().toString();
const publicAPIKey = "22842b0f6ab2385f1cdd27b0fa7cdaab"
const privateAPIKey = "6daca58e155b0840390f9c99cec436d6c153f417"
const mdhash = CryptoJS.MD5(ts + privateAPIKey + publicAPIKey).toString();

//acá pongo la url base de la api
const myURL = new URL ("https://gateway.marvel.com/v1/public/characters")
//y acá le agrego los params que requiere
myURL.searchParams.append("ts", ts);
myURL.searchParams.append("apikey", publicAPIKey);
myURL.searchParams.append("hash", mdhash);
//este es opcional, muestra cuantos personajes mostrar. Podría poner un boton que diga mostrar mas para que vaya llamando a más personajes
myURL.searchParams.append("limit", 50);

fetch(myURL)
    .then(res => res.json())
    .then(data => {
        mostrar_characters(data.data.results)
        //console.log(data) //esto devuelve la respuesta sin los datos
        console.log(data.data.results) //esto accede al objeto respuesta, al objeto que tiene la data, que tiene los datos de personajes en este caso
    })
    .catch(err => {
        console.error(err);
        error(err)
    })

//CHARACTERS SECTION
const characters = document.getElementById("characters");
let cajaPersonajes = document.getElementById("cont-personajes");

function mostrar_characters(data){

    characters.classList.add("fondoGalaxia");

    characters.innerHTML = `

        <h2 class="w80 blanco mt10 df centerX">CHARACTERS</h2>

    `

    cajaPersonajes.innerHTML = ""

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

        //cuando se haga clic en la card, irá al html de detalle del personaje, y a traves de la url le pasará el id que usará cuando llame a la api y le pida info sobre ese personaje en esepcifico

        cajaPersonajes.appendChild(card)
        
    }

    characters.appendChild(cajaPersonajes)
}

function error (error){

    cajaPersonajes.innerHTML = `
    
    <p>Ups! Se ha producido un error:</p>
    <span>${error}</span>

    `
}
