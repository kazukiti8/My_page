
// Consolidated JavaScript file

// 1. config.js
/**
 * アプリケーション設定
 * @module config
 */

// API設定
const API_CONFIG = {
  WEATHER: {
    BASE_URL: 'https://api.openweathermap.org/data/2.5',
    DEFAULT_CITY: 'Tokyo,JP',
    UNITS: 'metric',
    LANGUAGE: 'ja',
    MAX_RETRIES: 3,
    RETRY_DELAY: 2000,
  },
  BACKGROUND: {
    UNSPLASH_BASE_URL: 'https://api.unsplash.com',
    DEFAULT_QUERY: 'nature landscape',
    ORIENTATION: 'landscape',
  },
  NEWS: {
    DEFAULT_FEEDS: [
      {
        name: 'Yahoo!ニュース',
        url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
        category: 'general',
      },
      {
        name: 'IT Media News',
        url: 'https://rss.itmedia.co.jp/rss/2.0/itmedia_all.xml',
        category: 'technology',
      },
    ],
  },
};

// UI設定
const UI_CONFIG = {
  THEME: {
    DEFAULT: 'auto',
    OPTIONS: ['light', 'dark', 'auto'],
  },
  LAYOUT: {
    GRID_TEMPLATE: '1fr 3fr 1fr',
    GRID_AREAS: {
      LEFT: 'left',
      CENTER: 'center',
      RIGHT: 'right',
      CENTER_BOTTOM: 'center-bottom',
    },
  },
  ANIMATION: {
    DURATION: {
      FAST: 150,
      NORMAL: 300,
      SLOW: 500,
    },
    EASING: 'ease-in-out',
  },
};

// ローカルストレージキー
const STORAGE_KEYS = {
  CATEGORIES: 'categories',
  THEME: 'theme',
  BACKGROUND: 'background',
  WEATHER_LOCATION: 'weather_location',
  NEWS_FEEDS: 'news_feeds',
  SHORTCUTS: 'shortcuts',
};

// カテゴリーアイコン設定
const CATEGORY_ICONS = {
  social: 'fas fa-users',
  work: 'fas fa-briefcase',
  entertainment: 'fas fa-gamepad',
  news: 'fas fa-newspaper',
  shopping: 'fas fa-shopping-cart',
  education: 'fas fa-graduation-cap',
  technology: 'fas fa-laptop',
  health: 'fas fa-heartbeat',
  finance: 'fas fa-chart-line',
  travel: 'fas fa-plane',
  food: 'fas fa-utensils',
  sports: 'fas fa-futbol',
  music: 'fas fa-music',
  video: 'fas fa-video',
  tools: 'fas fa-tools',
  default: 'fas fa-folder',
};

// URLアイコン設定
const URL_ICONS = {
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
  default: 'fas fa-globe',
};

// 天気アイコン設定
const WEATHER_ICONS = {
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
  '50n': 'fas fa-smog',
};

// 風向き設定
const WIND_DIRECTIONS = [
  '北',
  '北東',
  '東',
  '南東',
  '南',
  '南西',
  '西',
  '北西',
];

// デフォルト設定
const DEFAULT_CONFIG = {
  CATEGORIES: [
    {
      id: 'work',
      name: '仕事',
      icon: CATEGORY_ICONS.work,
      bookmarks: [],
    },
    {
      id: 'social',
      name: 'ソーシャル',
      icon: CATEGORY_ICONS.social,
      bookmarks: [],
    },
    {
      id: 'entertainment',
      name: 'エンターテイメント',
      icon: CATEGORY_ICONS.entertainment,
      bookmarks: [],
    },
  ],
};

// 2. utils.js
/**
 * 共通ユーティリティ関数
 * @module utils
 */

/**
 * ローカルストレージからデータを取得
 * @param {string} key - ストレージキー
 * @param {*} defaultValue - デフォルト値
 * @returns {*} 保存されたデータまたはデフォルト値
 */
