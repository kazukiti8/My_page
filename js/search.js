// 検索エンジンの設定
const SEARCH_ENGINES = {
    google: {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        icon: 'fab fa-google',
        placeholder: 'Googleで検索...'
    },
    bing: {
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
        icon: 'fab fa-microsoft',
        placeholder: 'Bingで検索...'
    },
    yahoo: {
        name: 'Yahoo!',
        url: 'https://search.yahoo.co.jp/search?p=',
        icon: 'fas fa-yahoo',
        placeholder: 'Yahoo!で検索...'
    },
    duckduckgo: {
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com/?q=',
        icon: 'fas fa-duck',
        placeholder: 'DuckDuckGoで検索...'
    },
    youtube: {
        name: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=',
        icon: 'fab fa-youtube',
        placeholder: 'YouTubeで検索...'
    },
    github: {
        name: 'GitHub',
        url: 'https://github.com/search?q=',
        icon: 'fab fa-github',
        placeholder: 'GitHubで検索...'
    }
};

// 現在選択されている検索エンジン
let currentSearchEngine = localStorage.getItem('searchEngine') || 'google';

// 検索窓の管理
const searchInput = document.getElementById('search-input');
const searchEngineSelector = document.getElementById('search-engine-selector');

// 検索を実行
function performSearch(query) {
    if (query.trim()) {
        const engine = SEARCH_ENGINES[currentSearchEngine];
        const searchUrl = engine.url + encodeURIComponent(query.trim());
        window.open(searchUrl, '_blank');
    }
}

// 検索エンジンを変更
function changeSearchEngine(engineKey) {
    currentSearchEngine = engineKey;
    localStorage.setItem('searchEngine', engineKey);
    
    const engine = SEARCH_ENGINES[engineKey];
    searchInput.placeholder = engine.placeholder;
    
    // 検索エンジンセレクターの表示を更新
    updateSearchEngineSelector();
    
    // 成功メッセージを表示
    if (window.showToast) {
        window.showToast.success(`${engine.name}に切り替えました`);
    }
}

// 検索エンジンセレクターの表示を更新
function updateSearchEngineSelector() {
    if (!searchEngineSelector) return;
    
    const engine = SEARCH_ENGINES[currentSearchEngine];
    searchEngineSelector.innerHTML = `
        <i class="${engine.icon} mr-2"></i>
        <span class="hidden sm:inline">${engine.name}</span>
        <i class="fas fa-chevron-down ml-1 text-xs"></i>
    `;
}

// 検索エンジン選択モーダルを表示
function showSearchEngineModal() {
    const modal = document.getElementById('search-engine-modal');
    if (!modal) return;
    
    const engineList = modal.querySelector('#search-engine-list');
    engineList.innerHTML = '';
    
    Object.entries(SEARCH_ENGINES).forEach(([key, engine]) => {
        const engineItem = document.createElement('div');
        engineItem.className = `flex items-center p-3 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors ${key === currentSearchEngine ? 'bg-blue-50 border border-blue-200' : ''}`;
        engineItem.innerHTML = `
            <i class="${engine.icon} text-xl mr-3 ${key === currentSearchEngine ? 'text-blue-600' : 'text-gray-600'}"></i>
            <span class="flex-1 font-medium ${key === currentSearchEngine ? 'text-blue-600' : 'text-gray-800'}">${engine.name}</span>
            ${key === currentSearchEngine ? '<i class="fas fa-check text-blue-600"></i>' : ''}
        `;
        engineItem.addEventListener('click', () => {
            changeSearchEngine(key);
            hideSearchEngineModal();
        });
        engineList.appendChild(engineItem);
    });
    
    modal.classList.remove('hidden');
}

// 検索エンジン選択モーダルを非表示
function hideSearchEngineModal() {
    const modal = document.getElementById('search-engine-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

export function setupSearchBox() {
    // 初期の検索エンジンを設定
    updateSearchEngineSelector();
    
    // Enterキーのイベントリスナー
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // 検索エンジンセレクターのクリックイベント
    if (searchEngineSelector) {
        searchEngineSelector.addEventListener('click', showSearchEngineModal);
    }
    
    // モーダル外クリックで閉じる
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('search-engine-modal');
        if (modal && !modal.contains(e.target) && !searchEngineSelector.contains(e.target)) {
            hideSearchEngineModal();
        }
    });
    
    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideSearchEngineModal();
        }
    });
} 