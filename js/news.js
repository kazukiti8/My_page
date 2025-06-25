// ニュースフィード機能
let newsFeeds = [];
let newsItems = [];
let isLoading = false;
let lastUpdate = null;

// プリセットフィードの定義
const presetFeeds = {
    'yahoo-news': {
        name: 'Yahoo!ニュース',
        url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml'
    },
    'nhk-news': {
        name: 'NHKニュース',
        url: 'https://www3.nhk.or.jp/rss/news/cat0.xml'
    },
    'asahi-news': {
        name: '朝日新聞',
        url: 'https://rss.asahi.com/rss/asahi/newsheadlines.rdf'
    },
    'mainichi-news': {
        name: '毎日新聞',
        url: 'https://mainichi.jp/rss/etc/mainichi-flash.rss'
    },
    'google-news-jp': {
        name: 'Googleニュース（日本）',
        url: 'https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja'
    },
    'google-news-tech': {
        name: 'Googleニュース（テクノロジー）',
        url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=ja&gl=JP&ceid=JP:ja'
    },
    'google-news-business': {
        name: 'Googleニュース（ビジネス）',
        url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGp1Ylhjam9TQUFQAQ?hl=ja&gl=JP&ceid=JP:ja'
    },
    'google-news-sports': {
        name: 'Googleニュース（スポーツ）',
        url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtdHZHZ0pWVHlnQVAB?hl=ja&gl=JP&ceid=JP:ja'
    },
    'google-news-entertainment': {
        name: 'Googleニュース（エンタメ）',
        url: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtdHZHZ0pWVHlnQVAB?hl=ja&gl=JP&ceid=JP:ja'
    }
};

// ローカルストレージからニュースフィードを読み込み
function loadNewsFeeds() {
    const saved = localStorage.getItem('newsFeeds');
    if (saved) {
        newsFeeds = JSON.parse(saved);
    } else {
        // デフォルトのニュースフィードを設定（Googleニュースのみ）
        newsFeeds = [
            {
                id: 'google-news-jp',
                name: 'Googleニュース（日本）',
                url: 'https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja',
                enabled: true
            }
        ];
        saveNewsFeeds();
    }
}

// ニュースフィードをローカルストレージに保存
function saveNewsFeeds() {
    localStorage.setItem('newsFeeds', JSON.stringify(newsFeeds));
}

// ニュースアイテムをローカルストレージに保存
function saveNewsItems() {
    localStorage.setItem('newsItems', JSON.stringify(newsItems));
}

// ローカルストレージからニュースアイテムを読み込み
function loadNewsItems() {
    const saved = localStorage.getItem('newsItems');
    if (saved) {
        newsItems = JSON.parse(saved);
    }
}

// ニュースフィードを追加
function addNewsFeed(name, url) {
    const newFeed = {
        id: 'feed_' + Date.now(),
        name: name,
        url: url,
        enabled: true
    };
    newsFeeds.push(newFeed);
    saveNewsFeeds();
    fetchAllNews();
    
    // 保存完了メッセージを表示
    if (window.showToast) {
        window.showToast.success(`ニュースフィード「${name}」を追加しました`);
    }
}

// ニュースフィードを削除
function removeNewsFeed(feedId) {
    newsFeeds = newsFeeds.filter(feed => feed.id !== feedId);
    saveNewsFeeds();
    // そのフィードのニュースアイテムも削除
    newsItems = newsItems.filter(item => item.feedId !== feedId);
    saveNewsItems();
    renderNews();
}

// ニュースフィードを有効/無効切り替え
function toggleNewsFeed(feedId) {
    const feed = newsFeeds.find(f => f.id === feedId);
    if (feed) {
        feed.enabled = !feed.enabled;
        saveNewsFeeds();
        if (feed.enabled) {
            fetchNewsFromFeed(feed);
        } else {
            // 無効化されたフィードのニュースを非表示
            newsItems = newsItems.filter(item => item.feedId !== feedId);
            saveNewsItems();
            renderNews();
        }
    }
}

