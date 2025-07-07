// 検索エンジンの設定（Googleのみ）
const SEARCH_ENGINE = {
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    icon: 'fab fa-google',
    placeholder: 'Googleで検索...'
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

export function setupSearchBox() {
    // 検索窓のプレースホルダーを設定
    searchInput.placeholder = SEARCH_ENGINE.placeholder;
    
    // Enterキーのイベントリスナー
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
} 