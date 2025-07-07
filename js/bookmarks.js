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

// カテゴリー管理メニュー用の要素
const categorySettingsBtn = document.getElementById('category-settings-btn');
const categorySettingsModal = document.getElementById('category-settings-modal');
const editCategoriesBtn = document.getElementById('edit-categories-btn');
const deleteCategoriesBtn = document.getElementById('delete-categories-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');

let categories = JSON.parse(localStorage.getItem('categories')) || [];
let currentCategoryIdForBookmark = null;

// カテゴリーアイコンのマッピング
const categoryIcons = {
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
    'default': 'fas fa-globe'
};

// カテゴリー名からアイコンを取得
function getCategoryIcon(categoryName) {
    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(categoryIcons)) {
        if (lowerName.includes(key)) {
            return icon;
        }
    }
    return categoryIcons.default;
}

// URLからアイコンを取得
function getUrlIcon(url) {
    const domain = new URL(url).hostname.toLowerCase();
    for (const [pattern, icon] of Object.entries(urlIcons)) {
        if (domain.includes(pattern)) {
            return icon;
        }
    }
    return urlIcons.default;
}

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
                defaultIcon.style.display = 'none';
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
            categoryModal.classList.add('flex');
        });
        
        return;
    }
    
    // カテゴリーを横並びにするためのコンテナを作成
    const categoriesGrid = document.createElement('div');
    categoriesGrid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
    
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'category-item bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20';
        categoryElement.dataset.categoryId = category.id;
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'flex justify-between items-center mb-3';
        
        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'text-lg font-semibold text-white flex items-center';
        
        // カテゴリー名に基づくアイコンを取得
        const categoryIcon = getCategoryIcon(category.name);
        categoryTitle.innerHTML = `
            <i class="${categoryIcon} mr-2 text-blue-300"></i>
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
            bookmarkModal.classList.add('flex');
        });
        
        categoryActions.appendChild(addBookmarkBtn);
        
        categoryHeader.appendChild(categoryTitle);
        categoryHeader.appendChild(categoryActions);
        
        const bookmarksList = document.createElement('div');
        bookmarksList.className = 'space-y-2';
        
        if (category.bookmarks && category.bookmarks.length > 0) {
            category.bookmarks.forEach(bookmark => {
                const bookmarkElement = document.createElement('div');
                bookmarkElement.className = 'bg-white bg-opacity-70 hover:bg-opacity-90 rounded-lg p-3 transition-all duration-200 bookmark-item relative group cursor-pointer';
                
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
                const faviconElement = createFaviconElement(bookmark.url, bookmark.name);
                bookmarkHeader.appendChild(faviconElement);
                
                const bookmarkContent = document.createElement('div');
                bookmarkContent.className = 'flex-1 min-w-0';
                
                const bookmarkTitle = document.createElement('div');
                bookmarkTitle.className = 'font-medium text-gray-800 truncate text-sm';
                bookmarkTitle.textContent = bookmark.name;
                bookmarkContent.appendChild(bookmarkTitle);
                
                bookmarkHeader.appendChild(bookmarkContent);
                
                const bookmarkActions = document.createElement('div');
                bookmarkActions.className = 'absolute top-2 right-2 flex space-x-1 bookmark-actions opacity-0 group-hover:opacity-100 transition-opacity duration-200';
                
                const editBookmarkBtn = document.createElement('button');
                editBookmarkBtn.className = 'bg-blue-500 hover:bg-blue-600 text-white px-1 py-1 rounded text-xs';
                editBookmarkBtn.innerHTML = '<i class="fas fa-edit"></i>';
                editBookmarkBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // カード全体のクリックイベントを防ぐ
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
                    bookmarkModal.classList.add('flex');
                    
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
                deleteBookmarkBtn.className = 'bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded text-xs';
                deleteBookmarkBtn.innerHTML = '<i class="fas fa-trash"></i>';
                deleteBookmarkBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation(); // カード全体のクリックイベントを防ぐ
                    if (confirm(`Delete bookmark "${bookmark.name}"?`)) {
                        category.bookmarks = category.bookmarks.filter(b => b.id !== bookmark.id);
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
            emptyMessage.textContent = 'No bookmarks yet. Click "Add Bookmark" to add one.';
            bookmarksList.appendChild(emptyMessage);
        }
        
        categoryElement.appendChild(categoryHeader);
        categoryElement.appendChild(bookmarksList);
        categoriesGrid.appendChild(categoryElement);
    });
    
    bookmarksContainer.appendChild(categoriesGrid);
}

export function setupBookmarkEvents() {
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
                bookmarks: []
            };
            categories.push(newCategory);
            saveCategories();
            renderCategories();
            categoryModal.classList.add('hidden');
            categoryModal.classList.remove('flex');
            
            // 保存完了メッセージを表示
            if (window.showToast) {
                window.showToast.success(`カテゴリ「${newCategory.name}」を追加しました`);
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
                bookmarkModal.classList.remove('flex');
                
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
        bookmarkModal.classList.remove('flex');
        // Reset form
        bookmarkNameInput.value = '';
        bookmarkUrlInput.value = '';
    });
    
    // Close modals when clicking outside
    [categoryModal, bookmarkModal, categorySettingsModal].forEach(modal => {
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
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h3 class="text-xl font-bold mb-4">カテゴリーを編集</h3>
            <div class="space-y-3">
                ${categories.map(category => `
                    <div class="flex items-center space-x-2">
                        <input type="text" value="${category.name}" 
                               class="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                               data-category-id="${category.id}">
                        <button class="save-edit-btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-sm"
                                data-category-id="${category.id}">
                            保存
                        </button>
                    </div>
                `).join('')}
            </div>
            <div class="flex justify-end mt-4">
                <button class="close-edit-modal px-4 py-2 text-gray-600 hover:text-gray-800">閉じる</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 保存ボタンのイベント
    modal.querySelectorAll('.save-edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const categoryId = btn.dataset.categoryId;
            const input = modal.querySelector(`input[data-category-id="${categoryId}"]`);
            const newName = input.value.trim();
            
            if (newName) {
                const category = categories.find(c => c.id === categoryId);
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
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
            <h3 class="text-xl font-bold mb-4 text-red-600">カテゴリーを削除</h3>
            <p class="text-sm text-gray-600 mb-4">削除すると、そのカテゴリー内のすべてのブックマークも削除されます。</p>
            <div class="space-y-2">
                ${categories.map(category => `
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
                `).join('')}
            </div>
            <div class="flex justify-end mt-4">
                <button class="close-delete-modal px-4 py-2 text-gray-600 hover:text-gray-800">閉じる</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 削除ボタンのイベント
    modal.querySelectorAll('.delete-category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const categoryId = btn.dataset.categoryId;
            const categoryName = btn.dataset.categoryName;
            
            if (confirm(`カテゴリ「${categoryName}」とその中のすべてのブックマークを削除しますか？`)) {
                categories = categories.filter(c => c.id !== categoryId);
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