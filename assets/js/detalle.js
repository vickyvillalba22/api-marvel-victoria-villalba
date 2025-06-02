//obtener el id del perosnaje en la url
const url = window.location.href
const detalleURL = new URL (url)
const id = detalleURL.searchParams.get("id")

console.log(id);

const ts = Date.now().toString();
const publicAPIKey = "22842b0f6ab2385f1cdd27b0fa7cdaab"
const privateAPIKey = "6daca58e155b0840390f9c99cec436d6c153f417"
const mdhash = CryptoJS.MD5(ts + privateAPIKey + publicAPIKey).toString();

//acá pongo la url base de la api
const myURL = new URL ("https://gateway.marvel.com/v1/public/characters")
//y acá le agrego los params que requiere
myURL.searchParams.append("id", id);
myURL.searchParams.append("ts", ts);
myURL.searchParams.append("apikey", publicAPIKey);
myURL.searchParams.append("hash", mdhash);

const myHeaders = {
    "Accept": "application/json"
}

const myRequestParams = {
    method: "GET",
    headers: myHeaders
}

const requestDetails = new Request (myURL, myRequestParams)

fetch(requestDetails)
    .then(res => {
        if(!res.ok){
            console.log(`HTTP Error":${res.status}`); 
        }
        return res.json()
    }
    )
    .then(data => {
        console.log(data) //esto devuelve la respuesta completa
        //console.log(data.data) //esto accede al objeto respuesta, al objeto que tiene la data, que tiene los datos de personajes en este caso, con los parametros
        //console.log(data.data.results); //tiene un array con todos los personajes que le hayamos pedido (array de objetos)
        console.log(data.data.results[0]); //accede directamente al objeto propio del personaje

        const character = data.data.results[0]
        render_personaje(character) 
    })
    .catch(err => {
        console.error(err);
        error(err)
    })


//DOM

const cajaPersonaje = document.getElementById("personaje-info");

function render_personaje(personaje){

    cajaPersonaje.innerHTML = `
        
        <div class="w50 vh100 df columna centerY spacea">

            <div class="w80">

                <h2 class="vh10 df centerY">${personaje.name.toUpperCase()}</h2>

                <p>${personaje.description}</p>

            </div>

            <div class="w80">

                <h3 class="mt10p">Comics</h3>
                <ul class="mt10p sinItem df slider">${personaje.comics.available === 0 ? `<p>This character has not been part of Marvel comics</p>` : personaje.comics.items.map(comic => `<li class="cardcita">${comic.name}</li>`).join("")}</ul>
                
            </div>

            
            <div class="w80">

                <h3 class="mt10p">Series</h3>
                <ul class="mt10p sinItem df slider">${personaje.series.available === 0 ? `<p>This character has not been part of Marvel series</p>` : personaje.series.items.map(serie => `<li class="cardcita">${serie.name}</li>`).join("")}</ul>
                
            </div>

            
            <div class="w80">

                <h3 class="mt10p">Stories</h3>
                <ul class="mt10p sinItem df slider">${personaje.comics.available === 0 ? `<p>This character has not been part of Marvel stories</p>` : personaje.stories.items.map(storie => `<li class="cardcita">${storie.name}</li>`).join("")}</ul>
                
            </div>

            <div class="w80">
            
                <h3 class="mt10p">Events</h3>
                <ul class="mt10p sinItem df slider">${personaje.events.available === 0 ? `<p>This character has not been part of Marvel special events</p>` : personaje.events.items.map(event => `<li class="cardcita">${event.name}</li>`).join("")}</ul>

            </div>
            
        </div>

        <div class="w50 vh100">

            <img class="w100 vh100 objCover" src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}" alt="">

        </div>


    `

}

//ERROR
function error (error){

    cajaPersonaje.innerHTML = `
    
    <div class="df w100 vh100 centerX centerY">

        <div class="df columna w20 vh30 spacee">
            <p class="p-error">Oops! An error has occurred:</p>
            <span class="error resaltado">${error}</span>
            <a href="index.html"><button class="sinBorde">Return home</button></a>
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



