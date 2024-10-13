import { spawn } from 'child_process';
import { resolve } from 'path';
import open from 'open';

// 1. Esegui il comando `node server.js` in una cartella specifica
const folderPath = resolve('C:/Users/KEVIN/Desktop/Programmazione/Github/AnimeDeluar'); // Sostituisci con il percorso della cartella
const serverCommand = 'server.js';


// Modifica per utilizzare spawn
const serverProcess = spawn('node', [serverCommand], {
    cwd: folderPath,
    stdio: 'inherit', // Per ottenere output direttamente nel terminale
});

serverProcess.on('error', (error) => {
    console.error(`Errore durante l'esecuzione di server.js: ${error.message}`);
});

serverProcess.on('exit', (code) => {
    if (code !== 0) {
        console.error(`Processo terminato con codice ${code}`);
    } else {
        console.log('Server terminato correttamente');
    }
});

// 2. Apri Chrome su una pagina specifica
const url = 'http://127.0.0.1:5500/index.html'; // Sostituisci con la tua URL

// Specifica il percorso completo per Chrome
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'; // Modifica se necessario
open(url, { app: { name: chromePath, arguments: ['--start-fullscreen'] } })
    .then(() => {
        console.log('Chrome aperto in fullscreen!');
    })
    .catch(err => {
        console.error(`Errore durante l'apertura di Chrome: ${err}`);
    });