// 検索窓の管理
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');

export function setupSearchBox() {
    searchButton.addEventListener('click', () => {
        if (searchInput.value.trim()) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchInput.value.trim())}`, '_blank');
        }
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && searchInput.value.trim()) {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(searchInput.value.trim())}`, '_blank');
        }
    });
} 