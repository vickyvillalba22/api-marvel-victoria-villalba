//toda esta primera parte podría estar automatizada? ya la copie y peugue varias veces

const url = window.location.href
const eventURL = new URL (url)
const id = eventURL.searchParams.get("id")

console.log(id);

const ts = Date.now().toString();
const publicAPIKey = "22842b0f6ab2385f1cdd27b0fa7cdaab"
const privateAPIKey = "6daca58e155b0840390f9c99cec436d6c153f417"
const mdhash = CryptoJS.MD5(ts + privateAPIKey + publicAPIKey).toString();

//acá pongo la url base de la api
const myURL = new URL ("https://gateway.marvel.com/v1/public/events")
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

const requestEventDetails = new Request (myURL, myRequestParams)

fetch (requestEventDetails)
    .then(res => {

        return res.json();
        
    })
    .then(data => {
        //este es el evento
        console.log(data.data.results[0]);

        render_evento(data.data.results[0])
        
    })


//DOM
const sectionEvento = document.getElementById("details")

function render_evento(objEvento){

    const comics = objEvento.comics.items
        .slice(0, 5)

    const characters = objEvento.characters.items
        .slice(0, 5)

    sectionEvento.innerHTML = `

        <div class="posRel vh30 w100 df centerX centerY">

            <img class="w100 vh30 objCover posAb" src="${objEvento.thumbnail.path + '/landscape_incredible.' + objEvento.thumbnail.extension}" alt="">

            <h1 class="posAb">${objEvento.title}</h1>
        
        </div>

        
        <div class="dg padreEvento w60">

            <div class="div1">
            
                <h3>Description</h3>

                <p>${objEvento.description==null ? `There's no description available!` :`${objEvento.description}`}</p>

            </div>
        
 

            <div class="df centerY spaceb div2 columna">

                <h3>Dates</h3>
            
                <span>${objEvento.start == null ? `Unknown start date` : new Date(objEvento.start).toLocaleDateString("es-AR")}</span>

                <i class="fi fi-rr-arrow-down"></i>
            
                <span>${objEvento.end == null ? `Unknown end date` : new Date(objEvento.end).toLocaleDateString("es-AR")}</span>

            </div>
            

            <div class="div3">
                <h3>Related Comics</h3>
                <div>

                    ${comics.map(comic => `<div>
                        <h4>${comic.name}</h4>
                        </div>`).join("")}

                </div>
            </div>
            

            <div class="div4">
                <h3>Involved Characters</h3>
                <div>

                    ${characters.map(character => `<div>
                        <h4>${character.name}</h4>
                        </div>`).join("")}

                </div>
            </div>

        </div>

        

        `

}