// すべてのニュースフィードからニュースを取得
async function fetchAllNews() {
    if (isLoading) return;
    
    isLoading = true;
    renderNews(); // 読み込み状態を表示
    
    try {
        newsItems = [];
        for (const feed of newsFeeds) {
            if (feed.enabled) {
                await fetchNewsFromFeed(feed);
            }
        }
        saveNewsItems();
        lastUpdate = new Date();
        renderNews();
        
        // 成功メッセージを表示
        if (window.showToast) {
            window.showToast.success('ニュースを更新しました');
        }
        
    } catch (error) {
        console.error('Error fetching all news:', error);
        
        // エラーメッセージを表示
        if (window.showToast) {
            window.showToast.error('ニュースの取得に失敗しました');
        }
    } finally {
        isLoading = false;
        renderNews();
    }
}

// 特定のフィードからニュースを取得
async function fetchNewsFromFeed(feed) {
    try {
        console.log(`Fetching news from: ${feed.name} (${feed.url})`);
        
        const response = await fetch(`/api/news?url=${encodeURIComponent(feed.url)}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP ${response.status}: ${errorData.details || response.statusText}`);
        }
        const data = await response.json();
        
        console.log(`Successfully fetched ${data.items.length} items from ${feed.name}`);
        
        // 取得したニュースアイテムにフィード情報を追加
        const feedNews = data.items.map(item => ({
            ...item,
            feedId: feed.id,
            feedName: feed.name
        }));
        
        // 既存のアイテムと統合（重複を避ける）
        const existingIds = newsItems.map(item => item.guid || item.link);
        const newItems = feedNews.filter(item => 
            !existingIds.includes(item.guid || item.link)
        );
        
        newsItems.push(...newItems);
        
    } catch (error) {
        console.error(`Error fetching news from ${feed.name}:`, error);
        showNewsError(feed.name, error.message);
    }
}

