from flask import Flask, request, render_template
from googleapiclient.discovery import build
import os

app = Flask(__name__)

# Ваш API-ключ и ID поисковой системы (CX)
API_KEY = os.environ.get('API')
SEARCH_ENGINE_ID = os.environ.get('SEARCH_ENGINE_ID')

# Функция для выполнения поискового запроса с пагинацией
def google_search(query, start=1):
    service = build("customsearch", "v1", developerKey=API_KEY)
    res = service.cse().list(q=query, cx=SEARCH_ENGINE_ID, start=start).execute()
    return res['items'] if 'items' in res else []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    page = int(request.args.get('page', 1))
    
    if query:
        results = google_search(query, start=(page - 1) * 10 + 1)
        return render_template('search_results.html', query=query, results=results, page=page)
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