function getFromStorage(key, defaultValue = null) {
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
function saveToStorage(key, value) {
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
function removeFromStorage(key) {
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
function getCategoryIcon(categoryName) {
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
function getUrlIcon(url) {
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
function getWindDirection(degrees) {
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
function calculateFeelsLike(temp, humidity, windSpeed) {
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
function formatDate(date, locale = 'ja-JP') {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
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
function formatTime(date, locale = 'ja-JP') {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
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
function getRelativeTime(date) {
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
function truncateText(text, maxLength = 100) {
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
function isValidUrl(url) {
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
function debounce(func, wait) {
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
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * ランダムなIDを生成
 * @param {number} length - IDの長さ
 * @returns {string} ランダムなID
 */
function generateId(length = 8) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
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
function shuffleArray(array) {
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
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (Object.hasOwn(obj, key)) {
        cloned[key] = deepClone(obj[key]);
      }
      }
    return cloned;
  }

  return obj;
}

// 3. toast.js
// トースト通知機能
class Toast {
  constructor() {
    this.container = document.getElementById('toast-container');
  }

  // 成功メッセージを表示
  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  }

  // エラーメッセージを表示
  error(message, duration = 4000) {
    this.show(message, 'error', duration);
  }

  // 情報メッセージを表示
  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  }

  // 警告メッセージを表示
  warning(message, duration = 4000) {
    this.show(message, 'warning', duration);
  }

  // トースト通知を表示
  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast-notification transform transition-all duration-300 ease-in-out translate-x-full opacity-0`;

    // タイプに応じたスタイルを設定
    const styles = {
      success: 'bg-green-500 text-white border-l-4 border-green-600',
      error: 'bg-red-500 text-white border-l-4 border-red-600',
      info: 'bg-blue-500 text-white border-l-4 border-blue-600',
      warning: 'bg-yellow-500 text-white border-l-4 border-yellow-600',
    };

    const icons = {
      success: 'fas fa-check-circle',
      error: 'fas fa-exclamation-circle',
      info: 'fas fa-info-circle',
      warning: 'fas fa-exclamation-triangle',
    };

    toast.className += ` ${styles[type]} rounded-lg shadow-lg p-4 min-w-80 max-w-sm`;

    toast.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <i class="${icons[type]} text-lg"></i>
                    <span class="font-medium">${message}</span>
                </div>
                <button class="toast-close text-white hover:text-gray-200 transition-colors duration-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    // 閉じるボタンのイベントリスナー
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      this.hide(toast);
    });

    // コンテナに追加
    this.container.appendChild(toast);

    // アニメーション開始
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);

    // 自動で閉じる
    if (duration > 0) {
      setTimeout(() => {
        this.hide(toast);
      }, duration);
    }

    return toast;
  }

  // トースト通知を非表示
  hide(toast) {
    toast.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // すべてのトースト通知をクリア
  clear() {
    const toasts = this.container.querySelectorAll('.toast-notification');
    toasts.forEach((toast) => {
      this.hide(toast);
    });
  }
}

// グローバルなトーストインスタンスを作成
const toast = new Toast();

// グローバル関数として公開
window.showToast = {
  success: (message, duration) => toast.success(message, duration),
  error: (message, duration) => toast.error(message, duration),
  info: (message, duration) => toast.info(message, duration),
  warning: (message, duration) => toast.warning(message, duration),
};

// 4. error-handler.js
// 包括的なエラーハンドリングシステム
class ErrorHandler {
  constructor() {
    this.errorCounts = new Map();
    this.maxRetries = 3;
    this.retryDelays = [1000, 3000, 5000]; // リトライ間隔（ミリ秒）
    this.setupGlobalErrorHandlers();
  }

  // グローバルエラーハンドラーの設定
  setupGlobalErrorHandlers() {
    // 未処理のPromiseエラーをキャッチ
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError('Promise Error', event.reason);
      event.preventDefault();
    });

    // グローバルエラーをキャッチ
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleError('Global Error', event.error);
    });

    // ネットワークエラーの監視
    this.setupNetworkErrorHandling();
  }

  // ネットワークエラーの監視
  setupNetworkErrorHandling() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);

        // レスポンスが成功でも、エラーレスポンスの場合は処理
        if (!response.ok) {
          const error = new Error(
            `HTTP ${response.status}: ${response.statusText}`
          );
          error.status = response.status;
          error.response = response;
          throw error;
        }

        return response;
      } catch (error) {
        // ネットワークエラーの詳細情報を追加
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          error.type = 'NETWORK_ERROR';
          error.message =
            'ネットワーク接続に失敗しました。インターネット接続を確認してください。';
        }
        throw error;
      }
    };
  }

  // エラーの分類と処理
  handleError(context, error, options = {}) {
    const errorInfo = this.classifyError(error);
    const errorKey = `${context}_${errorInfo.type}`;

    // エラー回数をカウント
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);

    // エラーログ
    this.logError(context, error, errorInfo);

    // ユーザーへの通知
    if (options.showToast !== false) { // showToastが明示的にfalseでない場合のみ表示
      this.notifyUser(errorInfo, options);
    }

    // 自動復旧の試行
    if (options.retry !== false && this.shouldRetry(errorKey)) {
      this.scheduleRetry(context, error, options);
    }
  }

  // エラーの分類
  classifyError(error) {
    const errorInfo = {
      type: 'UNKNOWN',
      severity: 'MEDIUM',
      userMessage: 'エラーが発生しました',
      canRetry: true,
    };

    // HTTPエラー
    if (error.status) {
      errorInfo.type = 'HTTP_ERROR';
      switch (error.status) {
        case 401:
          errorInfo.severity = 'HIGH';
          errorInfo.userMessage =
            '認証エラーが発生しました。APIキーを確認してください。';
          errorInfo.canRetry = false;
          break;
        case 403:
          errorInfo.severity = 'HIGH';
          errorInfo.userMessage = 'アクセスが拒否されました。';
          errorInfo.canRetry = false;
          break;
        case 404:
          errorInfo.severity = 'MEDIUM';
          errorInfo.userMessage = 'リソースが見つかりませんでした。';
          errorInfo.canRetry = false;
          break;
        case 429:
          errorInfo.severity = 'MEDIUM';
          errorInfo.userMessage =
            'リクエスト制限に達しました。しばらく待ってから再試行してください。';
          errorInfo.canRetry = true;
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          errorInfo.severity = 'MEDIUM';
          errorInfo.userMessage =
            'サーバーエラーが発生しました。しばらく待ってから再試行してください。';
          errorInfo.canRetry = true;
          break;
        default:
          errorInfo.userMessage = `サーバーエラー (${error.status}) が発生しました。`;
          errorInfo.canRetry = true;
      }
    }
    // ネットワークエラー
    else if (error.type === 'NETWORK_ERROR' || error.name === 'TypeError') {
      errorInfo.type = 'NETWORK_ERROR';
      errorInfo.severity = 'HIGH';
      errorInfo.userMessage =
        'ネットワーク接続に失敗しました。インターネット接続を確認してください。';
      errorInfo.canRetry = true;
    }
    // APIエラー
    else if (error.message && error.message.includes('API')) {
      errorInfo.type = 'API_ERROR';
      errorInfo.severity = 'HIGH';
      errorInfo.userMessage =
        'APIエラーが発生しました。設定を確認してください。';
      errorInfo.canRetry = true;
    }
    // タイムアウトエラー
    else if (error.name === 'AbortError' || error.message.includes('timeout')) {
      errorInfo.type = 'TIMEOUT_ERROR';
      errorInfo.severity = 'MEDIUM';
      errorInfo.userMessage = 'リクエストがタイムアウトしました。';
      errorInfo.canRetry = true;
    }

    return errorInfo;
  }

  // エラーログ
  logError(context, error, errorInfo) {
    const logData = {
      timestamp: new Date().toISOString(),
      context: context,
      errorType: errorInfo.type,
      severity: errorInfo.severity,
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    console.error(`Error logged [${context}]:`, error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }

    // ローカルストレージにエラーログを保存（最新10件）
    this.saveErrorLog(logData);
  }

  // エラーログの保存
  saveErrorLog(logData) {
    try {
      const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
      logs.unshift(logData);

      // 最新10件のみ保持
      if (logs.length > 10) {
        logs.splice(10);
      }

      localStorage.setItem('errorLogs', JSON.stringify(logs));
    } catch (e) {
      console.error('Failed to save error log:', e);
    }
  }

  // ユーザーへの通知
  notifyUser(errorInfo, options = {}) {
    const { showToast = true, showModal = false } = options;

    if (showToast && window.showToast) {
      const duration = errorInfo.severity === 'HIGH' ? 6000 : 4000;

      if (errorInfo.severity === 'HIGH') {
        window.showToast.error(errorInfo.userMessage, duration);
      } else {
        window.showToast.warning(errorInfo.userMessage, duration);
      }
    }

    if (showModal) {
      this.showErrorModal(errorInfo);
    }
  }

  // エラーモーダルの表示
  showErrorModal(errorInfo) {
    const modal = document.createElement('div');
    modal.className =
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="flex items-center mb-4">
                    <i class="fas fa-exclamation-triangle text-red-500 text-2xl mr-3"></i>
                    <h3 class="text-lg font-semibold">エラーが発生しました</h3>
                </div>
                <p class="text-gray-700 mb-4">${errorInfo.userMessage}</p>
                <div class="flex justify-end">
                    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onclick="this.closest('.fixed').remove()">
                        閉じる
                    </button>
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // 背景クリックで閉じる
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // リトライすべきかどうかの判定
  shouldRetry(errorKey) {
    const count = this.errorCounts.get(errorKey) || 0;
    return count <= this.maxRetries;
  }

  // リトライのスケジュール
  scheduleRetry(context, error, options) {
    const errorKey = `${context}_${this.classifyError(error).type}`;
    const retryCount = this.errorCounts.get(errorKey) || 0;
    const delay =
      this.retryDelays[Math.min(retryCount - 1, this.retryDelays.length - 1)];

    console.log(
      `Scheduling retry for ${context} in ${delay}ms (attempt ${retryCount})`
    );

    setTimeout(() => {
      if (
        options.retryFunction &&
        typeof options.retryFunction === 'function'
      ) {
        options.retryFunction();
      }
    }, delay);
  }

  // エラー統計の取得
  getErrorStats() {
    const stats = {};
    for (const [key, count] of this.errorCounts) {
      const [context, type] = key.split('_');
      if (!stats[context]) stats[context] = {};
      stats[context][type] = count;
    }
    return stats;
  }

  // エラーログの取得
  getErrorLogs() {
    try {
      return JSON.parse(localStorage.getItem('errorLogs') || '[]');
    } catch (e) {
      return [];
    }
  }

  // エラーログのクリア
  clearErrorLogs() {
    localStorage.removeItem('errorLogs');
    this.errorCounts.clear();
  }
}

// グローバルエラーハンドラーインスタンスを作成
const errorHandler = new ErrorHandler();

// グローバル関数として公開
window.errorHandler = errorHandler;

// 5. favicon-service.js
// 高度なFavicon取得サービス
class FaviconService {
  constructor() {
    this.cache = new Map();
    this.failedDomains = new Set();
    this.maxRetries = 2;
    this.cacheExpiry = 24 * 60 * 60 * 1000; // 24時間
  }

  // メインのFavicon取得関数
  async getFavicon(url, size = 32) {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      // キャッシュをチェック
      const cached = this.getFromCache(domain);
      if (cached) {
        return cached;
      }

      // 失敗済みドメインをチェック
      if (this.failedDomains.has(domain)) {
        return this.getDefaultFavicon();
      }

      // 複数のFaviconサービスを試行
      const faviconUrl = await this.tryFaviconServices(domain, size);

      if (faviconUrl) {
        this.saveToCache(domain, faviconUrl);
        return faviconUrl;
      } else {
        this.failedDomains.add(domain);
        return this.getDefaultFavicon();
      }
    } catch (error) {
      // 取得失敗時はエラーを無視し、デフォルトアイコンを返す
      // console.warn('Error getting favicon for:', url, error);
      // window.errorHandler.handleError('Favicon', error, { retry: false, showToast: false });
      return this.getDefaultFavicon();
    }
  }

  // 複数のFaviconサービスを試行
  async tryFaviconServices(domain, size) {
    const services = [
      // Google Favicon Service (推奨)
      `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
      // DuckDuckGo Favicon Service
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      // 直接的なfavicon.ico
      `https://${domain}/favicon.ico`,
      // 小さいサイズでGoogleサービスを再試行
      `https://www.google.com/s2/favicons?domain=${domain}&sz=16`,
    ];

    for (let i = 0; i < services.length; i++) {
      try {
        const url = services[i];
        const isValid = await this.validateFavicon(url);
        if (isValid) {
          return url;
        }
      } catch (error) {
        // CSPエラーやネットワークエラーは静かに無視
        console.debug(
          `Favicon service ${i + 1} failed for ${domain}:`,
          error.message
        );
        continue;
      }
    }

    return null;
  }

  // Faviconの有効性を検証
  async validateFavicon(url) {
    try {
      // CSPエラーを回避するため、より安全な検証方法を使用
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
      });

      // no-corsモードでは常に成功するため、実際の検証は画像読み込みで行う
      return true;
    } catch (error) {
      // CSPエラーやネットワークエラーは静かに無視
      console.debug('Favicon validation failed for:', url, error.message);
      return false;
    }
  }

  // キャッシュから取得
  getFromCache(domain) {
    const cached = this.cache.get(domain);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.url;
    }

    // 期限切れの場合は削除
    if (cached) {
      this.cache.delete(domain);
    }

    return null;
  }

  // キャッシュに保存
  saveToCache(domain, url) {
    this.cache.set(domain, {
      url: url,
      timestamp: Date.now(),
    });
  }

  // デフォルトFaviconを取得
  getDefaultFavicon() {
    return (
      'data:image/svg+xml;base64,' +
      btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="#E5E7EB"/>
                <path d="M16 8C18.2091 8 20 9.79086 20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8Z" fill="#9CA3AF"/>
                <path d="M16 20C13.7909 20 12 18.2091 12 16H20C20 18.2091 18.2091 20 16 20Z" fill="#9CA3AF"/>
            </svg>
        `)
    );
  }

  // キャッシュをクリア
  clearCache() {
    this.cache.clear();
    this.failedDomains.clear();
  }

  // 特定ドメインのキャッシュを削除
  removeFromCache(domain) {
    this.cache.delete(domain);
    this.failedDomains.delete(domain);
  }

  // キャッシュ統計を取得
  getCacheStats() {
    return {
      cachedDomains: this.cache.size,
      failedDomains: this.failedDomains.size,
      totalRequests: this.cache.size + this.failedDomains.size,
    };
  }

  // バッチ処理でFaviconを取得
  async getFaviconsBatch(urls, size = 32) {
    const results = new Map();

    try {
      // 並列でFaviconを取得（ただし、同時リクエスト数を制限）
      const batchSize = 5;
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const promises = batch.map(async (url) => {
          try {
            const favicon = await this.getFavicon(url, size);
            return { url, favicon };
          } catch (error) {
            console.warn('Error in batch favicon fetch for:', url, error);
            return { url, favicon: this.getDefaultFavicon() };
          }
        });

        const batchResults = await Promise.allSettled(promises);
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.set(result.value.url, result.value.favicon);
          } else {
            console.warn(
              'Batch favicon fetch failed for:',
              batch[index],
              result.reason
            );
            results.set(batch[index], this.getDefaultFavicon());
          }
        });

        // バッチ間で少し待機（API制限を避けるため）
        if (i + batchSize < urls.length) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error in batch favicon processing:', error);

      // エラーハンドラーを使用
      if (window.errorHandler) {
        window.errorHandler.handleError('FaviconBatch', error, {
          retry: false,
          showToast: false,
        });
      }
    }

    return results;
  }
}

// グローバルインスタンスを作成
const faviconService = new FaviconService();

// グローバル関数として公開
window.faviconService = faviconService;

// 6. clock.js
// 時計・日付・曜日の管理
const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const dayElement = document.getElementById('day');

function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
  dateElement.textContent = now.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  dayElement.textContent = now.toLocaleDateString('ja-JP', { weekday: 'long' });
}

// 7. search.js
// 検索エンジンの設定（Googleのみ）
const SEARCH_ENGINE = {
  name: 'Google',
  url: 'https://www.google.com/search?q=',
  icon: 'fab fa-google',
  placeholder: 'Googleで検索...',
};

// 検索窓の管理
const searchInput = document.getElementById('search-input');

// 検索を実行
function performSearch(query) {
  if (query.trim()) {
    const searchUrl = SEARCH_ENGINE.url + encodeURIComponent(query.trim());
    window.open(searchUrl, '_blank');
  }
}

function setupSearchBox() {
  // 検索窓のプレースホルダーを設定
  searchInput.placeholder = SEARCH_ENGINE.placeholder;

  // Enterキーのイベントリスナー
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value);
    }
  });
}

// 8. theme.js
// テーマ管理機能
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'auto';
    this.currentColorScheme = localStorage.getItem('colorScheme') || 'blue';
    this.customBackground = localStorage.getItem('customBackground') || '';
    this.init();
  }

  // 初期化
  init() {
    this.applyTheme();
    this.setupThemeToggle();
    this.setupColorSchemeSelector();
    this.setupBackgroundSelector();
  }

  // テーマを適用
  applyTheme() {
    const root = document.documentElement;

    // システムテーマの検出
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';

    // 現在のテーマを決定
    let activeTheme = this.currentTheme;
    if (this.currentTheme === 'auto') {
      activeTheme = systemTheme;
    }

    // テーマクラスを適用
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${activeTheme}`);

    // カラースキームを適用
    this.applyColorScheme();

    // カスタム背景を適用
    this.applyCustomBackground();
  }

  // カラースキームを適用
  applyColorScheme() {
    const root = document.documentElement;

    // 既存のカラースキームクラスを削除
    root.classList.remove(
      'color-blue',
      'color-green',
      'color-purple',
      'color-orange',
      'color-red'
    );
    root.classList.add(`color-${this.currentColorScheme}`);
  }

  // カスタム背景を適用
  applyCustomBackground() {
    const backgroundElement = document.getElementById('background');
    if (backgroundElement && this.customBackground) {
      backgroundElement.style.backgroundImage = `url(${this.customBackground})`;
    }
  }

  // テーマ切り替えボタンの設定
  setupThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.id = 'theme-toggle';
    themeToggle.className =
      'fixed bottom-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 z-40';
    themeToggle.innerHTML = this.getThemeIcon();
    themeToggle.title = 'テーマを切り替え (Ctrl+Shift+T)';
    document.body.appendChild(themeToggle);

    themeToggle.addEventListener('click', () => {
      this.toggleTheme();
    });

    // システムテーマの変更を監視
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.currentTheme === 'auto') {
          this.applyTheme();
        }
      });
  }

  // テーマアイコンを取得
  getThemeIcon() {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'dark'
      : 'light';
    const activeTheme =
      this.currentTheme === 'auto' ? systemTheme : this.currentTheme;

    return activeTheme === 'dark'
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }

  // テーマを切り替え
  toggleTheme() {
    const themes = ['auto', 'light', 'dark'];
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme = themes[nextIndex];

    localStorage.setItem('theme', this.currentTheme);
    this.applyTheme();

    // アイコンを更新
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = this.getThemeIcon();
    }

    // トースト通知
    if (window.showToast) {
      const themeNames = { auto: '自動', light: 'ライト', dark: 'ダーク' };
      window.showToast.info(
        `テーマを${themeNames[this.currentTheme]}に変更しました`
      );
    }
  }

  // カラースキーム選択器の設定
  setupColorSchemeSelector() {
    const colorSchemes = [
      { key: 'blue', name: 'ブルー', class: 'bg-blue-500' },
      { key: 'green', name: 'グリーン', class: 'bg-green-500' },
      { key: 'purple', name: 'パープル', class: 'bg-purple-500' },
      { key: 'orange', name: 'オレンジ', class: 'bg-orange-500' },
      { key: 'red', name: 'レッド', class: 'bg-red-500' },
    ];

    const colorSelector = document.createElement('div');
    colorSelector.id = 'color-scheme-selector';
    colorSelector.className =
      'fixed bottom-4 left-20 bg-white bg-opacity-80 rounded-lg shadow-lg p-2 z-40 hidden';

    colorSelector.innerHTML = `
            <div class="text-xs font-medium text-gray-700 mb-2">カラーテーマ</div>
            <div class="flex space-x-2">
                ${colorSchemes
                  .map(
                    (scheme) => `
                    <button class="color-scheme-btn w-8 h-8 rounded-full ${scheme.class} hover:scale-110 transition-transform duration-200 ${scheme.key === this.currentColorScheme ? 'ring-2 ring-gray-400' : ''}"
                            data-scheme="${scheme.key}" title="${scheme.name}">
                    </button>
                `
                  )
                  .join('')}
            </div>
        `;

    document.body.appendChild(colorSelector);

    // カラーボタンのイベントリスナー
    colorSelector.querySelectorAll('.color-scheme-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const scheme = btn.dataset.scheme;
        this.setColorScheme(scheme);

        // 選択状態を更新
        colorSelector.querySelectorAll('.color-scheme-btn').forEach((b) => {
          b.classList.remove('ring-2', 'ring-gray-400');
        });
        btn.classList.add('ring-2', 'ring-gray-400');
      });
    });

    // カラーボタンを表示/非表示
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('mouseenter', () => {
      colorSelector.classList.remove('hidden');
    });

    colorSelector.addEventListener('mouseenter', () => {
      colorSelector.classList.remove('hidden');
    });

    colorSelector.addEventListener('mouseleave', () => {
      colorSelector.classList.add('hidden');
    });
  }

  // カラースキームを設定
  setColorScheme(scheme) {
    this.currentColorScheme = scheme;
    localStorage.setItem('colorScheme', scheme);
    this.applyColorScheme();

    if (window.showToast) {
      const schemeNames = {
        blue: 'ブルー',
        green: 'グリーン',
        purple: 'パープル',
        orange: 'オレンジ',
        red: 'レッド',
      };
      window.showToast.info(
        `カラーテーマを${schemeNames[scheme]}に変更しました`
      );
    }
  }

  // 背景選択器の設定
  setupBackgroundSelector() {
    const backgroundSelector = document.createElement('div');
    backgroundSelector.id = 'background-selector';
    backgroundSelector.className =
      'fixed bottom-4 left-20 bg-white bg-opacity-80 rounded-lg shadow-lg p-3 z-40 hidden';

    backgroundSelector.innerHTML = `
            <div class="text-xs font-medium text-gray-700 mb-2">背景画像</div>
            <div class="space-y-2">
                <button class="bg-auto-btn w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-xs ${!this.customBackground ? 'bg-blue-100 text-blue-700' : ''}">
                    <i class="fas fa-random mr-1"></i>自動（Unsplash）
                </button>
                <button class="bg-custom-btn w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-xs">
                    <i class="fas fa-image mr-1"></i>カスタム画像
                </button>
                <input type="file" id="custom-background-input" accept="image/*" class="hidden">
            </div>
        `;

    document.body.appendChild(backgroundSelector);

    // 自動背景ボタン
    backgroundSelector
      .querySelector('.bg-auto-btn')
      .addEventListener('click', () => {
        this.setCustomBackground('');
        backgroundSelector.classList.add('hidden');
      });

    // カスタム背景ボタン
    backgroundSelector
      .querySelector('.bg-custom-btn')
      .addEventListener('click', () => {
        document.getElementById('custom-background-input').click();
      });

    // ファイル選択
    document
      .getElementById('custom-background-input')
      .addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.setCustomBackground(e.target.result);
          };
          reader.readAsDataURL(file);
        }
        backgroundSelector.classList.add('hidden');
      });

    // 背景ボタンを表示/非表示
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('mouseenter', () => {
      backgroundSelector.classList.remove('hidden');
    });

    backgroundSelector.addEventListener('mouseenter', () => {
      backgroundSelector.classList.remove('hidden');
    });

    backgroundSelector.addEventListener('mouseleave', () => {
      backgroundSelector.classList.add('hidden');
    });
  }

  // カスタム背景を設定
  setCustomBackground(imageData) {
    this.customBackground = imageData;
    localStorage.setItem('customBackground', imageData);
    this.applyCustomBackground();

    if (window.showToast) {
      if (imageData) {
        window.showToast.success('カスタム背景画像を設定しました');
      } else {
        window.showToast.info('自動背景に戻しました');
      }
    }
  }

  // 現在のテーマを取得
  getCurrentTheme() {
    return this.currentTheme;
  }

  // 現在のカラースキームを取得
  getCurrentColorScheme() {
    return this.currentColorScheme;
  }
}

