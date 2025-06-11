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
            error(`HTTP Error":${res.status}`)
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

//la velocidad es para el set time out de cada cuanto aparecerá cada letra
function maquina_de_escribir (elemento, texto, velocidad){

    //vacía al elemento, al titulo por ejemplo
    elemento.textContent = "";

    let i=0;

    //funcion recursiva para poder controlar el tiempo de escritura entre las letras
    function escribir(){
        
            if (i<texto.length){

                elemento.textContent += texto.charAt(i);
                i++;
                setTimeout(escribir, velocidad);
            }
        
    }

    //primera llamada a funcion, luego entra a la recursion. en esta primera llamada escribe la letra 0, luego antes de volverse a llamar aumenta a i
    escribir()
    
}

function render_personaje(personaje){

    if (personaje.thumbnail.path === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available"){

            claseImagen = "noImage"

        } else {

            claseImagen ="objCover"

        }

    cajaPersonaje.innerHTML = `
        
        <div id="divDetalle1" class="w50 vh100 df columna centerY spacea">

            <div class="w80">

                <div class="df centerY">
                    <h2 id="nombrePersonaje" class="vh10 df centerY mt10p">${personaje.name.toUpperCase()}</h2><h2 id="linea">|</h2>
                </div>

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

        <div id="divDetalle2" class="w50 vh100">

            <img class="w100 ${claseImagen} imgPersonaje vh30m" src="${personaje.thumbnail.path}.${personaje.thumbnail.extension}" alt="">

        </div>


    `

    const linea = document.getElementById("linea");

    const animacionLinea = linea.animate(
        [
            { opacity: 1 },
            { opacity: 0 }
        ],
        {
            duration: 1000,  
            iterations: Infinity,  
            easing: "ease-in-out"
        }
    )


    let nombrePersonaje = document.getElementById("nombrePersonaje")

    let textoOriginal = nombrePersonaje.textContent

    maquina_de_escribir(nombrePersonaje, textoOriginal, 100, animacionLinea)

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





