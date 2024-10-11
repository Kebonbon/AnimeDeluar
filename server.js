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

// Route to handle scraping based on query parameters
app.get('/scrape', async (req, res) => {
  const { url, selector } = req.query;

  if (!url || !selector) {
    return res.status(400).json({ error: 'Missing url or selector parameter' });
  }

  try {
    const response = await fetch(url);
    const html = await response.text();
    const dom = new JSDOM(html);
    
    const element = dom.window.document.querySelectorAll(selector);

    if (element.length) {
      res.json({ content: element[0].innerHTML }); // Ensure we're sending content from the first element
    } else {
      res.json({ error: "Element not found" });
    }
  } catch (error) {
    console.error("Scraping error:", error); // Check if there's a fetch/network-related error
    res.status(500).send("Error during scraping");
  }
});

app.listen(5000, () => {
  console.log('Server listening on port 5000');
});