// グローバルなテーママネージャーを作成
const themeManager = new ThemeManager();

// グローバル関数として公開
window.themeManager = themeManager;

// 9. background.js
// 背景画像の管理（サーバーサイドAPI経由）
const backgroundElement = document.getElementById('background');
let retryCount = 0;
const maxRetries = 3;

function loadBackgroundImage() {
  const query = 'nature,landscape,scenic,peaceful';
  const url = `/api/background?query=${encodeURIComponent(query)}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.imageUrl) {
        backgroundElement.style.backgroundImage = `url(${data.imageUrl})`;
        backgroundElement.style.opacity = '1';

        // 背景画像の明度を自動調整
        adjustBackgroundBrightness(data.imageUrl);

        // 写真家情報を保存（将来的な機能拡張用）
        if (data.photographer) {
          localStorage.setItem('lastBackgroundPhotographer', data.photographer);
        }

        // 成功時にリトライカウントをリセット
        retryCount = 0;
      } else if (data.fallback) {
        // フォールバック画像を使用
        backgroundElement.style.backgroundImage = `url(${data.fallback})`;
        backgroundElement.style.opacity = '1';


        // エラーハンドラーを使用
        if (window.errorHandler) {
          window.errorHandler.handleError(
            'Background',
            new Error('Using fallback image'),
            {
              retry: false,
              showToast: false,
            }
          );
        }
      }
    })
    .catch((error) => {
      retryCount++;

      // エラーハンドラーを使用
      if (window.errorHandler) {
        window.errorHandler.handleError('Background', error, {
          retry: retryCount <= maxRetries,
          retryFunction: () => {

            setTimeout(loadBackgroundImage, 3000);
          },
          showToast: false, // 背景画像エラーは静かに処理
        });
      }

      // デフォルトのフォールバック画像
      backgroundElement.style.backgroundImage =
        'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)';
      backgroundElement.style.opacity = '1';
    });
}

// 背景画像の明度を自動調整する関数
function adjustBackgroundBrightness(imageUrl) {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;

    // 画像をキャンバスに描画
    ctx.drawImage(img, 0, 0);

    // 画像の平均明度を計算
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let totalBrightness = 0;

    // サンプリングして明度を計算（パフォーマンス向上のため）
    const sampleSize = Math.min(1000, data.length / 4);
    for (let i = 0; i < sampleSize; i++) {
      const index = Math.floor(Math.random() * (data.length / 4)) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      // 明度計算（RGBの加重平均）
      const brightness = r * 0.299 + g * 0.587 + b * 0.114;
      totalBrightness += brightness;
    }

    const averageBrightness = totalBrightness / sampleSize;

    // 明度に基づいてUI要素のスタイルを調整
    adjustUIForBrightness(averageBrightness);
  };
  img.src = imageUrl;
}

// 明度に基づいてUI要素のスタイルを調整
function adjustUIForBrightness(brightness) {
  const root = document.documentElement;

  if (brightness > 150) {
    // 明るい背景の場合
    root.style.setProperty('--ui-opacity', '0.9');
    root.style.setProperty('--text-shadow', '0 2px 4px rgba(0, 0, 0, 0.4)');
    root.style.setProperty('--blur-strength', '20px');
  } else if (brightness > 100) {
    // 中程度の明度の場合
    root.style.setProperty('--ui-opacity', '0.8');
    root.style.setProperty('--text-shadow', '0 1px 3px rgba(0, 0, 0, 0.3)');
    root.style.setProperty('--blur-strength', '15px');
  } else {
    // 暗い背景の場合
    root.style.setProperty('--ui-opacity', '0.7');
    root.style.setProperty('--text-shadow', '0 1px 2px rgba(0, 0, 0, 0.2)');
    root.style.setProperty('--blur-strength', '10px');
  }
}

// 10. weather.js
// ===================================================================================
// Weather Module
// ===================================================================================

// -----------------------------------------------------------------------------------
// State Management
// -----------------------------------------------------------------------------------

const weatherState = {
  weatherData: null,
  forecastData: null,
  isLoading: false,
  lastUpdate: null,
  locationError: false,
};

// -----------------------------------------------------------------------------------
// API Client
// -----------------------------------------------------------------------------------

/**
 * APIからデータを非同期に取得する汎用関数
 * @param {string} url - 取得先のURL
 * @returns {Promise<object>} - 取得したJSONデータ
 */
async function fetchApi(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.details || `HTTP ${response.status}: ${response.statusText}`
    );
  }
  return response.json();
}

/**
 * 現在の天気データを取得する
 * @param {object|null} coords - { lat, lon } 形式の座標オブジェクト
 * @returns {Promise<object>} - 天気データ
 */
function fetchCurrentWeather(coords) {
  let url = '/api/weather';
  if (coords) {
    url += `?lat=${coords.lat}&lon=${coords.lon}`;
  }
  return fetchApi(url);
}

/**
 * 天気予報データを取得する
 * @param {object|null} coords - { lat, lon } 形式の座標オブジェクト
 * @returns {Promise<object>} - 予報データ
 */
function fetchWeatherForecast(coords) {
  let url = '/api/forecast';
  if (coords) {
    url += `?lat=${coords.lat}&lon=${coords.lon}`;
  }
  return fetchApi(url);
}

/**
 * ブラウザから現在の位置情報を取得する (Promise版)
 * @returns {Promise<object>} - 座標オブジェクト { latitude, longitude }
 */
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported.'));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// -----------------------------------------------------------------------------------
// UI Rendering
// -----------------------------------------------------------------------------------

/**
 * 天気ウィジェットのUIを現在の状態に基づいて更新する
 */
function renderWeatherWidget() {
  const container = document.getElementById('weather-widget');
  if (!container) return;

  if (weatherState.isLoading) {
    container.innerHTML = getLoadingHTML();
    return;
  }

  if (!weatherState.weatherData) {
    container.innerHTML = getErrorHTML('天気データを取得できませんでした。');
    return;
  }

  // 今日の予報から最高・最低気温を取得
  const today = new Date().toISOString().split('T')[0];
  const todaysForecast = weatherState.forecastData?.find(
    (day) => day.date === today
  );

  const tempMax = todaysForecast?.temp_max ?? weatherState.weatherData.temp_max;
  const tempMin = todaysForecast?.temp_min ?? weatherState.weatherData.temp_min;

  container.innerHTML = getMainHTML(weatherState.weatherData, tempMax, tempMin);

  if (weatherState.forecastData) {
    renderForecast(weatherState.forecastData);
  } else {
    showForecastError('予報データがありません。');
  }

  // 更新ボタンにイベントリスナーを再設定
  const refreshBtn = document.getElementById('weather-refresh-btn');
  if (refreshBtn) {
    refreshBtn.onclick = (e) => {
      e.preventDefault();
      loadWeather();
    };
  }
}

/**
 * メインの天気情報HTMLを生成する
 * @param {object} data - 天気データ
 * @param {number} tempMax - 最高気温
 * @param {number} tempMin - 最低気温
 * @returns {string} - HTML文字列
 */
function getMainHTML(data, tempMax, tempMin) {
  const iconClass = WEATHER_ICONS[data.icon] || 'fas fa-cloud';
  const updateTime =
    weatherState.lastUpdate?.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    }) || '';
  const windDirection = data.wind_deg ? getWindDirection(data.wind_deg) : '';
  const feelsLike = calculateFeelsLike(
    data.temperature,
    data.humidity,
    data.wind_speed
  );

  return `
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors" onclick="window.open('https://weather.yahoo.co.jp/weather/jp/13/4410.html', '_blank')">
                <i class="${iconClass} text-3xl mr-3 text-yellow-400"></i>
                <div>
                    <div class="text-xl font-semibold">${data.description}</div>
                    <div class="text-sm text-gray-300">${data.location}, ${data.country}</div>
                </div>
                <i class="fas fa-external-link-alt ml-2 text-sm opacity-60"></i>
            </div>
            <button id="weather-refresh-btn" class="text-blue-400 hover:text-blue-300 transition-colors" title="天気を更新">
                <i class="fas fa-sync-alt"></i>
            </button>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
                <div class="text-3xl font-bold">${data.temperature}°C</div>
                <div class="text-sm text-gray-300">体感: ${feelsLike}°C</div>
            </div>
            <div class="text-right">
                <div class="text-sm">
                    <span class="text-red-400">H: ${tempMax}°</span><br>
                    <span class="text-blue-400">L: ${tempMin}°</span>
                </div>
            </div>
        </div>
        <div class="text-xs text-gray-300 mb-3">
            <i class="fas fa-tint mr-1"></i>湿度: ${data.humidity}% |
            <i class="fas fa-wind mr-1"></i>風速: ${data.wind_speed}m/s
            ${windDirection ? ` | <i class="fas fa-compass mr-1"></i>${windDirection}` : ''}
        </div>
        ${
          updateTime
            ? `<div class="text-xs text-gray-400 mb-3">
            <i class="fas fa-clock mr-1"></i>最終更新: ${updateTime}
        </div>`
            : ''
        }
        <div id="weather-forecast" class="mt-4 border-t border-white border-opacity-10 pt-3"></div>
    `;
}

/**
 * 5日間予報のUIをレンダリングする
 * @param {Array<object>} forecast - 予報データ配列
 */
function renderForecast(forecast) {
  const container = document.getElementById('weather-forecast');
  if (!container) return;

  container.innerHTML = `
        <div class="text-xs font-semibold mb-2">5日間予報</div>
        <div class="grid grid-cols-5 gap-2">
            ${forecast.map((day) => getForecastDayHTML(day)).join('')}
        </div>
    `;
}

/**
 * 予報日1日分のHTMLを生成する
 * @param {object} day - 1日分の予報データ
 * @returns {string} - HTML文字列
 */
function getForecastDayHTML(day) {
  const iconClass = WEATHER_ICONS[day.icon] || 'fas fa-cloud';
  const date = new Date(day.date);
  const dayLabel = date.toLocaleDateString('ja-JP', { weekday: 'short' });
  const dateLabel = date.toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  });

  return `
        <div class="flex flex-col items-center bg-white bg-opacity-10 rounded-lg p-2 hover:bg-opacity-20 transition-colors cursor-pointer"
             onclick="showDayDetail('${day.date}', '${day.description}', ${day.temp}, ${day.temp_max}, ${day.temp_min}, ${day.humidity || 0}, ${day.wind_speed || 0}, '${day.icon}')">
            <div class="text-xs font-medium">${dayLabel}</div>
            <div class="text-xs text-gray-300">${dateLabel}</div>
            <i class="${iconClass} text-lg my-1 text-yellow-400"></i>
            <div class="text-xs font-semibold">${day.temp}°</div>
            <div class="text-xs text-gray-300">
                <span class="text-red-400">${day.temp_max}°</span>/<span class="text-blue-400">${day.temp_min}°</span>
            </div>
        </div>
    `;
}

/**
 * ローディング中の表示HTMLを返す
 * @returns {string} HTML文字列
 */
function getLoadingHTML() {
  return `
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
                <i class="fas fa-cloud-sun text-3xl mr-3 text-yellow-400"></i>
                <div>
                    <div class="text-xl font-semibold">天気を取得中...</div>
                    <div class="text-sm text-gray-300">位置情報を確認中</div>
                </div>
            </div>
            <i class="fas fa-sync-alt animate-spin text-blue-400"></i>
        </div>
        <div class="text-3xl font-bold mb-2">--°C</div>
        <div class="text-sm mb-2">H: --° | L: --°</div>
        <div class="text-xs text-gray-300">湿度: --% | 風速: --m/s</div>
    `;
}

/**
 * エラー表示用のHTMLを返す
 * @param {string} errorMessage - 表示するエラーメッセージ
 * @returns {string} HTML文字列
 */
function getErrorHTML(errorMessage) {
  return `
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle text-3xl mr-3 text-red-400"></i>
                <div>
                    <div class="text-xl font-semibold">エラー</div>
                    <div class="text-sm text-gray-300">情報を取得できませんでした</div>
                </div>
            </div>
            <button id="weather-refresh-btn" class="text-blue-400 hover:text-blue-300 transition-colors" title="再試行">
                <i class="fas fa-redo"></i>
            </button>
        </div>
        <div class="text-xs mt-3 p-2 bg-red-50 bg-opacity-50 rounded-lg border border-red-200 border-opacity-50">
            <span class="text-red-300">${errorMessage}</span>
        </div>
    `;
}

/**
 * 予報データ取得失敗時のHTMLを表示する
 * @param {string} errorMessage - エラーメッセージ
 */
function showForecastError(errorMessage) {
  const container = document.getElementById('weather-forecast');
  if (!container) return;
  container.innerHTML = `<div class="text-xs text-red-300">${errorMessage}</div>`;
}

// -----------------------------------------------------------------------------------
// Main Logic
// -----------------------------------------------------------------------------------

/**
 * 天気情報の読み込みと表示を行うメイン関数
 */
async function loadWeather() {
  if (weatherState.isLoading) return;

  weatherState.isLoading = true;
  weatherState.locationError = false;
  renderWeatherWidget();

  let coords = null;
  try {
    const position = await getCurrentLocation();
    coords = { lat: position.coords.latitude, lon: position.coords.longitude };
  } catch (error) {
    console.warn('Could not get location:', error.message);
    weatherState.locationError = true;
  }

  try {
    const [weatherResult, forecastResult] = await Promise.allSettled([
      fetchCurrentWeather(coords),
      fetchWeatherForecast(coords),
    ]);

    if (weatherResult.status === 'fulfilled') {
      weatherState.weatherData = weatherResult.value;
      weatherState.lastUpdate = new Date();
    } else {
      throw new Error(
        `現在の天気を取得できませんでした: ${weatherResult.reason.message}`
      );
    }

    if (forecastResult.status === 'fulfilled') {
      weatherState.forecastData = forecastResult.value;
    } else {
      console.error('Forecast fetch failed:', forecastResult.reason.message);
      weatherState.forecastData = null; // 失敗時はデータをクリア
    }
  } catch (error) {
    console.error('Weather loading failed:', error);
    weatherState.weatherData = null; // エラー時はデータをクリア
    if (window.errorHandler) {
      window.errorHandler.handleError('Weather', error, { showToast: true });
    }
  } finally {
    weatherState.isLoading = false;
    renderWeatherWidget();

    if (window.showToast && !weatherState.weatherData) {
      // エラーメッセージはerrorHandlerに任せる
    } else if (window.showToast) {
      let message = '天気情報を更新しました';
      if (weatherState.locationError) {
        message += ' (位置情報が使えず、デフォルト都市で表示)';
      }
      window.showToast.success(message);
    }
  }
}

// -----------------------------------------------------------------------------------
// Initializer
// -----------------------------------------------------------------------------------

/**
 * 天気モジュールを初期化する
 */
function initWeather() {
  loadWeather();
  setInterval(loadWeather, 30 * 60 * 1000); // 30分ごとに自動更新

  // グローバルスコープに関数を公開（HTMLのonclickなどで使用）
  window.refreshWeather = loadWeather;
}

// -----------------------------------------------------------------------------------
// Helper Functions (unchanged)
// -----------------------------------------------------------------------------------

// (Modal related functions are unchanged and kept for simplicity)
function showDayDetail(
  date,
  description,
  temp,
  tempMax,
  tempMin,
  humidity,
  windSpeed,
  icon
) {
  const modal = document.getElementById('day-detail-modal');
  if (!modal) return;
  const iconClass = WEATHER_ICONS[icon] || 'fas fa-cloud';
  const dayDate = new Date(date);
  const dayLabel = dayDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">${dayLabel}</h3>
                <button onclick="hideDayDetail()" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <div class="text-center mb-4">
                <i class="${iconClass} text-4xl text-yellow-400 mb-2"></i>
                <div class="text-2xl font-bold">${temp}°C</div>
                <div class="text-gray-600">${description}</div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-gray-50 rounded-lg p-3"><div class="font-semibold text-gray-700">最高気温</div><div class="text-red-500 text-lg">${tempMax}°C</div></div>
                <div class="bg-gray-50 rounded-lg p-3"><div class="font-semibold text-gray-700">最低気温</div><div class="text-blue-500 text-lg">${tempMin}°C</div></div>
                ${humidity ? `<div class="bg-gray-50 rounded-lg p-3"><div class="font-semibold text-gray-700">湿度</div><div class="text-blue-600 text-lg">${humidity}%</div></div>` : ''}
                ${windSpeed ? `<div class="bg-gray-50 rounded-lg p-3"><div class="font-semibold text-gray-700">風速</div><div class="text-gray-600 text-lg">${windSpeed}m/s</div></div>` : ''}
            </div>
        </div>
    `;
  modal.classList.remove('hidden');
}
function hideDayDetail() {
  const modal = document.getElementById('day-detail-modal');
  if (modal) modal.classList.add('hidden');
}
window.showDayDetail = showDayDetail;
window.hideDayDetail = hideDayDetail;
document.addEventListener('click', (e) => {
  const modal = document.getElementById('day-detail-modal');
  if (
    modal &&
    !modal.contains(e.target) &&
    !e.target.closest('[onclick^="showDayDetail"]')
  ) {
    hideDayDetail();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideDayDetail();
});

// 11. news.js
// ニュースフィード機能
let newsFeeds = [];
let newsItems = [];
let isLoading = false;
let lastUpdate = null;
let failedFeeds = new Set(); // 失敗したフィードを追跡

// プリセットフィード機能を削除

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
        enabled: true,
      },
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

