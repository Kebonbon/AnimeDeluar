let numeroPagina = 0;
let tempDiv;
let allDivs;
let allDivsStringa;
let posters;
let links = [];


menuStart()

window.addEventListener("gamepadconnected", (event) => {
  console.log("Controller connected:", event.gamepad.id);
  checkController();
});

function sistemaLink(){

    document.querySelectorAll('.inner').forEach(anchor => {
      // Get the current href value
      let currentHref = anchor.querySelector('a').getAttribute('href');
      
      anchor.setAttribute('onclick', `videoPlayer('${'https://www.animeworld.so' + currentHref}')`);
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

  fetch(`http://localhost:5000/scrape?url=${encodeURIComponent(scrapeUrl)}&selector=${encodeURIComponent(querySelector)}`)
  .then(response => response.json())
  .then(data => {
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
}

function menu(){

  document.getElementById('resto').style.opacity = 0;

  setTimeout(()=>{  
    document.getElementById('lista_anime').style.opacity = 1;

    document.getElementById('resto').innerHTML = `            
            <div id="videoz"></div>
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

function videoPlayer(link) {
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
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
    padding: 15px;

    gap: 30px;
    border: solid;
    background-color: #fa1d37;
    border-radius: 20px;

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
  
  fetch(`http://localhost:5000/scrape?url=${encodeURIComponent(scrapeUrl)}&selector=${encodeURIComponent(querySelector)}`)
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
    
      let bottoni;
      let link_bottone;
      
      bottoni = tempDiv.querySelector("ul.episodes.range.active").querySelectorAll(".episode");
      
      bottoni.forEach(element => {
        
        link_bottone = 'https://www.animeworld.so' + element.querySelector('a').getAttribute('href')
        
        element.querySelector('a').setAttribute('onclick', `cambiaVideo('${link_bottone}')`)
        element.querySelector('a').setAttribute('href', '#')



        document.querySelector("#pulsanti").innerHTML += element.innerHTML
      });

    });
  }

function cambiaVideo(link_bottone){


  
  fetch(`http://localhost:5000/scrape?url=${encodeURIComponent(link_bottone)}&selector=${encodeURIComponent('#body')}`)
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
  console.log(videoPlayer)
  if (videoPlayer !== null) {
  videoPlayer.play();
  }
}

let fullscreenMode = false;
let buttonPressed0 = false;
let buttonPressed1 = false;
let buttonPressed2 = false;
let buttonPressed6 = false;
let buttonPressed7 = false;

function checkController() {
  const gamepad = navigator.getGamepads()[0];
  if (gamepad) {

      gamepad.buttons.forEach((button, index) => {
        if (button.pressed){
            console.log(`Button ${index} pressed`);}})

    const B = gamepad.buttons[1];
    if (B.pressed && !buttonPressed1) {
      buttonPressed1 = true;
      menu();
    } else if (!B.pressed && buttonPressed1) {
      buttonPressed1 = false;
    }

    const X = gamepad.buttons[2];
    if (X.pressed && !buttonPressed2) {
      buttonPressed2 = true;
      if (!fullscreenMode) {
        fullscreen();
      } else {
        removeFullscreen();
      }
      fullscreenMode = !fullscreenMode;
    } else if (!X.pressed && buttonPressed2) {
      buttonPressed2 = false;
    }

    const L2 = gamepad.buttons[6];
    if (L2.pressed && !buttonPressed6) {
      buttonPressed6 = true;
      indietro();
    } else if (!L2.pressed && buttonPressed6) {
      buttonPressed6 = false;
    }

    const R2 = gamepad.buttons[7];
    if (R2.pressed && !buttonPressed7) {
      buttonPressed7 = true;
      avanti();
    } else if (!R2.pressed && buttonPressed7) {
      buttonPressed7 = false;
    }




  }

  requestAnimationFrame(checkController); // Continuously check for input
}

checkController();


