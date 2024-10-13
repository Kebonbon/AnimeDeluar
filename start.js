import { spawn } from 'child_process';
import { resolve } from 'path';
import open from 'open';

// Path to the folder where server.js and live-server will run
const folderPath = resolve('C:/Users/KEVIN/Desktop/Programmazione/Github/AnimeDeluar');

// 1. Esegui il comando `node server.js` nella cartella specificata
const serverCommand = 'server.js';

// Start server.js using node
const serverJsProcess = spawn('node', [serverCommand], {
    cwd: folderPath,
    stdio: 'inherit', // To get output directly in the terminal
});

serverJsProcess.on('error', (error) => {
    console.error(`Errore durante l'esecuzione di server.js: ${error.message}`);
});

serverJsProcess.on('exit', (code) => {
    if (code !== 0) {
        console.error(`Processo server.js terminato con codice ${code}`);
    } else {
        console.log('Server server.js terminato correttamente');
    }
});

// 2. Esegui il comando `npx live-server` su una porta specifica nella stessa cartella
const liveServerProcess = spawn('cmd.exe', ['/c', 'npx', 'live-server', '--port=5500', '--no-browser'], {
    cwd: folderPath,
    stdio: 'inherit', // To get output directly in the terminal
});

liveServerProcess.on('error', (error) => {
    console.error(`Errore durante l'esecuzione di live-server: ${error.message}`);
});

liveServerProcess.on('exit', (code) => {
    if (code !== 0) {
        console.error(`Processo live-server terminato con codice ${code}`);
    } else {
        console.log('Server live-server terminato correttamente');
    }
});

// 3. Apri Chrome sulla pagina già aperta in modalità fullscreen
const localUrl = 'http://127.0.0.1:5500/index.html'; // URL della tua pagina
const chromePath = 'C:/Program Files/Google/Chrome/Application/chrome.exe'; // Modifica se necessario

open(localUrl, { 
    app: { 
        name: chromePath, 
        arguments: ['--start-fullscreen', '--app=' + localUrl] // Apri come applicazione in fullscreen
    } 
})
.then(() => {
    console.log('Chrome aperto in fullscreen!');
})
.catch(err => {
    console.error(`Errore durante l'apertura di Chrome: ${err}`);
});