// ニュースフィード追加機能を削除

// ニュースフィードを削除
function removeNewsFeed(feedId) {
  newsFeeds = newsFeeds.filter((feed) => feed.id !== feedId);
  saveNewsFeeds();
  // そのフィードのニュースアイテムも削除
  newsItems = newsItems.filter((item) => item.feedId !== feedId);
  saveNewsItems();
  failedFeeds.delete(feedId); // 失敗リストからも削除
  renderNews();
}

// ニュースフィードを有効/無効切り替え
function toggleNewsFeed(feedId) {
  const feed = newsFeeds.find((f) => f.id === feedId);
  if (feed) {
    feed.enabled = !feed.enabled;
    saveNewsFeeds();
    if (feed.enabled) {
      fetchNewsFromFeed(feed);
    } else {
      // 無効化されたフィードのニュースを非表示
      newsItems = newsItems.filter((item) => item.feedId !== feedId);
      saveNewsItems();
      failedFeeds.delete(feedId); // 失敗リストからも削除
      renderNews();
    }
  }
}

// すべてのニュースフィードからニュースを取得
async function fetchAllNews() {
  if (isLoading) return;

  isLoading = true;
  failedFeeds.clear(); // 失敗リストをクリア
  renderNews(); // 読み込み状態を表示

  try {
    newsItems = [];
    const enabledFeeds = newsFeeds.filter((feed) => feed.enabled);

    if (enabledFeeds.length === 0) {
      throw new Error('有効なニュースフィードがありません');
    }

    // 並列でフィードを取得（エラーが発生しても他のフィードは継続）
    const feedPromises = enabledFeeds.map((feed) =>
      fetchNewsFromFeed(feed).catch((error) => {
        console.error(`Failed to fetch from ${feed.name}:`, error);
        failedFeeds.add(feed.id);
        return null;
      })
    );

    await Promise.allSettled(feedPromises);

    saveNewsItems();
    lastUpdate = new Date();
    renderNews();

    // 成功/失敗の統計を表示
    const successCount = enabledFeeds.length - failedFeeds.size;
    const totalCount = enabledFeeds.length;

    if (failedFeeds.size === 0) {
      if (window.showToast) {
        window.showToast.success(
          `${totalCount}個のニュースフィードから更新しました`
        );
      }
    } else if (successCount > 0) {
      if (window.showToast) {
        window.showToast.warning(
          `${successCount}/${totalCount}個のフィードから更新しました（${failedFeeds.size}個失敗）`
        );
      }
    } else {
      if (window.showToast) {
        window.showToast.error(
          'すべてのニュースフィードでエラーが発生しました'
        );
      }
    }
  } catch (error) {
    console.error('Error fetching all news:', error);

    // エラーハンドラーを使用
    if (window.errorHandler) {
      window.errorHandler.handleError('News', error, {
        retry: false,
        showToast: true,
      });
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

    const response = await fetch(
      `/api/news?url=${encodeURIComponent(feed.url)}`
    );
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP ${response.status}: ${errorData.details || response.statusText}`
      );
    }
    const data = await response.json();

    console.log(
      `Successfully fetched ${data.items.length} items from ${feed.name}`
    );

    // 取得したニュースアイテムにフィード情報を追加
    const feedNews = data.items.map((item) => ({
      ...item,
      feedId: feed.id,
      feedName: feed.name,
    }));

    // 既存のアイテムと統合（重複を避ける）
    const existingIds = newsItems.map((item) => item.guid || item.link);
    const newItems = feedNews.filter(
      (item) => !existingIds.includes(item.guid || item.link)
    );

    newsItems.push(...newItems);

    // 成功したフィードを失敗リストから削除
    failedFeeds.delete(feed.id);
  } catch (error) {
    console.error(`Error fetching news from ${feed.name}:`, error);

    // エラーハンドラーを使用
    if (window.errorHandler) {
      window.errorHandler.handleError('NewsFeed', error, {
        retry: false,
        showToast: false, // 個別フィードのエラーは静かに処理
        context: feed.name,
      });
    }

    failedFeeds.add(feed.id);
    showNewsError(feed.name, error.message);
    throw error; // 上位で処理するために再スロー
  }
}

// ニュースエラー表示
function showNewsError(feedName, errorMessage) {
  const container = document.getElementById('news-container');
  if (!container) return;

  // エラーアイテムを追加
  const errorItem = {
    id: `error_${Date.now()}`,
    title: `${feedName}の取得に失敗しました`,
    link: '#',
    pubDate: new Date().toISOString(),
    feedName: feedName,
    isError: true,
    errorMessage: errorMessage,
  };

  // エラーアイテムを先頭に追加
  newsItems.unshift(errorItem);
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
        ${
          lastUpdate
            ? `
            <div class="text-xs text-gray-400 mb-3 text-center">
                <i class="fas fa-clock mr-1"></i>最終更新: ${lastUpdate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                ${failedFeeds.size > 0 ? `<span class="text-red-400 ml-2">(${failedFeeds.size}個のフィードでエラー)</span>` : ''}
            </div>
        `
            : ''
        }
        <div class="space-y-3">
            ${displayNews
              .map((item) => {
                // エラーアイテムの場合は特別な表示
                if (item.isError) {
                  return `
                        <div class="news-item bg-red-50 bg-opacity-90 rounded-lg p-4 border border-red-200 border-opacity-50">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex items-center">
                                    <span class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                                        <i class="fas fa-exclamation-triangle mr-1"></i>エラー
                                    </span>
                                    <span class="text-xs text-gray-500 ml-2">${formatDate(item.pubDate)}</span>
                                </div>
                            </div>
                            <div class="text-sm font-semibold text-red-700 mb-2">
                                ${item.title}
                            </div>
                            <div class="text-xs text-red-600">
                                ${item.errorMessage}
                            </div>
                            <div class="mt-2">
                                <button onclick="retryFailedFeed('${item.feedName}')"
                                        class="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition-colors">
                                    <i class="fas fa-sync-alt mr-1"></i>再試行
                                </button>
                            </div>
                        </div>
                    `;
                }

                // 通常のニュースアイテム
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
                        ${
                          item.contentSnippet
                            ? `
                            <p class="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">${item.contentSnippet}</p>
                        `
                            : ''
                        }
                    </div>
                `;
              })
              .join('')}
        </div>
        ${
          newsItems.length > 15
            ? `
            <div class="text-center mt-4">
                <span class="text-xs text-gray-400">最新の15件を表示中（全${newsItems.length}件）</span>
            </div>
        `
            : ''
        }
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
function initNews() {
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
  setupNewsRefresh();

  // 初回読み込み
  if (newsFeeds.length > 0) {
    fetchAllNews();
  } else {
    renderNews();
  }

  // 30分ごとに自動更新
  setInterval(
    () => {
      if (!isLoading && newsFeeds.length > 0) {
        fetchAllNews();
      }
    },
    30 * 60 * 1000
  );
}

// ニュースを手動で更新
function refreshNews() {
  if (isLoading) return;
  fetchAllNews();
}

// 失敗したフィードの再試行
function retryFailedFeed(feedName) {
  const feed = newsFeeds.find((f) => f.name === feedName);
  if (feed) {
    // エラーアイテムを削除
    newsItems = newsItems.filter(
      (item) => !(item.isError && item.feedName === feedName)
    );
    saveNewsItems();

    // フィードを再試行
    fetchNewsFromFeed(feed)
      .then(() => {
        renderNews();
        if (window.showToast) {
          window.showToast.success(`${feedName}の再試行が完了しました`);
        }
      })
      .catch(() => {
        renderNews();
      });
  }
}

// グローバル関数として公開
window.refreshNews = refreshNews;
window.openNewsInNewTab = openNewsInNewTab;

// 12. bookmarks.js
// ブックマーク管理
const bookmarksContainer = document.getElementById('bookmarks-container');
const addCategoryBtn = document.getElementById('add-category-btn');
const categoryModal = document.getElementById('category-modal');
const categoryNameInput = document.getElementById('category-name-input');
const saveCategoryBtn = document.getElementById('save-category-btn');
const cancelCategoryBtn = document.getElementById('cancel-category-btn');
const bookmarkModal = document.getElementById('bookmark-modal');
const bookmarkNameInput = document.getElementById('bookmark-name-input');
const bookmarkUrlInput = document.getElementById('bookmark-url-input');
const bookmarkCategorySelect = document.getElementById(
  'bookmark-category-select'
);
const saveBookmarkBtn = document.getElementById('save-bookmark-btn');
const cancelBookmarkBtn = document.getElementById('cancel-bookmark-btn');

// カテゴリー管理メニュー用の要素
const categorySettingsBtn = document.getElementById('category-settings-btn');
const categorySettingsModal = document.getElementById(
  'category-settings-modal'
);
const editCategoriesBtn = document.getElementById('edit-categories-btn');
const deleteCategoriesBtn = document.getElementById('delete-categories-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');

let categories = JSON.parse(localStorage.getItem('categories')) || [];
let currentCategoryIdForBookmark = null;

// カテゴリーアイコンのマッピング
const categoryIcons = {
  social: 'fas fa-users',
  work: 'fas fa-briefcase',
  entertainment: 'fas fa-gamepad',
  news: 'fas fa-newspaper',
  shopping: 'fas fa-shopping-cart',
  education: 'fas fa-graduation-cap',
  technology: 'fas fa-laptop',
  health: 'fas fa-heartbeat',
  finance: 'fas fa-chart-line',
  travel: 'fas fa-plane',
  food: 'fas fa-utensils',
  sports: 'fas fa-futbol',
  music: 'fas fa-music',
  video: 'fas fa-video',
  tools: 'fas fa-tools',
  default: 'fas fa-folder',
};

// URLパターンに基づくアイコンのマッピング
const urlIcons = {
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
  default: 'fas fa-globe',
};

// カテゴリー名からアイコンを取得
// function getCategoryIcon(categoryName) { // Already defined in utils.js
//   const lowerName = categoryName.toLowerCase();
//   for (const [key, icon] of Object.entries(categoryIcons)) {
//     if (lowerName.includes(key)) {
//       return icon;
//     }
//   }
//   return categoryIcons.default;
// }

// URLからアイコンを取得
// function getUrlIcon(url) { // Already defined in utils.js
//   const domain = new URL(url).hostname.toLowerCase();
//   for (const [pattern, icon] of Object.entries(urlIcons)) {
//     if (domain.includes(pattern)) {
//       return icon;
//     }
//   }
//   return urlIcons.default;
// }

// 改善されたFavicon表示用のHTML要素を作成
function createFaviconElement(url, bookmarkName) {
  const container = document.createElement('div');
  container.className = 'w-5 h-5 mr-3 flex-shrink-0 relative';

  // URLに基づくアイコンを取得
  const urlIcon = getUrlIcon(url);

  // デフォルトアイコン（Font Awesome）
  const defaultIcon = document.createElement('i');
  defaultIcon.className = `${urlIcon} text-gray-600 text-lg`;
  container.appendChild(defaultIcon);

  // 実際のFaviconを非同期で読み込み
  faviconService
    .getFavicon(url, 20)
    .then((faviconUrl) => {
      if (faviconUrl && !faviconUrl.startsWith('data:')) {
        const img = document.createElement('img');
        img.className = 'w-5 h-5 absolute top-0 left-0 rounded-sm';
        img.alt = `${bookmarkName} favicon`;
        img.loading = 'lazy';
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        img.onload = () => {
          img.style.opacity = '1';
          defaultIcon.style.display = 'none';
        };

        img.onerror = () => {
          // エラー時はデフォルトアイコンを維持
          img.remove();
        };

        img.src = faviconUrl;
        container.appendChild(img);
      }
    })


  return container;
}

// バッチ処理でFaviconを更新
async function refreshAllFavicons() {
  const allUrls = [];
  const urlToElement = new Map();

  // すべてのブックマークURLを収集
  categories.forEach((category) => {
    if (category.bookmarks) {
      category.bookmarks.forEach((bookmark) => {
        allUrls.push(bookmark.url);
        urlToElement.set(bookmark.url, bookmark);
      });
    }
  });

  if (allUrls.length === 0) return;

  // バッチ処理でFaviconを取得
  const faviconResults = await faviconService.getFaviconsBatch(allUrls, 20);

  // 結果をログに記録
  const stats = faviconService.getCacheStats();


  // 成功メッセージを表示
  if (window.showToast) {
    window.showToast.success(`${stats.cachedDomains}個のFaviconを更新しました`);
  }

  // ブックマーク表示を再描画
  renderCategories();
}

// グローバル関数として公開（開発者ツールから呼び出し可能）
window.refreshAllFavicons = refreshAllFavicons;
window.getFaviconStats = () => faviconService.getCacheStats();
window.clearFaviconCache = () => faviconService.clearCache();

function renderCategories() {
  bookmarksContainer.innerHTML = '';

  if (categories.length === 0) {
    bookmarksContainer.innerHTML = `
            <div class="text-center py-8 text-white">
                <p class="mb-4">No categories yet. Add your first category to get started!</p>
                <button id="first-category-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full">
                    <i class="fas fa-plus mr-2"></i> Add Category
                </button>
            </div>
        `;

    document
      .getElementById('first-category-btn')
      .addEventListener('click', () => {
        categoryModal.classList.remove('hidden');
        categoryModal.classList.add('flex');
      });

    return;
  }

  // カテゴリーを横並びにするためのコンテナを作成
  const categoriesGrid = document.createElement('div');
  // カテゴリが7つ以上ある場合はスクロール可能にする
  const shouldScrollCategories = categories.length > 6;
  // 6つのカテゴリが表示される高さ（約2行分）でスクロール設定
  categoriesGrid.className = `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${shouldScrollCategories ? 'max-h-[calc(2*theme(spacing.96)+theme(spacing.6))] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200' : ''}`;

  categories.forEach((category) => {
    const categoryElement = document.createElement('div');
    categoryElement.className =
      'category-item bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20';
    categoryElement.dataset.categoryId = category.id;

    const categoryHeader = document.createElement('div');
    categoryHeader.className = 'flex justify-between items-center mb-3';

    const categoryTitle = document.createElement('h3');
    categoryTitle.className =
      'text-lg font-semibold text-white flex items-center';

    // カテゴリー名に基づくアイコンを取得
    const categoryIcon = getCategoryIcon(category.name);
    categoryTitle.innerHTML = `
            <i class="${categoryIcon} mr-2 text-blue-300"></i>
            ${category.name}
        `;

    const categoryActions = document.createElement('div');
    categoryActions.className =
      'flex space-x-2 category-actions transition-opacity duration-200';

    const addBookmarkBtn = document.createElement('button');
    addBookmarkBtn.className =
      'bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center';
    addBookmarkBtn.innerHTML = '<i class="fas fa-plus mr-1"></i> Add';
    addBookmarkBtn.addEventListener('click', () => {
      currentCategoryIdForBookmark = category.id;
      bookmarkCategorySelect.innerHTML = '';
      categories.forEach((cat) => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        if (cat.id === category.id) option.selected = true;
        bookmarkCategorySelect.appendChild(option);
      });
      bookmarkNameInput.value = '';
      bookmarkUrlInput.value = '';
      bookmarkModal.classList.remove('hidden');
      bookmarkModal.classList.add('flex');
    });

    categoryActions.appendChild(addBookmarkBtn);

    categoryHeader.appendChild(categoryTitle);
    categoryHeader.appendChild(categoryActions);

    const bookmarksList = document.createElement('div');
    // ブックマークが4つ以上ある場合はスクロール可能にする
    const shouldScroll = category.bookmarks && category.bookmarks.length > 3;
    bookmarksList.className = `space-y-2 ${shouldScroll ? 'max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200' : ''}`;

    if (category.bookmarks && category.bookmarks.length > 0) {
      category.bookmarks.forEach((bookmark) => {
        const bookmarkElement = document.createElement('div');
        bookmarkElement.className =
          'bg-white bg-opacity-70 hover:bg-opacity-90 rounded-lg p-3 transition-all duration-200 bookmark-item relative group cursor-pointer';

        // カード全体のクリックイベントを追加
        bookmarkElement.addEventListener('click', (e) => {
          // 編集・削除ボタンがクリックされた場合はリンクを開かない
          if (e.target.closest('.bookmark-actions')) {
            return;
          }
          // 新しいタブでリンクを開く
          window.open(bookmark.url, '_blank');
        });

        const bookmarkLink = document.createElement('a');
        bookmarkLink.href = bookmark.url;
        bookmarkLink.target = '_blank';
        bookmarkLink.className = 'block';

        // Faviconとタイトルを横並びで表示
        const bookmarkHeader = document.createElement('div');
        bookmarkHeader.className = 'flex items-center mb-2';

        // 改善されたFaviconを追加
        const faviconElement = createFaviconElement(
          bookmark.url,
          bookmark.name
        );
        bookmarkHeader.appendChild(faviconElement);

        const bookmarkContent = document.createElement('div');
        bookmarkContent.className = 'flex-1 min-w-0';

        const bookmarkTitle = document.createElement('div');
        bookmarkTitle.className = 'font-medium text-gray-800 truncate text-sm';
        bookmarkTitle.textContent = bookmark.name;
        bookmarkContent.appendChild(bookmarkTitle);

        bookmarkHeader.appendChild(bookmarkContent);

        const bookmarkActions = document.createElement('div');
        bookmarkActions.className =
          'absolute top-2 right-2 flex space-x-1 bookmark-actions opacity-0 group-hover:opacity-100 transition-opacity duration-200';

        const editBookmarkBtn = document.createElement('button');
        editBookmarkBtn.className =
          'bg-blue-500 hover:bg-blue-600 text-white px-1 py-1 rounded text-xs';
        editBookmarkBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBookmarkBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // カード全体のクリックイベントを防ぐ
          currentCategoryIdForBookmark = category.id;
          bookmarkNameInput.value = bookmark.name;
          bookmarkUrlInput.value = bookmark.url;

          bookmarkCategorySelect.innerHTML = '';
          categories.forEach((cat) => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            if (cat.id === category.id) option.selected = true;
            bookmarkCategorySelect.appendChild(option);
          });

          bookmarkModal.classList.remove('hidden');
          bookmarkModal.classList.add('flex');

          // 編集時は一時的にイベントリスナーを削除して新しいものを追加
          const originalClickHandler = saveBookmarkBtn.onclick;
          saveBookmarkBtn.onclick = function () {
            if (
              bookmarkNameInput.value.trim() &&
              bookmarkUrlInput.value.trim()
            ) {
              bookmark.name = bookmarkNameInput.value.trim();
              bookmark.url = bookmarkUrlInput.value.trim();

              // If category changed, move bookmark
              const newCategoryId = bookmarkCategorySelect.value;
              if (newCategoryId !== category.id) {
                // Remove from old category
                category.bookmarks = category.bookmarks.filter(
                  (b) => b.id !== bookmark.id
                );

                // Add to new category
                const newCategory = categories.find(
                  (c) => c.id === newCategoryId
                );
                if (newCategory) {
                  if (!newCategory.bookmarks) newCategory.bookmarks = [];
                  newCategory.bookmarks.push(bookmark);
                }
              }

              saveCategories();
              renderCategories();
              bookmarkModal.classList.add('hidden');
              bookmarkModal.classList.remove('flex');

              // Reset form
              bookmarkNameInput.value = '';
              bookmarkUrlInput.value = '';

              // Restore original handler
              saveBookmarkBtn.onclick = originalClickHandler;
            }
          };
        });

        const deleteBookmarkBtn = document.createElement('button');
        deleteBookmarkBtn.className =
          'bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded text-xs';
        deleteBookmarkBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBookmarkBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation(); // カード全体のクリックイベントを防ぐ
          if (confirm(`Delete bookmark "${bookmark.name}"?`)) {
            category.bookmarks = category.bookmarks.filter(
              (b) => b.id !== bookmark.id
            );
            saveCategories();
            renderCategories();
          }
        });

        bookmarkActions.appendChild(editBookmarkBtn);
        bookmarkActions.appendChild(deleteBookmarkBtn);

        bookmarkLink.appendChild(bookmarkHeader);
        bookmarkLink.appendChild(bookmarkTitle);
        bookmarkElement.appendChild(bookmarkLink);
        bookmarkElement.appendChild(bookmarkActions);
        bookmarksList.appendChild(bookmarkElement);
      });
    } else {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'text-gray-500 text-sm italic text-center py-4';
      emptyMessage.textContent =
        'No bookmarks yet. Click "Add Bookmark" to add one.';
      bookmarksList.appendChild(emptyMessage);
    }

    categoryElement.appendChild(categoryHeader);
    categoryElement.appendChild(bookmarksList);
    categoriesGrid.appendChild(categoryElement);
  });

  bookmarksContainer.appendChild(categoriesGrid);
}

