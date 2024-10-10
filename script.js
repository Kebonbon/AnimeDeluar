let numeroPagina = 0;
let tempDiv;
let allDivs;
let allDivsStringa;
let posters;
let links = [];

menuStart()


function sistemaLink(){

    document.querySelectorAll('.inner').forEach(anchor => {
      // Get the current href value
      let currentHref = anchor.querySelector('a').getAttribute('href');
      
      anchor.setAttribute('onclick', `videoPlayer('${'https://www.animeworld.so' + currentHref}')`);
      anchor.removeAttribute('href');

      anchor.querySelectorAll('a').forEach(link => {link.removeAttribute('href')});
      
    });

}

function menuStart() {
  localStorage.setItem('scrapeUrl', 'https://www.animeworld.so');
  localStorage.setItem('querySelector', '.widget-body');

  const scrapeUrl = localStorage.getItem('scrapeUrl');
  const querySelector = localStorage.getItem('querySelector');

  fetch(`http://localhost:5000/scrape?url=${encodeURIComponent(scrapeUrl)}&selector=${encodeURIComponent(querySelector)}`)
  .then(response => response.json())
  .then(data => {
    console.log('Response from server:', data); // Log the server response
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
  }
}

function indietro(){
  if(numeroPagina >0){
    numeroPagina -=1
    menu()
    aggiornaCounter()
  }
}

function videoPlayer(link) {
  localStorage.setItem('scrapeUrl', link);
  localStorage.setItem('querySelector', '#download');

  console.log(link);

  const scrapeUrl = localStorage.getItem('scrapeUrl');
  const querySelector = localStorage.getItem('querySelector');

  fetch(`http://localhost:5000/scrape?url=${encodeURIComponent(scrapeUrl)}&selector=${encodeURIComponent(querySelector)}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Check if the response contains the expected content
      if (data.error) {
        console.error(data.error);
        return;
      }

      // Create a temporary div to parse the HTML response
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data.content;

      console.log(data.content)

      const downloadHref = tempDiv.querySelector('#downloadLink').getAttribute('href');
        console.log('Download link:', downloadHref); // Log the download link
        // You can now use downloadHref for further actions, e.g., redirecting the user
    });

    window.location.href = 'player.html';
    localStorage.setItem('videoSrc', downloadHref);
}
