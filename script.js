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

function menuStart(){
  fetch('http://localhost:5000/scrape')
  .then(response => response.json())
  .then(data => {

    // Crea un elemento temporaneo per contenere la stringa
    tempDiv = document.createElement('div');
    tempDiv.innerHTML = data.widgetbody;

    
    // Tutti i poster (anime)
    posters = tempDiv.querySelectorAll('.poster')


    // Riempo la lista links con tutti i link degli anime
    posters.forEach(element => {
      links.push('https://www.animeworld.so'+element.getAttribute('href'))
    });

    // Seleziona tutti i div con la classe "common-class" e "different-class"
    allDivs = tempDiv.querySelectorAll('.page');
    
    document.getElementById('lista_anime').innerHTML = allDivs[numeroPagina].querySelector('.film-list').innerHTML;
    
    document.querySelectorAll('.inner').forEach(element => {
      element.setAttribute('tabindex', 0)
      element.setAttribute('onclick', `videoPlayer(${element.getAttribute('onclick')})`)
    })
  
    sistemaLink()

  })
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

function videoPlayer(link){


  fetch(`http://localhost:5000/scrape?url=${link}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('Error:', error);
  });


}
