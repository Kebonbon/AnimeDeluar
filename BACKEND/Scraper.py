from flask import Flask, jsonify, request
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route('/scrape', methods=['GET'])
def scrape():
    url = "https://www.animeworld.so"
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.content, 'html.parser')  # Use response.content instead of response.widgetbody
        # Trova il div con la classe "widget-body"
        widgetbody = soup.find("div", {"class": "widget-body"})
        
        if widgetbody:
            return jsonify({"content": str(widgetbody)})
        else:
            return jsonify({"error": "widget-body non trovato"})
    else:
        return jsonify({"error": "Errore nella richiesta"}), response.status_code


if __name__ == '__main__':
    app.run(debug=True)
