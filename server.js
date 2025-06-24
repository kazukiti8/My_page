const express = require('express');
const path = require('path');
const cors = require('cors');
const Parser = require('rss-parser');
const app = express();
const PORT = process.env.PORT || 3000;

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