function setupBookmarkEvents() {
  // カテゴリー管理メニューボタン
  if (categorySettingsBtn) {
    categorySettingsBtn.addEventListener('click', () => {
      categorySettingsModal.classList.remove('hidden');
      categorySettingsModal.classList.add('flex');
    });
  }

  // カテゴリー管理メニューの各ボタン
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => {
      categorySettingsModal.classList.add('hidden');
      categorySettingsModal.classList.remove('flex');
      categoryNameInput.value = '';
      categoryModal.classList.remove('hidden');
      categoryModal.classList.add('flex');
    });
  }

  if (editCategoriesBtn) {
    editCategoriesBtn.addEventListener('click', () => {
      categorySettingsModal.classList.add('hidden');
      categorySettingsModal.classList.remove('flex');
      showEditCategoriesModal();
    });
  }

  if (deleteCategoriesBtn) {
    deleteCategoriesBtn.addEventListener('click', () => {
      categorySettingsModal.classList.add('hidden');
      categorySettingsModal.classList.remove('flex');
      showDeleteCategoriesModal();
    });
  }

  if (closeSettingsBtn) {
    closeSettingsBtn.addEventListener('click', () => {
      categorySettingsModal.classList.add('hidden');
      categorySettingsModal.classList.remove('flex');
    });
  }

  // Category modal
  saveCategoryBtn.addEventListener('click', () => {
    if (categoryNameInput.value.trim()) {
      const newCategory = {
        id: Date.now().toString(),
        name: categoryNameInput.value.trim(),
        bookmarks: [],
      };
      categories.push(newCategory);
      saveCategories();
      renderCategories();
      categoryModal.classList.add('hidden');
      categoryModal.classList.remove('flex');

      // 保存完了メッセージを表示
      if (window.showToast) {
        window.showToast.success(
          `カテゴリ「${newCategory.name}」を追加しました`
        );
      }
    }
  });

  cancelCategoryBtn.addEventListener('click', () => {
    categoryModal.classList.add('hidden');
    categoryModal.classList.remove('flex');
  });

  // Bookmark modal - 新規追加用
  saveBookmarkBtn.addEventListener('click', () => {
    if (bookmarkNameInput.value.trim() && bookmarkUrlInput.value.trim()) {
      const url = bookmarkUrlInput.value.trim();
      const validUrl =
        url.startsWith('http://') || url.startsWith('https://')
          ? url
          : `https://${url}`;

      const newBookmark = {
        id: Date.now().toString(),
        name: bookmarkNameInput.value.trim(),
        url: validUrl,
      };

      const categoryId = bookmarkCategorySelect.value;
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        if (!category.bookmarks) category.bookmarks = [];
        category.bookmarks.push(newBookmark);
        saveCategories();
        renderCategories();
        bookmarkModal.classList.add('hidden');
        bookmarkModal.classList.remove('flex');

        // Reset form
        bookmarkNameInput.value = '';
        bookmarkUrlInput.value = '';

        // 保存完了メッセージを表示
        if (window.showToast) {
          window.showToast.success(
            `ブックマーク「${newBookmark.name}」を追加しました`
          );
        }
      }
    }
  });

  cancelBookmarkBtn.addEventListener('click', () => {
    bookmarkModal.classList.add('hidden');
    bookmarkModal.classList.remove('flex');
    // Reset form
    bookmarkNameInput.value = '';
    bookmarkUrlInput.value = '';
  });

  // Close modals when clicking outside
  [categoryModal, bookmarkModal, categorySettingsModal].forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        // Reset bookmark form when closing
        if (modal === bookmarkModal) {
          bookmarkNameInput.value = '';
          bookmarkUrlInput.value = '';
        }
      }
    });
  });
}

