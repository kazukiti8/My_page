// 環境変数の読み込み
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const Parser = require('rss-parser');
const app = express();
const PORT = process.env.PORT || 3000;

// API設定（環境変数から読み込み）
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
// デフォルト都市を変更する場合はここを編集
// 例: 'Osaka,JP', 'Kyoto,JP', 'Yokohama,JP', 'Nagoya,JP' など
const DEFAULT_CITY = 'Tokyo,JP';

// APIキーの検証
if (!OPENWEATHER_API_KEY) {
    console.error('警告: OPENWEATHER_API_KEYが設定されていません。天気機能が動作しません。');
}

if (!UNSPLASH_ACCESS_KEY) {
    console.error('警告: UNSPLASH_ACCESS_KEYが設定されていません。背景画像機能が動作しません。');
}

// セキュリティヘッダーの設定
app.use((req, res, next) => {
    // XSS保護
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // コンテンツタイプスニッフィング保護
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // クリックジャッキング保護
    res.setHeader('X-Frame-Options', 'DENY');
    // 厳格なトランスポートセキュリティ（HTTPS使用時）
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
});

// CORS設定の改善
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// JSONボディパーサーを有効化
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
            const errorText = await response.text();
            console.error(`Weather API error ${response.status}:`, errorText);
            
            if (response.status === 401) {
                throw new Error(`API認証エラー (401): APIキーが無効です。OpenWeatherMapで有効なAPIキーを取得してください。`);
            } else if (response.status === 429) {
                throw new Error(`API制限エラー (429): リクエスト制限に達しました。しばらく待ってから再試行してください。`);
            } else {
                throw new Error(`Weather API error: ${response.status} - ${errorText}`);
            }
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

// 背景画像取得API（Unsplash）
app.get('/api/background', async (req, res) => {
    if (!UNSPLASH_ACCESS_KEY) {
        return res.status(500).json({ 
            error: 'Unsplash API key not configured',
            fallback: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
        });
    }
    
    const { query = 'nature,landscape,scenic,peaceful' } = req.query;
    
    try {
        const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${UNSPLASH_ACCESS_KEY}`;
        
        console.log(`Fetching background image from Unsplash with query: ${query}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Unsplash API error ${response.status}:`, errorText);
            
            if (response.status === 401) {
                throw new Error(`API認証エラー (401): Unsplash APIキーが無効です。`);
            } else if (response.status === 429) {
                throw new Error(`API制限エラー (429): リクエスト制限に達しました。`);
            } else {
                throw new Error(`Unsplash API error: ${response.status} - ${errorText}`);
            }
        }
        
        const data = await response.json();
        
        if (data.urls && data.urls.full) {
            res.json({
                imageUrl: data.urls.full,
                photographer: data.user?.name || 'Unknown',
                photographerUrl: data.user?.links?.html || '',
                description: data.description || data.alt_description || ''
            });
        } else {
            throw new Error('Invalid response from Unsplash API');
        }
        
    } catch (error) {
        console.error('Error fetching background image:', error);
        res.status(500).json({ 
            error: 'Failed to fetch background image',
            details: error.message,
            fallback: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80'
        });
    }
});

// 5日間予報API
app.get('/api/forecast', async (req, res) => {
    const { lat, lon, city } = req.query;
    try {
        let url;
        if (lat && lon) {
            url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ja`;
        } else {
            const cityName = city || DEFAULT_CITY;
            url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ja`;
        }
        
        console.log(`Fetching forecast from: ${url}`);
        
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Forecast API error ${response.status}:`, errorText);
            
            if (response.status === 401) {
                throw new Error(`API認証エラー (401): APIキーが無効です。OpenWeatherMapで有効なAPIキーを取得してください。`);
            } else if (response.status === 429) {
                throw new Error(`API制限エラー (429): リクエスト制限に達しました。しばらく待ってから再試行してください。`);
            } else {
                throw new Error(`Forecast API error: ${response.status} - ${errorText}`);
            }
        }
        
        const data = await response.json();
        
        // 日別のデータを整理
        const daily = {};
        data.list.forEach(item => {
            const date = item.dt_txt.split(' ')[0];
            const hour = parseInt(item.dt_txt.split(' ')[1].split(':')[0], 10);
            
            if (!daily[date]) {
                daily[date] = {
                    date,
                    temps: [],
                    temp_mins: [],
                    temp_maxs: [],
                    descriptions: [],
                    icons: [],
                    humidities: [],
                    wind_speeds: []
                };
            }
            
            daily[date].temps.push(item.main.temp);
            daily[date].temp_mins.push(item.main.temp_min);
            daily[date].temp_maxs.push(item.main.temp_max);
            daily[date].descriptions.push(item.weather[0].description);
            daily[date].icons.push(item.weather[0].icon);
            daily[date].humidities.push(item.main.humidity);
            daily[date].wind_speeds.push(item.wind.speed);
        });
        
        // 各日の最高・最低気温を計算し、正午付近のデータを代表値として使用
        const result = Object.values(daily).slice(0, 5).map(day => {
            const temp_min = Math.round(Math.min(...day.temp_mins));
            const temp_max = Math.round(Math.max(...day.temp_maxs));
            
            // 正午（12時）に一番近いデータを代表値として使用
            const noonIndex = day.temps.length > 0 ? 
                day.temps.reduce((closest, temp, index) => {
                    const hour = index * 3; // 3時間ごとのデータなので
                    return Math.abs(hour - 12) < Math.abs(closest.hour - 12) ? 
                        { hour, index } : closest;
                }, { hour: 0, index: 0 }).index : 0;
            
            return {
                date: day.date,
                temp: Math.round(day.temps[noonIndex]),
                temp_min,
                temp_max,
                description: day.descriptions[noonIndex],
                icon: day.icons[noonIndex],
                humidity: day.humidities[noonIndex],
                wind_speed: Math.round(day.wind_speeds[noonIndex])
            };
        });
        
        res.json(result);
    } catch (error) {
        console.error('Error fetching forecast data:', error);
        res.status(500).json({
            error: 'Failed to fetch forecast data',
            details: error.message
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