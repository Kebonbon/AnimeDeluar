let numeroPagina = 0;
let tempDiv;
let allDivs;
let allDivsStringa;
let posters;
let links = [];

let episodioScelto;

menuStart()

function sistemaLink(){

    document.querySelectorAll('.inner').forEach(anchor => {
      // Get the current href value

      anchora = anchor.querySelector('a')
      let currentHref = anchora.getAttribute('href');
      
      anchor.setAttribute('onclick', `videoPlayer('${'https://www.animeworld.so' + currentHref}', ${anchor.querySelector('.ep').textContent.slice(3)})`);
      anchor.removeAttribute('href');

      anchor.querySelectorAll('a').forEach(link => {link.removeAttribute('href')});
      
    });

}

//npm install node-fetch@latest


function menuStart() {
  localStorage.setItem('scrapeUrl', 'https://www.animeworld.so');
  localStorage.setItem('querySelector', '.widget-body');

  const scrapeUrl = localStorage.getItem('scrapeUrl');
  const querySelector = localStorage.getItem('querySelector');

  fetch(`http://192.168.1.39:5000/scrape?url=${encodeURIComponent(scrapeUrl)}&selector=${encodeURIComponent(querySelector)}`)
  .then(response => {console.log(response) 
    return response})
  .then(data => {

    
    data.json().then( data => {
      
      console.log(data)
      if (data.error) {
        console.error(data.error);
        document.getElementById('lista_anime').innerHTML = "Error: " + data.error;
        return;
      }
  
      tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.content || "";
  
      if (!tempDiv.children.length) {
        console.error("No content found in the response");
        return;
      }
  
      posters = tempDiv.querySelectorAll('.poster');
  
      if (posters.length === 0) {
        console.error("No posters found in the scraped content");
        document.getElementById('lista_anime').innerHTML = "No posters found.";
        return;
      }
  
      posters.forEach(element => {
        links.push('https://www.animeworld.so' + element.getAttribute('href'));
      });
  
      allDivs = tempDiv.querySelectorAll('.page');
  
      if (allDivs.length > 0) {
        document.getElementById('lista_anime').innerHTML = allDivs[numeroPagina].querySelector('.film-list').innerHTML;
      } else {
        console.error("No pages found in the scraped content");
        document.getElementById('lista_anime').innerHTML = "No anime found.";
        return;
      }
  
      document.querySelectorAll('.inner').forEach(element => {
        element.setAttribute('tabindex', 0);
        element.setAttribute('onclick', `videoPlayer(${element.getAttribute('onclick')})`);
      });
  
      sistemaLink();
    })
    .catch(error => {
      console.error('Error:', error);
    });


    })
}

function menu(){

  bottoni = [];
  document.getElementById('resto').style.opacity = 0;

  setTimeout(()=>{  
    document.getElementById('lista_anime').style.opacity = 1;

    document.getElementById('resto').innerHTML = `            
            <div id="contenutigrandi">
                <div id="sezioni"></div>
                <div id="videoz"></div>
            </div>
            <div id="pulsanti"></div>
            `

    document.getElementById('resto').style = `    
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;

    width: 0vw;
    height: 0vh;

    opacity: 0;
    transition: all 500ms ease-in-out;
    `
    document.getElementById('pulsanti').style = ``
  }, 500);
  
  document.getElementById('lista_anime').innerHTML = allDivs[numeroPagina].querySelector('.film-list').innerHTML;

  document.querySelectorAll('.inner').forEach(element => {
    element.setAttribute('tabindex', 0)
    element.setAttribute('onclick', `videoPlayer(${element.getAttribute('onclick')})`)
  })
  sistemaLink()
}

function aggiornaCounter(){
  document.getElementById('counter').innerHTML = `Pagina ${numeroPagina+1}/3`
}

function avanti(){
  if(numeroPagina <2){
    numeroPagina +=1
    menu()
    aggiornaCounter()
  }else{
    numeroPagina = 0
    menu()
    aggiornaCounter()
  }
}

function indietro(){
  if(numeroPagina >0){
    numeroPagina -=1
    menu()
    aggiornaCounter()
  }else{
    numeroPagina = 2
    menu()
    aggiornaCounter()
  }
}

