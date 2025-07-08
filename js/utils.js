/**
 * 共通ユーティリティ関数
 * @module utils
 */

import { STORAGE_KEYS, CATEGORY_ICONS, URL_ICONS, WIND_DIRECTIONS } from './config.js';

/**
 * ローカルストレージからデータを取得
 * @param {string} key - ストレージキー
 * @param {*} defaultValue - デフォルト値
 * @returns {*} 保存されたデータまたはデフォルト値
 */
export function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue;
    }
}

/**
 * ローカルストレージにデータを保存
 * @param {string} key - ストレージキー
 * @param {*} value - 保存するデータ
 */
export function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving to localStorage (${key}):`, error);
    }
}

/**
 * ローカルストレージからデータを削除
 * @param {string} key - ストレージキー
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
    }
}

/**
 * カテゴリー名からアイコンを取得
 * @param {string} categoryName - カテゴリー名
 * @returns {string} Font Awesomeアイコンクラス
 */
export function getCategoryIcon(categoryName) {
    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(CATEGORY_ICONS)) {
        if (lowerName.includes(key)) {
            return icon;
        }
    }
    return CATEGORY_ICONS.default;
}

/**
 * URLからアイコンを取得
 * @param {string} url - URL
 * @returns {string} Font Awesomeアイコンクラス
 */
export function getUrlIcon(url) {
    try {
        const domain = new URL(url).hostname.toLowerCase();
        for (const [pattern, icon] of Object.entries(URL_ICONS)) {
            if (domain.includes(pattern)) {
                return icon;
            }
        }
    } catch (error) {
        console.error('Error parsing URL for icon:', error);
    }
    return URL_ICONS.default;
}

/**
 * 風向きを取得
 * @param {number} degrees - 風向き（度）
 * @returns {string} 風向きの文字列
 */
export function getWindDirection(degrees) {
    if (typeof degrees !== 'number' || isNaN(degrees)) {
        return '';
    }
    const index = Math.round(degrees / 45) % 8;
    return WIND_DIRECTIONS[index] || '';
}

/**
 * 体感温度を計算
 * @param {number} temp - 気温
 * @param {number} humidity - 湿度
 * @param {number} windSpeed - 風速
 * @returns {number} 体感温度
 */
export function calculateFeelsLike(temp, humidity, windSpeed) {
    if (typeof temp !== 'number' || isNaN(temp)) {
        return temp;
    }
    
    let feelsLike = temp;
    
    // 風冷効果
    if (windSpeed > 0) {
        feelsLike -= windSpeed * 0.5;
    }
    
    // 湿度効果（高温高湿度の場合）
    if (temp > 25 && humidity > 60) {
        feelsLike += (humidity - 60) * 0.1;
    }
    
    return Math.round(feelsLike);
}

/**
 * 日付をフォーマット
 * @param {Date|string} date - 日付
 * @param {string} locale - ロケール
 * @returns {string} フォーマットされた日付
 */
export function formatDate(date, locale = 'ja-JP') {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return '';
    }
}

/**
 * 時刻をフォーマット
 * @param {Date|string} date - 日付
 * @param {string} locale - ロケール
 * @returns {string} フォーマットされた時刻
 */
export function formatTime(date, locale = 'ja-JP') {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleTimeString(locale, {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting time:', error);
        return '';
    }
}

/**
 * 相対時間を計算
 * @param {Date|string} date - 日付
 * @returns {string} 相対時間の文字列
 */
export function getRelativeTime(date) {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffMs = now - dateObj;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMinutes < 1) return '今';
        if (diffMinutes < 60) return `${diffMinutes}分前`;
        if (diffHours < 24) return `${diffHours}時間前`;
        if (diffDays < 7) return `${diffDays}日前`;
        
        return formatDate(dateObj);
    } catch (error) {
        console.error('Error calculating relative time:', error);
        return '';
    }
}

/**
 * テキストを短縮
 * @param {string} text - テキスト
 * @param {number} maxLength - 最大長
 * @returns {string} 短縮されたテキスト
 */
export function truncateText(text, maxLength = 100) {
    if (!text || text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}

/**
 * URLを検証
 * @param {string} url - URL
 * @returns {boolean} 有効なURLかどうか
 */
export function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * デバウンス関数
 * @param {Function} func - 実行する関数
 * @param {number} wait - 待機時間（ミリ秒）
 * @returns {Function} デバウンスされた関数
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * スロットル関数
 * @param {Function} func - 実行する関数
 * @param {number} limit - 制限時間（ミリ秒）
 * @returns {Function} スロットルされた関数
 */
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * ランダムなIDを生成
 * @param {number} length - IDの長さ
 * @returns {string} ランダムなID
 */
export function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * 配列をシャッフル
 * @param {Array} array - シャッフルする配列
 * @returns {Array} シャッフルされた配列
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * オブジェクトのディープクローン
 * @param {*} obj - クローンするオブジェクト
 * @returns {*} クローンされたオブジェクト
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === 'object') {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    
    return obj;
} 