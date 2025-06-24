// 検索エンジンの定義
const searchEngines = {
    'google': {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        icon: 'fab fa-google',
        color: 'text-blue-600'
    },
    'yahoo': {
        name: 'Yahoo!',
        url: 'https://search.yahoo.co.jp/search?p=',
        icon: 'fab fa-yahoo',
        color: 'text-purple-600'
    },
    'bing': {
        name: 'Bing',
        url: 'https://www.bing.com/search?q=',
        icon: 'fab fa-microsoft',
        color: 'text-blue-500'
    },
    'duckduckgo': {
        name: 'DuckDuckGo',
        url: 'https://duckduckgo.com/?q=',
        icon: 'fas fa-duck',
        color: 'text-yellow-600'
    },
    'youtube': {
        name: 'YouTube',
        url: 'https://www.youtube.com/results?search_query=',
        icon: 'fab fa-youtube',
        color: 'text-red-600'
    },
    'github': {
        name: 'GitHub',
        url: 'https://github.com/search?q=',
        icon: 'fab fa-github',
        color: 'text-gray-800'
    }
};

// 現在選択されている検索エンジン
let currentSearchEngine = localStorage.getItem('selectedSearchEngine') || 'google';

// 検索窓の管理
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

// 検索エンジン選択ドロップダウンを作成
function createSearchEngineDropdown() {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'absolute left-3 top-1/2 transform -translate-y-1/2 z-10';
    
    const dropdownButton = document.createElement('button');
    dropdownButton.id = 'search-engine-dropdown';
    dropdownButton.className = 'text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-transparent border-none p-0';
    dropdownButton.innerHTML = `<i class="${searchEngines[currentSearchEngine].icon} ${searchEngines[currentSearchEngine].color} text-lg"></i>`;
    dropdownButton.title = `検索エンジン: ${searchEngines[currentSearchEngine].name}`;
    
    const dropdownMenu = document.createElement('div');
    dropdownMenu.id = 'search-engine-menu';
    dropdownMenu.className = 'absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 hidden min-w-48';
    
    Object.entries(searchEngines).forEach(([key, engine]) => {
        const menuItem = document.createElement('button');
        menuItem.className = `w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-3 ${key === currentSearchEngine ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`;
        menuItem.innerHTML = `
            <i class="${engine.icon} ${engine.color}"></i>
            <span>${engine.name}</span>
            ${key === currentSearchEngine ? '<i class="fas fa-check ml-auto text-blue-600"></i>' : ''}
        `;
        menuItem.addEventListener('click', () => {
            selectSearchEngine(key);
            dropdownMenu.classList.add('hidden');
        });
        dropdownMenu.appendChild(menuItem);
    });
    
    dropdownContainer.appendChild(dropdownButton);
    dropdownContainer.appendChild(dropdownMenu);
    
    // ドロップダウンの開閉
    dropdownButton.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('hidden');
    });
    
    // 外側クリックで閉じる
    document.addEventListener('click', () => {
        dropdownMenu.classList.add('hidden');
    });
    
    return dropdownContainer;
}

// 検索エンジンを選択
function selectSearchEngine(engineKey) {
    if (searchEngines[engineKey]) {
        currentSearchEngine = engineKey;
        localStorage.setItem('selectedSearchEngine', engineKey);
        
        // ドロップダウンボタンを更新
        const dropdownButton = document.getElementById('search-engine-dropdown');
        if (dropdownButton) {
            dropdownButton.innerHTML = `<i class="${searchEngines[engineKey].icon} ${searchEngines[engineKey].color} text-lg"></i>`;
            dropdownButton.title = `検索エンジン: ${searchEngines[engineKey].name}`;
        }
        
        // プレースホルダーテキストを更新
        searchInput.placeholder = `${searchEngines[engineKey].name}で検索...`;
    }
}

// 検索を実行
function performSearch(query) {
    if (query.trim()) {
        const searchUrl = searchEngines[currentSearchEngine].url + encodeURIComponent(query.trim());
        window.open(searchUrl, '_blank');
    }
}

export function setupSearchBox() {
    // 検索ボックスにドロップダウンを追加
    const searchContainer = searchInput.parentElement;
    const dropdownContainer = createSearchEngineDropdown();
    searchContainer.appendChild(dropdownContainer);
    
    // 検索ボックスのパディングを調整（左側に検索エンジンアイコン、右側に虫眼鏡アイコンのスペースを確保）
    searchInput.style.paddingLeft = '3rem';
    searchInput.style.paddingRight = '3rem';
    
    // 初期のプレースホルダーテキストを設定
    searchInput.placeholder = `${searchEngines[currentSearchEngine].name}で検索...`;
    
    // 検索ボタンのイベントリスナー
    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });
    
    // Enterキーのイベントリスナー
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // キーボードショートカット（Ctrl/Cmd + K）
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
} 