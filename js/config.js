/**
 * アプリケーション設定
 * @module config
 */

// API設定
export const API_CONFIG = {
    WEATHER: {
        BASE_URL: 'https://api.openweathermap.org/data/2.5',
        DEFAULT_CITY: 'Tokyo,JP',
        UNITS: 'metric',
        LANGUAGE: 'ja',
        MAX_RETRIES: 3,
        RETRY_DELAY: 2000
    },
    BACKGROUND: {
        UNSPLASH_BASE_URL: 'https://api.unsplash.com',
        DEFAULT_QUERY: 'nature landscape',
        ORIENTATION: 'landscape'
    },
    NEWS: {
        DEFAULT_FEEDS: [
            {
                name: 'Yahoo!ニュース',
                url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
                category: 'general'
            },
            {
                name: 'IT Media News',
                url: 'https://rss.itmedia.co.jp/rss/2.0/itmedia_all.xml',
                category: 'technology'
            }
        ]
    }
};

// UI設定
export const UI_CONFIG = {
    THEME: {
        DEFAULT: 'auto',
        OPTIONS: ['light', 'dark', 'auto']
    },
    LAYOUT: {
        GRID_TEMPLATE: '1fr 3fr 1fr',
        GRID_AREAS: {
            LEFT: 'left',
            CENTER: 'center',
            RIGHT: 'right',
            CENTER_BOTTOM: 'center-bottom'
        }
    },
    ANIMATION: {
        DURATION: {
            FAST: 150,
            NORMAL: 300,
            SLOW: 500
        },
        EASING: 'ease-in-out'
    }
};

// ローカルストレージキー
export const STORAGE_KEYS = {
    CATEGORIES: 'categories',
    THEME: 'theme',
    BACKGROUND: 'background',
    WEATHER_LOCATION: 'weather_location',
    NEWS_FEEDS: 'news_feeds',
    SHORTCUTS: 'shortcuts'
};

// カテゴリーアイコン設定
export const CATEGORY_ICONS = {
    'social': 'fas fa-users',
    'work': 'fas fa-briefcase',
    'entertainment': 'fas fa-gamepad',
    'news': 'fas fa-newspaper',
    'shopping': 'fas fa-shopping-cart',
    'education': 'fas fa-graduation-cap',
    'technology': 'fas fa-laptop',
    'health': 'fas fa-heartbeat',
    'finance': 'fas fa-chart-line',
    'travel': 'fas fa-plane',
    'food': 'fas fa-utensils',
    'sports': 'fas fa-futbol',
    'music': 'fas fa-music',
    'video': 'fas fa-video',
    'tools': 'fas fa-tools',
    'default': 'fas fa-folder'
};

// URLアイコン設定
export const URL_ICONS = {
    'youtube.com': 'fab fa-youtube',
    'youtu.be': 'fab fa-youtube',
    'github.com': 'fab fa-github',
    'twitter.com': 'fab fa-twitter',
    'x.com': 'fab fa-twitter',
    'facebook.com': 'fab fa-facebook',
    'instagram.com': 'fab fa-instagram',
    'linkedin.com': 'fab fa-linkedin',
    'reddit.com': 'fab fa-reddit',
    'discord.com': 'fab fa-discord',
    'slack.com': 'fab fa-slack',
    'zoom.us': 'fas fa-video',
    'meet.google.com': 'fas fa-video',
    'teams.microsoft.com': 'fas fa-video',
    'amazon.com': 'fab fa-amazon',
    'amazon.co.jp': 'fab fa-amazon',
    'rakuten.co.jp': 'fas fa-shopping-cart',
    'yahoo.co.jp': 'fas fa-search',
    'google.com': 'fab fa-google',
    'gmail.com': 'fas fa-envelope',
    'outlook.com': 'fas fa-envelope',
    'hotmail.com': 'fas fa-envelope',
    'notion.so': 'fas fa-sticky-note',
    'figma.com': 'fab fa-figma',
    'trello.com': 'fab fa-trello',
    'asana.com': 'fas fa-tasks',
    'dropbox.com': 'fab fa-dropbox',
    'drive.google.com': 'fab fa-google-drive',
    'onedrive.live.com': 'fas fa-cloud',
    'spotify.com': 'fab fa-spotify',
    'apple.com': 'fab fa-apple',
    'microsoft.com': 'fab fa-microsoft',
    'stackoverflow.com': 'fab fa-stack-overflow',
    'medium.com': 'fab fa-medium',
    'dev.to': 'fab fa-dev',
    'qiita.com': 'fas fa-code',
    'zenn.dev': 'fas fa-code',
    'note.com': 'fas fa-edit',
    'hatena.ne.jp': 'fas fa-bookmark',
    'wikipedia.org': 'fab fa-wikipedia-w',
    'docs.google.com': 'fas fa-file-alt',
    'sheets.google.com': 'fas fa-table',
    'slides.google.com': 'fas fa-presentation',
    'calendar.google.com': 'fas fa-calendar',
    'maps.google.com': 'fas fa-map-marker-alt',
    'translate.google.com': 'fas fa-language',
    'default': 'fas fa-globe'
};

// 天気アイコン設定
export const WEATHER_ICONS = {
    '01d': 'fas fa-sun',
    '01n': 'fas fa-moon',
    '02d': 'fas fa-cloud-sun',
    '02n': 'fas fa-cloud-moon',
    '03d': 'fas fa-cloud',
    '03n': 'fas fa-cloud',
    '04d': 'fas fa-cloud',
    '04n': 'fas fa-cloud',
    '09d': 'fas fa-cloud-rain',
    '09n': 'fas fa-cloud-rain',
    '10d': 'fas fa-cloud-sun-rain',
    '10n': 'fas fa-cloud-moon-rain',
    '11d': 'fas fa-bolt',
    '11n': 'fas fa-bolt',
    '13d': 'fas fa-snowflake',
    '13n': 'fas fa-snowflake',
    '50d': 'fas fa-smog',
    '50n': 'fas fa-smog'
};

// 風向き設定
export const WIND_DIRECTIONS = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];

// デフォルト設定
export const DEFAULT_CONFIG = {
    CATEGORIES: [
        {
            id: 'work',
            name: '仕事',
            icon: CATEGORY_ICONS.work,
            bookmarks: []
        },
        {
            id: 'social',
            name: 'ソーシャル',
            icon: CATEGORY_ICONS.social,
            bookmarks: []
        },
        {
            id: 'entertainment',
            name: 'エンターテイメント',
            icon: CATEGORY_ICONS.entertainment,
            bookmarks: []
        }
    ]
}; 