// カテゴリー編集モーダルを表示
function showEditCategoriesModal() {
  if (categories.length === 0) {
    alert('編集するカテゴリーがありません。');
    return;
  }

  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20';
  modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">カテゴリーを編集</h3>
            <div class="space-y-3">
                ${categories
                  .map(
                    (category) => `
                    <div class="flex items-center space-x-2">
                        <input type="text" value="${category.name}"
                               class="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                               data-category-id="${category.id}">
                        <button class="save-edit-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                                data-category-id="${category.id}">
                            保存
                        </button>
                    </div>
                `
                  )
                  .join('')}
            </div>
            <div class="flex justify-end mt-4">
                <button class="close-edit-modal px-4 py-2 text-gray-600 hover:text-gray-800">閉じる</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // 保存ボタンのイベント
  modal.querySelectorAll('.save-edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const categoryId = btn.dataset.categoryId;
      const input = modal.querySelector(
        `input[data-category-id="${categoryId}"]`
      );
      const newName = input.value.trim();

      if (newName) {
        const category = categories.find((c) => c.id === categoryId);
        if (category) {
          category.name = newName;
          saveCategories();
          renderCategories();
          if (window.showToast) {
            window.showToast.success(`カテゴリ「${newName}」を更新しました`);
          }
        }
      }
    });
  });

  // 閉じるボタンのイベント
  modal.querySelector('.close-edit-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 外側クリックで閉じる
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// カテゴリー削除モーダルを表示
function showDeleteCategoriesModal() {
  if (categories.length === 0) {
    alert('削除するカテゴリーがありません。');
    return;
  }

  const modal = document.createElement('div');
  modal.className =
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20';
  modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h3 class="text-xl font-bold mb-4 text-red-600">カテゴリーを削除</h3>
            <p class="text-sm text-gray-600 mb-4">削除すると、そのカテゴリー内のすべてのブックマークも削除されます。</p>
            <div class="space-y-2">
                ${categories
                  .map(
                    (category) => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div>
                            <div class="font-medium">${category.name}</div>
                            <div class="text-sm text-gray-500">${category.bookmarks ? category.bookmarks.length : 0}個のブックマーク</div>
                        </div>
                        <button class="delete-category-btn bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                data-category-id="${category.id}" data-category-name="${category.name}">
                            削除
                        </button>
                    </div>
                `
                  )
                  .join('')}
            </div>
            <div class="flex justify-end mt-4">
                <button class="close-delete-modal px-4 py-2 text-gray-600 hover:text-gray-800">閉じる</button>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // 削除ボタンのイベント
  modal.querySelectorAll('.delete-category-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const categoryId = btn.dataset.categoryId;
      const categoryName = btn.dataset.categoryName;

      if (
        confirm(
          `カテゴリ「${categoryName}」とその中のすべてのブックマークを削除しますか？`
        )
      ) {
        categories = categories.filter((c) => c.id !== categoryId);
        saveCategories();
        renderCategories();
        if (window.showToast) {
          window.showToast.success(`カテゴリ「${categoryName}」を削除しました`);
        }
        // 削除されたカテゴリーの要素を削除
        btn.closest('.flex').remove();
      }
    });
  });

  // 閉じるボタンのイベント
  modal.querySelector('.close-delete-modal').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // 外側クリックで閉じる
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function saveCategories() {
  localStorage.setItem('categories', JSON.stringify(categories));
}

// 13. mail.js
// メールウィジェット機能
class MailWidget {
  constructor() {
    this.container = null;
    this.unreadCount = 0;
    this.recentEmails = [];
    this.isInitialized = false;
    this.refreshInterval = null;
    this.init();
  }

  init() {
    this.createWidget();
    this.loadSettings();
    this.setupEventListeners();
    this.startAutoRefresh();
  }

  createWidget() {
    // メールウィジェットのHTMLを作成
    const mailWidgetHTML = `
            <div class="blur-bg rounded-xl p-4 text-white">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center">
                        <i class="fas fa-envelope text-2xl mr-3"></i>
                        <h3 class="text-lg font-semibold">メール</h3>
                        <span id="mail-unread-badge" class="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full hidden">0</span>
                    </div>
                    <div class="flex space-x-2">
                        <button id="refresh-mail-btn" class="text-blue-400 hover:text-blue-300" title="更新">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button id="mail-settings-btn" class="text-blue-400 hover:text-blue-300" title="設定">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>

                <div id="mail-content">
                    <div id="mail-loading" class="text-center py-4">
                        <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                        <p class="text-sm">メールを読み込み中...</p>
                    </div>

                    <div id="mail-list" class="space-y-2 max-h-48 overflow-y-auto hidden">
                        <!-- メールリストがここに表示されます -->
                    </div>

                    <div id="mail-error" class="text-center py-4 hidden">
                        <i class="fas fa-exclamation-triangle text-2xl mb-2 text-yellow-400"></i>
                        <p class="text-sm">メールの取得に失敗しました</p>
                        <button id="retry-mail-btn" class="mt-2 text-blue-400 hover:text-blue-300 text-sm">
                            再試行
                        </button>
                    </div>

                    <div id="mail-setup" class="text-center py-4 hidden">
                        <i class="fas fa-envelope-open text-2xl mb-2 text-gray-400"></i>
                        <p class="text-sm mb-2">Gmailアカウントを設定してください</p>
                        <button id="setup-gmail-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            Gmail設定
                        </button>
                    </div>
                </div>
            </div>
        `;

    // 左カラムにメールウィジェットを追加
    const leftColumn = document.querySelector('.left-column');
    if (leftColumn) {
      // 既存のウィジェットの後に追加
      leftColumn.insertAdjacentHTML('beforeend', mailWidgetHTML);
      this.container = leftColumn.lastElementChild;
    }
  }

  loadSettings() {
    const settings = JSON.parse(localStorage.getItem('mailSettings') || '{}');
    this.settings = {
      gmailAccount: settings.gmailAccount || '',
      refreshInterval: settings.refreshInterval || 5, // 分
      maxEmails: settings.maxEmails || 5,
      showUnreadOnly: settings.showUnreadOnly || false,
      ...settings,
    };
  }

  setupEventListeners() {
    // 更新ボタン
    document
      .getElementById('refresh-mail-btn')
      ?.addEventListener('click', () => {
        this.fetchEmails();
      });

    // 設定ボタン
    document
      .getElementById('mail-settings-btn')
      ?.addEventListener('click', () => {
        this.showSettingsModal();
      });

    // 再試行ボタン
    document.getElementById('retry-mail-btn')?.addEventListener('click', () => {
      this.fetchEmails();
    });

    // Gmail設定ボタン
    document
      .getElementById('setup-gmail-btn')
      ?.addEventListener('click', () => {
        this.showSettingsModal();
      });

    // メール設定モーダルのイベントハンドラー
    document
      .getElementById('cancel-mail-settings-btn')
      ?.addEventListener('click', () => {
        this.hideSettingsModal();
      });

    document
      .getElementById('save-mail-settings-btn')
      ?.addEventListener('click', () => {
        this.saveSettingsFromForm();
      });

    // モーダル外クリックで閉じる
    document
      .getElementById('mail-settings-modal')
      ?.addEventListener('click', (e) => {
        if (e.target.id === 'mail-settings-modal') {
          this.hideSettingsModal();
        }
      });
  }

  startAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    this.refreshInterval = setInterval(
      () => {
        if (this.settings.gmailAccount) {
          this.fetchEmails();
        }
      },
      this.settings.refreshInterval * 60 * 1000
    );
  }

  async fetchEmails() {
    if (!this.settings.gmailAccount) {
      this.showSetupMessage();
      return;
    }

    this.showLoading();

    try {
      // Gmail APIを使用してメールを取得
      const response = await fetch('/api/gmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: this.settings.gmailAccount,
          maxResults: this.settings.maxEmails,
          unreadOnly: this.settings.showUnreadOnly,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      this.recentEmails = data.emails || [];
      this.unreadCount = data.unreadCount || 0;

      this.displayEmails();
      this.updateUnreadBadge();
    } catch (error) {
      console.error('メール取得エラー:', error);
      this.showError();
    }
  }

  displayEmails() {
    const mailList = document.getElementById('mail-list');
    const mailLoading = document.getElementById('mail-loading');
    const mailError = document.getElementById('mail-error');
    const mailSetup = document.getElementById('mail-setup');

    // すべての状態を非表示
    mailLoading.classList.add('hidden');
    mailError.classList.add('hidden');
    mailSetup.classList.add('hidden');

    if (this.recentEmails.length === 0) {
      mailList.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-inbox text-2xl mb-2 text-gray-400"></i>
                    <p class="text-sm text-gray-300">メールがありません</p>
                </div>
            `;
      mailList.classList.remove('hidden');
      return;
    }

    const emailsHTML = this.recentEmails
      .map(
        (email) => `
            <div class="mail-item bg-white bg-opacity-10 rounded p-2 cursor-pointer hover:bg-opacity-20 transition-all"
                 onclick="window.open('https://mail.google.com/mail/u/0/#inbox/${email.id}', '_blank')">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center mb-1">
                            <span class="font-medium text-sm truncate">${this.escapeHtml(email.from)}</span>
                            ${email.unread ? '<span class="ml-2 w-2 h-2 bg-blue-400 rounded-full"></span>' : ''}
                        </div>
                        <div class="text-xs text-gray-300 truncate">${this.escapeHtml(email.subject)}</div>
                        <div class="text-xs text-gray-400 mt-1">${this.formatDate(email.date)}</div>
                    </div>
                    ${email.hasAttachment ? '<i class="fas fa-paperclip text-xs text-gray-400 ml-2"></i>' : ''}
                </div>
            </div>
        `
      )
      .join('');

    mailList.innerHTML = emailsHTML;
    mailList.classList.remove('hidden');
  }

  updateUnreadBadge() {
    const badge = document.getElementById('mail-unread-badge');
    if (this.unreadCount > 0) {
      badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }

  showLoading() {
    document.getElementById('mail-loading').classList.remove('hidden');
    document.getElementById('mail-list').classList.add('hidden');
    document.getElementById('mail-error').classList.add('hidden');
    document.getElementById('mail-setup').classList.add('hidden');
  }

  showError() {
    document.getElementById('mail-loading').classList.add('hidden');
    document.getElementById('mail-list').classList.add('hidden');
    document.getElementById('mail-error').classList.remove('hidden');
    document.getElementById('mail-setup').classList.add('hidden');
  }

  showSetupMessage() {
    document.getElementById('mail-loading').classList.add('hidden');
    document.getElementById('mail-list').classList.add('hidden');
    document.getElementById('mail-error').classList.add('hidden');
    document.getElementById('mail-setup').classList.remove('hidden');
  }

  showSettingsModal() {
    // メール設定モーダルを表示
    const modal = document.getElementById('mail-settings-modal');
    if (modal) {
      modal.classList.remove('hidden');
      this.populateSettingsForm();
    }
  }

  hideSettingsModal() {
    // メール設定モーダルを非表示
    const modal = document.getElementById('mail-settings-modal');
    if (modal) {
      modal.classList.add('hidden');
    }
  }

  populateSettingsForm() {
    const form = document.getElementById('mail-settings-form');
    if (form) {
      form.gmailAccount.value = this.settings.gmailAccount;
      form.refreshInterval.value = this.settings.refreshInterval;
      form.maxEmails.value = this.settings.maxEmails;
      form.showUnreadOnly.checked = this.settings.showUnreadOnly;
    }
  }

  saveSettings(formData) {
    this.settings = {
      gmailAccount: formData.gmailAccount,
      refreshInterval: parseInt(formData.refreshInterval),
      maxEmails: parseInt(formData.maxEmails),
      showUnreadOnly: formData.showUnreadOnly === 'on',
    };

    localStorage.setItem('mailSettings', JSON.stringify(this.settings));
    this.startAutoRefresh();

    if (this.settings.gmailAccount) {
      this.fetchEmails();
    } else {
      this.showSetupMessage();
    }
  }

  saveSettingsFromForm() {
    const form = document.getElementById('mail-settings-form');
    if (form) {
      const formData = {
        gmailAccount: form.gmailAccount.value,
        refreshInterval: form.refreshInterval.value,
        maxEmails: form.maxEmails.value,
        showUnreadOnly: form.showUnreadOnly.checked,
      };

      this.saveSettings(formData);
      this.hideSettingsModal();

      // 成功メッセージを表示
      if (window.showToast) {
        window.showToast('メール設定を保存しました', 'success');
      }
    }
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return '今';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}時間前`;
    } else if (diffInHours < 48) {
      return '昨日';
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'short',
        day: 'numeric',
      });
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // 通知機能
  showNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: '/favicon.ico',
      });
    }
  }

  // 初期化時にメールを取得
  initialize() {
    if (!this.isInitialized) {
      this.isInitialized = true;
      this.fetchEmails();
    }
  }
}

// メールウィジェットのインスタンスを作成
// const mailWidget = new MailWidget();

// ページ読み込み完了後に初期化
// document.addEventListener('DOMContentLoaded', () => {
//   mailWidget.initialize();
// });

// 14. notes.js
// メモ帳管理


// 15. shortcuts.js
// キーボードショートカット機能
class Shortcuts {
  constructor() {
    this.shortcuts = {
      'Ctrl+Shift+S': {
        action: 'search',
        description: '検索ボックスにフォーカス',
      },
      'Ctrl+Shift+B': { action: 'bookmark', description: 'ブックマーク追加' },
      'Ctrl+Shift+T': { action: 'todo', description: 'ToDo入力' },
      'Ctrl+Shift+N': { action: 'note', description: 'メモ保存' },
      'Ctrl+Shift+R': { action: 'refresh', description: 'ニュース更新' },
      'Ctrl+Shift+W': { action: 'weather', description: '天気更新' },
      'Ctrl+Shift+H': { action: 'help', description: 'ショートカット一覧表示' },
      'Ctrl+Shift+E': { action: 'theme', description: 'テーマ切り替え' },
    };
    this.init();
  }

  // 初期化
  init() {
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.createHelpModal();
  }

  // キー入力処理
  handleKeydown(e) {
    const key = this.getKeyCombo(e);
    const shortcut = this.shortcuts[key];

    if (shortcut) {
      e.preventDefault();
      this.executeAction(shortcut.action);
    }
  }

  // キーコンボを取得
  getKeyCombo(e) {
    const keys = [];
    if (e.ctrlKey) keys.push('Ctrl');
    if (e.shiftKey) keys.push('Shift');
    if (e.altKey) keys.push('Alt');
    if (e.key && e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt') {
      keys.push(e.key.toUpperCase());
    }
    return keys.join('+');
  }

  // アクション実行
  executeAction(action) {
    switch (action) {
      case 'search':
        document.getElementById('search-input').focus();
        break;
      case 'bookmark':
        this.addBookmark();
        break;
      case 'todo':
        this.addTodo();
        break;
      case 'note':
        // this.saveNote(); // メモ機能は削除されました
        if (window.showToast) {
          window.showToast.info('メモ機能は現在無効です。');
        }
        break;
      case 'refresh':
        this.refreshNews();
        break;
      case 'weather':
        this.refreshWeather();
        break;
      case 'help':
        this.showHelpModal();
        break;
      case 'theme':
        this.toggleTheme();
        break;
    }
  }

  // ブックマーク追加
  addBookmark() {
    const url = prompt('URLを入力してください:');
    if (url) {
      const title = prompt('タイトルを入力してください:');
      if (title) {
        const category =
          prompt('カテゴリを入力してください（省略可）:') || 'その他';

        // ブックマーク追加処理
        // Assuming setupBookmarkEvents and saveCategories are accessible
        const newBookmark = {
          id: Date.now().toString(),
          name: title.trim(),
          url: url.trim(),
        };
        let targetCategory = categories.find(c => c.name === category);
        if (!targetCategory) {
          targetCategory = { id: Date.now().toString(), name: category, bookmarks: [] };
          categories.push(targetCategory);
        }
        if (!targetCategory.bookmarks) targetCategory.bookmarks = [];
        targetCategory.bookmarks.push(newBookmark);
        saveCategories();
        renderCategories();
        if (window.showToast) {
          window.showToast.success(`ブックマーク「${newBookmark.name}」を追加しました`);
        }
      }
    }
  }

  // ToDo追加
  addTodo() {
    const text = prompt('ToDoを入力してください:');
    if (text) {
      // ToDo追加処理
      // This functionality is not present in the original files, so it will be a no-op or require new implementation.
      // For now, just show a toast.
      if (window.showToast) {
        window.showToast.info('ToDo機能は現在開発中です。');
      }
    }
  }

  // メモ保存
  saveNote() {
    const textarea = document.getElementById('notes-area'); // Corrected ID from original notes.js
    if (textarea) {
      textarea.focus();
      // Saving logic is handled by notes.js setupNotesEvents
      if (window.showToast) {
        window.showToast.success('メモを保存しました');
      }
    }
  }

  // ニュース更新
  refreshNews() {
    if (window.refreshNews) {
      window.refreshNews();
    }
  }

  // 天気更新
  refreshWeather() {
    if (window.refreshWeather) {
      window.refreshWeather();
    }
  }

  // テーマ切り替え
  toggleTheme() {
    if (window.themeManager) {
      window.themeManager.toggleTheme();
    }
  }

  // ヘルプモーダル表示
  showHelpModal() {
    const modal = document.getElementById('shortcuts-modal');
    if (modal) {
      modal.classList.remove('hidden');
    }
  }

  // ヘルプモーダル作成
  createHelpModal() {
    const modal = document.createElement('div');
    modal.id = 'shortcuts-modal';
    modal.className =
      'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';

    modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-gray-800">キーボードショートカット</h2>
                    <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('#shortcuts-modal').classList.add('hidden')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="space-y-2">
                    ${Object.entries(this.shortcuts)
                      .map(
                        ([key, shortcut]) => `
                        <div class="flex justify-between items-center py-2 border-b border-gray-200">
                            <span class="text-sm text-gray-600">${shortcut.description}</span>
                            <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">${key}</kbd>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            </div>
        `;

    document.body.appendChild(modal);

    // モーダル外クリックで閉じる
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  }
}

// グローバル関数として公開
window.shortcuts = new Shortcuts();

// 16. app.js (main initialization logic)
function init() {
  try {
    // 各モジュールの初期化
    updateClock();
    setInterval(updateClock, 1000);
    loadBackgroundImage();
    renderCategories();

    initNews();
    initWeather();
    setupSearchBox();
    setupBookmarkEvents();
    // setupNotesEvents(); // Initialize notes events

    // 成功メッセージを表示
    if (window.showToast) {
      window.showToast.success('アプリケーションが正常に起動しました', 2000);
    }
  } catch (error) {
    // エラーハンドラーを使用
    if (window.errorHandler) {
      window.errorHandler.handleError('AppInit', error, {
        retry: false,
        showModal: true,
      });
    }
  }
}

// ページ読み込み完了時の初期化
document.addEventListener('DOMContentLoaded', init);
