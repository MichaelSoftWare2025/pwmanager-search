const express = require('express');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 80;

const app = express();

// Ваш API-ключ и ID поисковой системы (CX)
const API_KEY = process.env.API;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

// Настройка шаблонов для ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Функция для выполнения поискового запроса с пагинацией
async function googleSearch(query, start = 1) {
    const customsearch = google.customsearch('v1');
    const res = await customsearch.cse.list({
        q: query,
        cx: SEARCH_ENGINE_ID,
        auth: API_KEY,
        start: start
    });
    return res.data.items || [];
}

// Главная страница
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/style.css', (req, res) => {
    res.sendFile(path.join(__dirname, '/style.css'));
});

// Страница с результатами поиска
app.get('/search', async (req, res) => {
    const query = req.query.query || '';
    const page = parseInt(req.query.page) || 1;

    if (query) {
        const results = await googleSearch(query, (page - 1) * 10 + 1);
        res.render('search_results', {results, page });
    } else {
        res.render('index');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:80');
});
