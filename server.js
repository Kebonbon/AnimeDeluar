import express from 'express';
import cors from 'cors'; // Import cors
import fetch from 'node-fetch'; // Use import for node-fetch
import { JSDOM } from 'jsdom';

const app = express();

// Enable CORS for all requests
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Frontend origin
    methods: ['GET'] // Specify allowed methods
}));

app.get('/scrape', async (req, res) => {
  try {
    const response = await fetch('https://www.animeworld.so');
    const html = await response.text();
    const dom = new JSDOM(html);
    
    const widgetbody = dom.window.document.querySelector('.widget-body');
    
    if (widgetbody) {
      res.json({ widgetbody: widgetbody.innerHTML });
    } else {
      res.json({ error: "widget-body not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error during scraping");
  }
});


app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