let bottoni = [];
function videoPlayer(link, numEpisodio) {
  episodioScelto = numEpisodio;

  document.getElementById('resto').style = `    
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;

  width: 100vw;
  height: 100vh;

  opacity: 0;
  transition: all 500ms ease-in-out;
  `

  document.getElementById('pulsanti').style = `
    margin-top: 20px;
    display: grid;
    grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    padding: 15px;

    gap: 20px;
    border: solid;
    background-color: #fa1d37;
    border-radius: 20px;

    width: 80vw;
    height: 20vh;

    row-gap: 2px;

    margin-left: 400px;
    margin-right: 400px;
  `

  document.getElementById('lista_anime').style.opacity = 0;

  setTimeout(()=>{  
    document.getElementById('lista_anime').innerHTML = ''
    document.getElementById('resto').style.opacity = 1;
  }, 500);

  document.getElementById('anime').style.height = 0;
  

  localStorage.setItem('lista_anime', document.getElementById('lista_anime').innerHTML)

  localStorage.setItem('scrapeUrl', link);
  localStorage.setItem('querySelector', '#body');
  
  const scrapeUrl = localStorage.getItem('scrapeUrl');
  const querySelector = localStorage.getItem('querySelector');
  
  fetch(`http://192.168.1.39:5000/scrape?url=${encodeURIComponent(scrapeUrl)}&selector=${encodeURIComponent(querySelector)}`)
  .then(response => response.json())
  .then(data => {
    
    
    // Create a temporary div to parse the HTML response
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.content;
        
    const downloadHref = tempDiv.querySelector('#alternativeDownloadLink').getAttribute('href');
        
    // You can now use downloadHref for further actions, e.g., redirecting the user
    localStorage.setItem('videoSrc', downloadHref);
    
    
    
    document.querySelector("#videoz").innerHTML = `
    <video id="video-player" preload="metadata" controls="">
    <source id="video-source" src="${downloadHref}" type="video/mp4">
    </video>
    `

      let contatoreEP = 0;
      let quantitaEpisodiSezione = 50;
      let primoEpisodio;
      let nuovaSezione = false;
      let sezioneGiusta = false;

      const fragment = document.createDocumentFragment(); // Create a document fragment

      const episodi = tempDiv.querySelector("div.server.hidden").querySelectorAll(".episode")

      episodi.forEach(
        element => {
          
          const anchor = element.querySelector('a'); // Store the anchor element once
          
          if (contatoreEP == 0 || nuovaSezione){
            primoEpisodio = parseFloat(anchor.textContent);
            nuovaSezione = false
          }

          contatoreEP += 1;


          const link_bottone = 'https://www.animeworld.so' + anchor.getAttribute('href');
          
          anchor.setAttribute('onclick', `cambiaVideo('${link_bottone}', '${anchor.textContent}')`);
          anchor.setAttribute('href', '#');
          anchor.setAttribute('id', `${anchor.textContent}`);

          if (anchor.textContent == episodioScelto){
            anchor.classList.add("selected");
          }

          fragment.appendChild(anchor); // Add to the document fragment
          bottoni.push(anchor);

          if(anchor.textContent == numEpisodio){
            sezioneGiusta = true;
          }

          if(contatoreEP%quantitaEpisodiSezione == 0){
            ultimoEpisodio = parseFloat(anchor.textContent)

            document.getElementById("sezioni").innerHTML += `
            <button class="sezione" onclick="cambiaSezioni('${primoEpisodio}', '${ultimoEpisodio}')">${primoEpisodio} - ${ultimoEpisodio}</button>
            `

            nuovaSezione = true;

            if(sezioneGiusta && numEpisodio >= primoEpisodio && numEpisodio <= ultimoEpisodio){
              sezioneGiusta = false;
              cambiaSezioni(primoEpisodio, ultimoEpisodio);
            }
          }

          if(contatoreEP == episodi.length && contatoreEP%quantitaEpisodiSezione != 0 && contatoreEP > 50){
            ultimoEpisodio = parseFloat(anchor.textContent)

            document.getElementById("sezioni").innerHTML += `
            <button class="sezione" onclick="cambiaSezioni('${primoEpisodio}', '${ultimoEpisodio}')">${primoEpisodio} - ${ultimoEpisodio}</button>
            `

            if(sezioneGiusta && numEpisodio >= primoEpisodio && numEpisodio <= ultimoEpisodio){
              sezioneGiusta = false;
              cambiaSezioni(primoEpisodio, ultimoEpisodio);
            }
          }
        });

        if(episodi.length <= 50){
          document.getElementById("sezioni").style = `display: none;`
          document.querySelector("#pulsanti").appendChild(fragment);
        }
    });
  }

function cambiaSezioni(primoEpisodio, ultimoEpisodio){
  console.log(bottoni);
  
  document.querySelector("#pulsanti").innerHTML = ''; // Clear previous content

  bottoni.slice(primoEpisodio-1, ultimoEpisodio).forEach(element => {

    if(element.textContent == episodioScelto){
      element.classList.add("selected");
    }else{
      try{
        element.classList.remove("selected");
      }
      catch(err){
      }
    }

    const htmlString = element.outerHTML || element; // Convert DOM element to string if necessary
    document.querySelector("#pulsanti").innerHTML += htmlString;

  });
}


