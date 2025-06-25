// Google検索のみに固定
const GOOGLE_SEARCH_URL = 'https://www.google.com/search?q=';

// 検索窓の管理
const searchInput = document.getElementById('search-input');

// 検索を実行
function performSearch(query) {
    if (query.trim()) {
        const searchUrl = GOOGLE_SEARCH_URL + encodeURIComponent(query.trim());
        window.open(searchUrl, '_blank');
    }
}

export function setupSearchBox() {
    // 初期のプレースホルダーテキストを設定
    searchInput.placeholder = 'Googleで検索...';
    
    // Enterキーのイベントリスナー
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
} 