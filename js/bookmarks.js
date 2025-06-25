// ブックマーク管理
import faviconService from './favicon-service.js';

const bookmarksContainer = document.getElementById('bookmarks-container');
const addCategoryBtn = document.getElementById('add-category-btn');
const categoryModal = document.getElementById('category-modal');
const categoryNameInput = document.getElementById('category-name-input');
const saveCategoryBtn = document.getElementById('save-category-btn');
const cancelCategoryBtn = document.getElementById('cancel-category-btn');
const bookmarkModal = document.getElementById('bookmark-modal');
const bookmarkNameInput = document.getElementById('bookmark-name-input');
const bookmarkUrlInput = document.getElementById('bookmark-url-input');
const bookmarkCategorySelect = document.getElementById('bookmark-category-select');
const saveBookmarkBtn = document.getElementById('save-bookmark-btn');
const cancelBookmarkBtn = document.getElementById('cancel-bookmark-btn');

let categories = JSON.parse(localStorage.getItem('categories')) || [];
let currentCategoryIdForBookmark = null;

// 改善されたFavicon表示用のHTML要素を作成
function createFaviconElement(url, bookmarkName) {
    const container = document.createElement('div');
    container.className = 'w-5 h-5 mr-3 flex-shrink-0 relative';
    
    // デフォルトアイコン（SVG）
    const defaultIcon = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="4" fill="#E5E7EB"/>
            <path d="M10 6C11.1046 6 12 6.89543 12 8C12 9.10457 11.1046 10 10 10C8.89543 10 8 9.10457 8 8C8 6.89543 8.89543 6 10 6Z" fill="#9CA3AF"/>
            <path d="M10 12C8.89543 12 8 10.8954 8 9.75H12C12 10.8954 11.1046 12 10 12Z" fill="#9CA3AF"/>
        </svg>
    `;
    
    // デフォルトアイコンを表示
    const fallbackIcon = document.createElement('div');
    fallbackIcon.className = 'w-5 h-5';
    fallbackIcon.innerHTML = defaultIcon;
    container.appendChild(fallbackIcon);
    
    // 実際のFaviconを非同期で読み込み
    faviconService.getFavicon(url, 20).then(faviconUrl => {
        if (faviconUrl && !faviconUrl.startsWith('data:')) {
            const img = document.createElement('img');
            img.className = 'w-5 h-5 absolute top-0 left-0 rounded-sm';
            img.alt = `${bookmarkName} favicon`;
            img.loading = 'lazy';
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
            
            img.onload = () => {
                img.style.opacity = '1';
                fallbackIcon.style.display = 'none';
            };
            
            img.onerror = () => {
                // エラー時はデフォルトアイコンを維持
                img.remove();
            };
            
            img.src = faviconUrl;
            container.appendChild(img);
        }
    }).catch(error => {
        console.debug('Favicon loading failed for:', url, error);
        // エラー時はデフォルトアイコンを維持
    });
    
    return container;
}

// バッチ処理でFaviconを更新
async function refreshAllFavicons() {
    const allUrls = [];
    const urlToElement = new Map();
    
    // すべてのブックマークURLを収集
    categories.forEach(category => {
        if (category.bookmarks) {
            category.bookmarks.forEach(bookmark => {
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
    console.log('Favicon refresh completed:', stats);
    
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

export function renderCategories() {
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
        
        document.getElementById('first-category-btn').addEventListener('click', () => {
            categoryModal.classList.remove('hidden');
        });
        
        return;
    }
    
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'mb-6 category-item';
        categoryElement.dataset.categoryId = category.id;
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'flex justify-between items-center mb-2';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'text-lg font-semibold text-white flex items-center';
        categoryTitle.innerHTML = `
            <i class="fas fa-folder mr-2 text-blue-300"></i>
            ${category.name}
        `;
        
        const categoryActions = document.createElement('div');
        categoryActions.className = 'flex space-x-2 category-actions transition-opacity duration-200';
        
        const addBookmarkBtn = document.createElement('button');
        addBookmarkBtn.className = 'bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs flex items-center';
        addBookmarkBtn.innerHTML = '<i class="fas fa-plus mr-1"></i> Add';
        addBookmarkBtn.addEventListener('click', () => {
            currentCategoryIdForBookmark = category.id;
            bookmarkCategorySelect.innerHTML = '';
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                if (cat.id === category.id) option.selected = true;
                bookmarkCategorySelect.appendChild(option);
            });
            bookmarkNameInput.value = '';
            bookmarkUrlInput.value = '';
            bookmarkModal.classList.remove('hidden');
        });
        
        const editCategoryBtn = document.createElement('button');
        editCategoryBtn.className = 'bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs';
        editCategoryBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editCategoryBtn.addEventListener('click', () => {
            const newName = prompt('Edit category name:', category.name);
            if (newName && newName.trim() !== '') {
                category.name = newName.trim();
                saveCategories();
                renderCategories();
            }
        });
        
        const deleteCategoryBtn = document.createElement('button');
        deleteCategoryBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs';
        deleteCategoryBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteCategoryBtn.addEventListener('click', () => {
            if (confirm(`Delete category "${category.name}" and all its bookmarks?`)) {
                categories = categories.filter(c => c.id !== category.id);
                saveCategories();
                renderCategories();
            }
        });
        
        categoryActions.appendChild(addBookmarkBtn);
        categoryActions.appendChild(editCategoryBtn);
        categoryActions.appendChild(deleteCategoryBtn);
        
        categoryHeader.appendChild(categoryTitle);
        categoryHeader.appendChild(categoryActions);
        
        const bookmarksList = document.createElement('div');
        bookmarksList.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3';
        
        if (category.bookmarks && category.bookmarks.length > 0) {
            category.bookmarks.forEach(bookmark => {
                const bookmarkElement = document.createElement('div');
                bookmarkElement.className = 'bg-white bg-opacity-70 hover:bg-opacity-90 rounded-lg p-3 transition-all duration-200 bookmark-item relative group';
                
                const bookmarkLink = document.createElement('a');
                bookmarkLink.href = bookmark.url;
                bookmarkLink.target = '_blank';
                bookmarkLink.className = 'block';
                
                // Faviconとタイトルを横並びで表示
                const bookmarkHeader = document.createElement('div');
                bookmarkHeader.className = 'flex items-center mb-2';
                
                // 改善されたFaviconを追加
                const faviconElement = createFaviconElement(bookmark.url, bookmark.name);
                bookmarkHeader.appendChild(faviconElement);
                
                const bookmarkTitle = document.createElement('div');
                bookmarkTitle.className = 'font-medium text-gray-800 truncate flex-1 text-sm';
                bookmarkTitle.textContent = bookmark.name;
                bookmarkHeader.appendChild(bookmarkTitle);
                
                const bookmarkUrl = document.createElement('div');
                bookmarkUrl.className = 'text-xs text-gray-500 truncate ml-8';
                bookmarkUrl.textContent = bookmark.url;
                
                const bookmarkActions = document.createElement('div');
                bookmarkActions.className = 'absolute top-2 right-2 flex space-x-1 bookmark-actions opacity-0 group-hover:opacity-100 transition-opacity duration-200';
                
                const editBookmarkBtn = document.createElement('button');
                editBookmarkBtn.className = 'bg-blue-500 hover:bg-blue-600 text-white px-1 py-1 rounded text-xs';
                editBookmarkBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBookmarkBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentCategoryIdForBookmark = category.id;
                    bookmarkNameInput.value = bookmark.name;
                    bookmarkUrlInput.value = bookmark.url;
                    
                    bookmarkCategorySelect.innerHTML = '';
                    categories.forEach(cat => {
                        const option = document.createElement('option');
                        option.value = cat.id;
                        option.textContent = cat.name;
                        if (cat.id === category.id) option.selected = true;
                        bookmarkCategorySelect.appendChild(option);
                    });
                    
                    bookmarkModal.classList.remove('hidden');
                    
                    // 編集時は一時的にイベントリスナーを削除して新しいものを追加
                    const originalClickHandler = saveBookmarkBtn.onclick;
                    saveBookmarkBtn.onclick = function() {
                        if (bookmarkNameInput.value.trim() && bookmarkUrlInput.value.trim()) {
                            bookmark.name = bookmarkNameInput.value.trim();
                            bookmark.url = bookmarkUrlInput.value.trim();
                            
                            // If category changed, move bookmark
                            const newCategoryId = bookmarkCategorySelect.value;
                            if (newCategoryId !== category.id) {
                                // Remove from old category
                                category.bookmarks = category.bookmarks.filter(b => b.id !== bookmark.id);
                                
                                // Add to new category
                                const newCategory = categories.find(c => c.id === newCategoryId);
                                if (newCategory) {
                                    if (!newCategory.bookmarks) newCategory.bookmarks = [];
                                    newCategory.bookmarks.push(bookmark);
                                }
                            }
                            
                            saveCategories();
                            renderCategories();
                            bookmarkModal.classList.add('hidden');
                            
                            // Reset form
                            bookmarkNameInput.value = '';
                            bookmarkUrlInput.value = '';
                            
                            // Restore original handler
                            saveBookmarkBtn.onclick = originalClickHandler;
                        }
                    };
                });
                
                const deleteBookmarkBtn = document.createElement('button');
                deleteBookmarkBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded text-xs';
                deleteBookmarkBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBookmarkBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm(`Delete bookmark "${bookmark.name}"?`)) {
                        category.bookmarks = category.bookmarks.filter(b => b.id !== bookmark.id);
                        saveCategories();
                        renderCategories();
                    }
                });
                
                bookmarkActions.appendChild(editBookmarkBtn);
                bookmarkActions.appendChild(deleteBookmarkBtn);
                
                bookmarkLink.appendChild(bookmarkHeader);
                bookmarkLink.appendChild(bookmarkUrl);
                bookmarkElement.appendChild(bookmarkLink);
                bookmarkElement.appendChild(bookmarkActions);
                bookmarksList.appendChild(bookmarkElement);
            });
        } else {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'text-gray-500 text-sm italic col-span-full';
            emptyMessage.textContent = 'No bookmarks yet. Click "Add Bookmark" to add one.';
            bookmarksList.appendChild(emptyMessage);
        }
        
        categoryElement.appendChild(categoryHeader);
        categoryElement.appendChild(bookmarksList);
        bookmarksContainer.appendChild(categoryElement);
    });
}

export function setupBookmarkEvents() {
    // Favicon更新ボタン
    const refreshFaviconsBtn = document.getElementById('refresh-favicons-btn');
    if (refreshFaviconsBtn) {
        refreshFaviconsBtn.addEventListener('click', async () => {
            refreshFaviconsBtn.disabled = true;
            refreshFaviconsBtn.innerHTML = '<i class="fas fa-spinner animate-spin mr-1"></i> 更新中...';
            
            try {
                await refreshAllFavicons();
            } catch (error) {
                console.error('Error refreshing favicons:', error);
                if (window.showToast) {
                    window.showToast.error('Faviconの更新に失敗しました');
                }
            } finally {
                refreshFaviconsBtn.disabled = false;
                refreshFaviconsBtn.innerHTML = '<i class="fas fa-sync-alt mr-1"></i> Favicon';
            }
        });
    }

    // Category modal
    addCategoryBtn.addEventListener('click', () => {
        categoryNameInput.value = '';
        categoryModal.classList.remove('hidden');
    });
    
    saveCategoryBtn.addEventListener('click', () => {
        if (categoryNameInput.value.trim()) {
            const newCategory = {
                id: Date.now().toString(),
                name: categoryNameInput.value.trim(),
                bookmarks: []
            };
            categories.push(newCategory);
            saveCategories();
            renderCategories();
            categoryModal.classList.add('hidden');
            
            // 保存完了メッセージを表示
            if (window.showToast) {
                window.showToast.success(`カテゴリ「${newCategory.name}」を追加しました`);
            }
        }
    });
    
    cancelCategoryBtn.addEventListener('click', () => {
        categoryModal.classList.add('hidden');
    });
    
    // Bookmark modal - 新規追加用
    saveBookmarkBtn.addEventListener('click', () => {
        if (bookmarkNameInput.value.trim() && bookmarkUrlInput.value.trim()) {
            const url = bookmarkUrlInput.value.trim();
            const validUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
            
            const newBookmark = {
                id: Date.now().toString(),
                name: bookmarkNameInput.value.trim(),
                url: validUrl
            };
            
            const categoryId = bookmarkCategorySelect.value;
            const category = categories.find(c => c.id === categoryId);
            if (category) {
                if (!category.bookmarks) category.bookmarks = [];
                category.bookmarks.push(newBookmark);
                saveCategories();
                renderCategories();
                bookmarkModal.classList.add('hidden');
                
                // Reset form
                bookmarkNameInput.value = '';
                bookmarkUrlInput.value = '';
                
                // 保存完了メッセージを表示
                if (window.showToast) {
                    window.showToast.success(`ブックマーク「${newBookmark.name}」を追加しました`);
                }
            }
        }
    });
    
    cancelBookmarkBtn.addEventListener('click', () => {
        bookmarkModal.classList.add('hidden');
        // Reset form
        bookmarkNameInput.value = '';
        bookmarkUrlInput.value = '';
    });
    
    // Close modals when clicking outside
    [categoryModal, bookmarkModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                // Reset bookmark form when closing
                if (modal === bookmarkModal) {
                    bookmarkNameInput.value = '';
                    bookmarkUrlInput.value = '';
                }
            }
        });
    });
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
} 