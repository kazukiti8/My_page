const express = require('express');
const path = require('path');
const cors = require('cors');
const Parser = require('rss-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// OpenWeatherMap API設定
const OPENWEATHER_API_KEY = '1c4b5e1a3e08c39828c42a201763997c'; // 実際のAPIキーに置き換えてください
const DEFAULT_CITY = 'Tokyo,JP';

// CORSを有効化
app.use(cors());

// JSONボディパーサーを有効化
app.use(express.json());

// 静的ファイルを配信
app.use(express.static(__dirname));

// RSSパーサーのインスタンスを作成
const parser = new Parser({
    customFields: {
        item: [
            ['media:content', 'media'],
            ['media:thumbnail', 'thumbnail'],
            ['content:encoded', 'contentEncoded'],
            ['content', 'content'],
            ['source', 'source'],
            ['dc:creator', 'creator'],
            ['dc:date', 'dcDate'],
            ['pubDate', 'pubDate'],
            ['guid', 'guid']
        ],
        feed: [
            ['title', 'title'],
            ['description', 'description'],
            ['link', 'link'],
            ['language', 'language'],
            ['lastBuildDate', 'lastBuildDate']
        ]
    }
});

// ルートパスでindex.htmlを配信
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 天気予報取得API
app.get('/api/weather', async (req, res) => {
    const { lat, lon, city } = req.query;
    
    try {
        let url;
        if (lat && lon) {
            // 緯度・経度で天気を取得
            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ja`;
        } else {
            // 都市名で天気を取得
            const cityName = city || DEFAULT_CITY;
            url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ja`;
        }
        
        console.log(`Fetching weather from: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Weather API error: ${response.status}`);
        }
        
        const weatherData = await response.json();
        
        // 天気データを整形
        const formattedWeather = {
            temperature: Math.round(weatherData.main.temp),
            temp_min: Math.round(weatherData.main.temp_min),
            temp_max: Math.round(weatherData.main.temp_max),
            humidity: weatherData.main.humidity,
            wind_speed: Math.round(weatherData.wind.speed),
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            location: weatherData.name,
            country: weatherData.sys.country,
            timestamp: new Date().toISOString()
        };
        
        console.log(`Weather data for ${formattedWeather.location}: ${formattedWeather.temperature}°C`);
        
        res.json(formattedWeather);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch weather data',
            details: error.message 
        });
    }
});

// ニュースフィード取得API
app.get('/api/news', async (req, res) => {
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    try {
        console.log(`Fetching RSS feed from: ${url}`);
        
        // RSSフィードを取得してパース
        const feed = await parser.parseURL(url);
        
        console.log(`Successfully parsed feed: ${feed.title}, items: ${feed.items.length}`);
        
        // フィードデータを整形
        const formattedFeed = {
            title: feed.title || 'Unknown Feed',
            description: feed.description || '',
            link: feed.link || '',
            items: feed.items.map(item => ({
                title: item.title || 'No Title',
                link: item.link || '',
                pubDate: item.pubDate || item.isoDate || '',
                contentSnippet: item.contentSnippet || item.content || '',
                content: item.content || item['content:encoded'] || '',
                guid: item.guid || item.id || item.link,
                author: item.creator || item.author || '',
                categories: item.categories || [],
                media: item.media || item.thumbnail || null
            }))
        };
        
        res.json(formattedFeed);
        
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
            url: url
        });
        
        res.status(500).json({ 
            error: 'Failed to fetch RSS feed',
            details: error.message,
            url: url
        });
    }
});

// ヘルスチェックエンドポイント
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 