// ニュースエラー表示
function showNewsError(feedName, errorMessage) {
    const newsContainer = document.getElementById('news-container');
    
    // 既存のエラーメッセージを削除
    const existingErrors = newsContainer.querySelectorAll('.news-error');
    existingErrors.forEach(error => error.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'news-error text-center text-red-400 text-sm py-3 bg-red-50 bg-opacity-50 rounded-lg border border-red-200 border-opacity-50 mb-3';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle mr-1"></i>
        <span class="font-medium">${feedName}</span>からのニュース取得に失敗しました
        <br><span class="text-xs text-red-300">${errorMessage}</span>
        <br><button class="retry-feed-btn text-blue-400 hover:text-blue-300 text-xs mt-2 px-3 py-1 bg-blue-50 rounded-full transition-colors" data-feed="${feedName}">
            <i class="fas fa-sync-alt mr-1"></i>再試行
        </button>
    `;
    
    // 再試行ボタンのイベントリスナーを追加
    errorDiv.querySelector('.retry-feed-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const feed = newsFeeds.find(f => f.name === feedName);
        if (feed) {
            fetchNewsFromFeed(feed);
        }
    });
    
    newsContainer.appendChild(errorDiv);
}

// ニュースを表示
function renderNews() {
    const newsContainer = document.getElementById('news-container');
    
    if (isLoading) {
        newsContainer.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-spinner animate-spin text-3xl text-blue-400 mb-4"></i>
                <div class="text-sm text-gray-300">ニュースを取得中...</div>
            </div>
        `;
        return;
    }
    
    if (newsItems.length === 0) {
        newsContainer.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-newspaper text-3xl text-gray-400 mb-4"></i>
                <p class="text-gray-400 text-sm mb-4">ニュースフィードを追加してください</p>
                <button onclick="document.getElementById('add-feed-btn').click()" 
                        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm transition-colors">
                    <i class="fas fa-plus mr-2"></i>フィードを追加
                </button>
            </div>
        `;
        return;
    }
    
    // 日付でソート（新しい順）
    const sortedNews = newsItems.sort((a, b) => {
        const dateA = new Date(a.pubDate || a.isoDate || Date.now());
        const dateB = new Date(b.pubDate || b.isoDate || Date.now());
        return dateB - dateA;
    });
    
    // 最新の15件まで表示
    const displayNews = sortedNews.slice(0, 15);
    
    newsContainer.innerHTML = `
        ${lastUpdate ? `
            <div class="text-xs text-gray-400 mb-3 text-center">
                <i class="fas fa-clock mr-1"></i>最終更新: ${lastUpdate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
            </div>
        ` : ''}
        <div class="space-y-3">
            ${displayNews.map(item => {
                // ソース名を抽出（Googleニュースの場合）
                const sourceName = extractSourceName(item.title, item.feedName);
                const cleanTitle = cleanNewsTitle(item.title);
                const timeAgo = formatDate(item.pubDate || item.isoDate);
                
                return `
                    <div class="news-item bg-white bg-opacity-90 rounded-lg p-4 hover:bg-opacity-95 transition-all duration-200 shadow-sm hover:shadow-md">
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex items-center">
                                <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">${sourceName}</span>
                                <span class="text-xs text-gray-500 ml-2">${timeAgo}</span>
                            </div>
                            <button onclick="openNewsInNewTab('${item.link}')" 
                                    class="text-gray-400 hover:text-blue-500 transition-colors" 
                                    title="新しいタブで開く">
                                <i class="fas fa-external-link-alt text-xs"></i>
                            </button>
                        </div>
                        <a href="${item.link}" target="_blank" rel="noopener noreferrer" 
                           class="block text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 leading-relaxed">
                            ${cleanTitle}
                        </a>
                        ${item.contentSnippet ? `
                            <p class="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">${item.contentSnippet}</p>
                        ` : ''}
                    </div>
                `;
            }).join('')}
        </div>
        ${newsItems.length > 15 ? `
            <div class="text-center mt-4">
                <span class="text-xs text-gray-400">最新の15件を表示中（全${newsItems.length}件）</span>
            </div>
        ` : ''}
    `;
}

// 新しいタブでニュースを開く
function openNewsInNewTab(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
}

// ソース名を抽出（Googleニュースのタイトルから）
function extractSourceName(title, feedName) {
    if (feedName && feedName.includes('Googleニュース')) {
        // Googleニュースのタイトル形式: "記事タイトル - ソース名"
        const match = title.match(/\s*-\s*([^-]+)$/);
        if (match) {
            return match[1].trim();
        }
    }
    return feedName || 'Unknown';
}

// ニュースタイトルをクリーンアップ
function cleanNewsTitle(title) {
    if (title.includes(' - ')) {
        // Googleニュースの場合、ソース名を除去
        return title.split(' - ')[0].trim();
    }
    return title;
}

// 日付をフォーマット
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 60) {
        return `${diffMinutes}分前`;
    } else if (diffHours < 24) {
        return `${diffHours}時間前`;
    } else if (diffDays === 1) {
        return '昨日';
    } else if (diffDays <= 7) {
        return `${diffDays - 1}日前`;
    } else {
        return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
}

// ニュースフィード管理モーダルの設定
function setupNewsFeedModal() {
    const modal = document.getElementById('news-feed-modal');
    const addFeedBtn = document.getElementById('add-feed-btn');
    const cancelFeedBtn = document.getElementById('cancel-feed-btn');
    const saveFeedBtn = document.getElementById('save-feed-btn');
    const resetToGoogleBtn = document.getElementById('reset-to-google-btn');
    const feedNameInput = document.getElementById('feed-name-input');
    const feedUrlInput = document.getElementById('feed-url-input');
    const presetFeedsSelect = document.getElementById('preset-feeds');
    
    // モーダルを開く
    addFeedBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        feedNameInput.value = '';
        feedUrlInput.value = '';
        presetFeedsSelect.value = '';
        feedNameInput.focus();
    });
    
    // プリセットフィードの選択
    presetFeedsSelect.addEventListener('change', () => {
        const selectedPreset = presetFeedsSelect.value;
        if (selectedPreset && presetFeeds[selectedPreset]) {
            const preset = presetFeeds[selectedPreset];
            feedNameInput.value = preset.name;
            feedUrlInput.value = preset.url;
        }
    });
    
    // Googleニュースのみにリセット
    resetToGoogleBtn.addEventListener('click', () => {
        if (confirm('すべてのニュースフィードを削除して、Googleニュースのみにリセットしますか？')) {
            resetToGoogleNewsOnly();
            modal.classList.add('hidden');
        }
    });
    
    // モーダルを閉じる
    cancelFeedBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    // モーダル外クリックで閉じる
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
    
    // ニュースフィードを保存
    saveFeedBtn.addEventListener('click', () => {
        const name = feedNameInput.value.trim();
        const url = feedUrlInput.value.trim();
        
        if (!name || !url) {
            alert('フィード名とURLを入力してください');
            return;
        }
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            alert('有効なURLを入力してください');
            return;
        }
        
        addNewsFeed(name, url);
        modal.classList.add('hidden');
    });
    
    // Enterキーで保存
    feedNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            feedUrlInput.focus();
        }
    });
    
    feedUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveFeedBtn.click();
        }
    });
}

// ニュース更新ボタンの設定
function setupNewsRefresh() {
    const refreshBtn = document.getElementById('refresh-news-btn');
    refreshBtn.addEventListener('click', () => {
        if (isLoading) return;
        
        refreshBtn.classList.add('animate-spin');
        fetchAllNews().finally(() => {
            setTimeout(() => {
                refreshBtn.classList.remove('animate-spin');
            }, 1000);
        });
    });
}

// 初期化
export function initNews() {
    // 既存のフィード設定をリセット（開発用）
    const shouldReset = localStorage.getItem('resetNewsFeeds');
    if (shouldReset === 'true') {
        localStorage.removeItem('newsFeeds');
        localStorage.removeItem('newsItems');
        localStorage.removeItem('resetNewsFeeds');
    }
    
    // 初回ユーザーまたはリセット希望者の場合、Googleニュースのみに設定
    const hasInitialized = localStorage.getItem('newsInitialized');
    if (!hasInitialized) {
        localStorage.removeItem('newsFeeds');
        localStorage.removeItem('newsItems');
        localStorage.setItem('newsInitialized', 'true');
    }
    
    loadNewsFeeds();
    loadNewsItems();
    setupNewsFeedModal();
    setupNewsRefresh();
    
    // 初回読み込み
    if (newsFeeds.length > 0) {
        fetchAllNews();
    } else {
        renderNews();
    }
    
    // 30分ごとに自動更新
    setInterval(() => {
        if (!isLoading && newsFeeds.length > 0) {
            fetchAllNews();
        }
    }, 30 * 60 * 1000);
}

// ニュースを手動で更新
export function refreshNews() {
    if (isLoading) return;
    fetchAllNews();
}

// ニュースフィードをGoogleニュースのみにリセット
function resetToGoogleNewsOnly() {
    newsFeeds = [
        {
            id: 'google-news-jp',
            name: 'Googleニュース（日本）',
            url: 'https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja',
            enabled: true
        }
    ];
    saveNewsFeeds();
    newsItems = [];
    saveNewsItems();
    fetchAllNews();
    
    // リセット完了メッセージを表示
    if (window.showToast) {
        window.showToast.info('Googleニュースのみにリセットしました');
    }
}

// グローバル関数として公開
window.refreshNews = refreshNews;
window.openNewsInNewTab = openNewsInNewTab; 