function cambiaVideo(link_bottone, numEpisodio){
  episodioScelto = numEpisodio;
  console.log(episodioScelto);
  
  try {
    document.querySelectorAll(".selected").forEach(element => element.classList.remove("selected"));
  }
  catch(err) {    
  }
  
  document.getElementById(`${numEpisodio}`).setAttribute("class","selected");
  
  fetch(`http://192.168.1.39:5000/scrape?url=${encodeURIComponent(link_bottone)}&selector=${encodeURIComponent('#body')}`)
  .then(response => response.json())
  .then(data => {

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.content;



    let downloadHref = tempDiv.querySelector('#alternativeDownloadLink').getAttribute('href');

    document.querySelector("#videoz").innerHTML = `
    <video id="video-player" preload="metadata" controls="">
    <source id="video-source" src="${downloadHref}" type="video/mp4">
    </video>
    `

    
  })  
}



function fullscreen() {
  const videoPlayer = document.getElementById('video-player');
  videoPlayer.webkitRequestFullscreen();  
}

function removeFullscreen() {
  document.exitFullscreen();
}

function playVideo(){
  const videoPlayer = document.getElementById('video-player');
  if (videoPlayer !== null) {
  videoPlayer.play();
  }
}

let fullscreenMode = false;

//Ascolta tastiera
document.addEventListener("keydown", (event) => {
  const keyName = event.key;
  const keyCode = event.keyCode;

  if (keyName) {
    console.log("Hai premuto", keyName);

    // HOME
    if (keyName === "MediaStop" || keyName === "m") {
      menu();
    }

    // FULLSCREEN
    else if (keyName === "MediaRecord" || keyName === "f") {
      if (!fullscreenMode) {
        fullscreen();
      } else {
        removeFullscreen();
      }
      fullscreenMode = !fullscreenMode;
    }

    // AVANTI
    else if (keyName === "MediaFastForward" || keyName === "a") {
      avanti();
    }

    // INDIETRO
    else if (keyName === "MediaRewind" || keyName === "i") {
      indietro();
    }    

    // CLICK SIMULATION ON SELECTED
    else if (keyName == "ColorF3Blue" || keyName === "k") {
      const selected = document.querySelector("#lista_anime .selected");
      if (selected) {
        selected.click(); // Trigger the click event
      }
      selected.classList.remove("selected")
    }


    // SELEZIONE E NAVIGAZIONE
    const listaAnime = document.querySelector("#lista_anime");

    if (listaAnime) {
      const selected = listaAnime.querySelector(".selected");

      if (!selected) {
        listaAnime.querySelector(".inner")?.classList.add("selected");
      } else {

          if (keyName === "ColorF0Red" || keyName === "ArrowLeft") {
            selected.cardMoveHorizont("prev", listaAnime);
          }else 
          if (keyName === "ColorF2Yellow" || keyName === "ArrowUp") {
            selected.cardMoveHorizont("up", listaAnime);
          }else 
          if (keyName === "ColorF1Green" || keyName === "ArrowRight") {
            selected.cardMoveHorizont("next", listaAnime);
          }else 
          if (keyName === "" || keyName === "ArrowDown") {
            selected.cardMoveHorizont("down", listaAnime);
          }
        event.preventDefault();
      }
    }
  }
});

HTMLElement.prototype.cardMoveHorizont = function (direction, container) {
  const items = Array.from(container.querySelectorAll('.inner'));
  const currentIndex = items.indexOf(this);
  const columns = 8; // Cambia questo valore se hai una griglia diversa

  let nextIndex = currentIndex;

  switch (direction) {
    case "prev":
      if ((currentIndex % columns) === 0) {
        // Vai all'ultima colonna della riga precedente
        const target = currentIndex - 1;
        if (target >= 0) nextIndex = target;
      } else {
        nextIndex = currentIndex - 1;
      }
      break;

    case "next":
      if ((currentIndex % columns) === columns - 1 || currentIndex + 1 >= items.length) {
        // Vai alla prima colonna della riga successiva
        const target = currentIndex + (columns - (currentIndex % columns));
        if (target < items.length) nextIndex = target;
      } else {
        nextIndex = currentIndex + 1;
      }
      break;

      case "up":
        if (currentIndex - columns >= 0) {
          nextIndex = currentIndex - columns;
        } else {
          // Torna all'ultima riga, stessa colonna se possibile
          const lastRowStart = items.length - (items.length % columns || columns);
          nextIndex = lastRowStart + (currentIndex % columns);
          if (nextIndex >= items.length) {
            nextIndex -= columns;
          }
        }
        break;
      
      case "down":
        if (currentIndex + columns < items.length) {
          nextIndex = currentIndex + columns;
        } else {
          // Torna alla prima riga, stessa colonna
          nextIndex = currentIndex % columns;
        }
        break;
        }

  if (nextIndex !== currentIndex) {
    this.classList.remove('selected');
    items[nextIndex].classList.add('selected');
  }
};
