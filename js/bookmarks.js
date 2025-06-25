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
const bookmarkCategorySelect = document.getElementById('bookmark-category-select');
const saveBookmarkBtn = document.getElementById('save-bookmark-btn');
const cancelBookmarkBtn = document.getElementById('cancel-bookmark-btn');

let categories = JSON.parse(localStorage.getItem('categories')) || [];
let currentCategoryIdForBookmark = null;

// Faviconキャッシュ
const faviconCache = new Map();

// Favicon取得関数（改善版）
function getFaviconUrl(url) {
    try {
        const urlObj = new URL(url);
        const domain = urlObj.hostname;
        
        // キャッシュをチェック
        if (faviconCache.has(domain)) {
            return faviconCache.get(domain);
        }
        
        // 複数のFaviconサービスを試行
        const faviconServices = [
            `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
            `https://favicon.ico/${domain}`,
            `https://${domain}/favicon.ico`
        ];
        
        const faviconUrl = faviconServices[0]; // 最初のサービスを返す
        
        // キャッシュに保存
        faviconCache.set(domain, faviconUrl);
        
        return faviconUrl;
    } catch (error) {
        console.warn('Invalid URL for favicon:', url);
        return null;
    }
}

// Favicon表示用のHTML要素を作成（改善版）
function createFaviconElement(url, bookmarkName) {
    const faviconUrl = getFaviconUrl(url);
    const img = document.createElement('img');
    img.className = 'w-5 h-5 mr-3 flex-shrink-0 rounded-sm';
    img.alt = `${bookmarkName} favicon`;
    img.loading = 'lazy';
    
    // デフォルトアイコン（SVG）
    const defaultIcon = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="20" rx="4" fill="#E5E7EB"/>
            <path d="M10 6C11.1046 6 12 6.89543 12 8C12 9.10457 11.1046 10 10 10C8.89543 10 8 9.10457 8 8C8 6.89543 8.89543 6 10 6Z" fill="#9CA3AF"/>
            <path d="M10 12C8.89543 12 8 10.8954 8 9.75H12C12 10.8954 11.1046 12 10 12Z" fill="#9CA3AF"/>
        </svg>
    `;
    
    if (faviconUrl) {
        // 読み込み中の表示
        img.style.opacity = '0.5';
        img.src = faviconUrl;
        
        img.onerror = () => {
            // エラー時はデフォルトアイコンを表示
            img.style.display = 'none';
            const fallbackIcon = document.createElement('div');
            fallbackIcon.className = 'w-5 h-5 mr-3 flex-shrink-0';
            fallbackIcon.innerHTML = defaultIcon;
            img.parentNode.insertBefore(fallbackIcon, img);
        };
        
        img.onload = () => {
            // 読み込み成功時は画像を表示
            img.style.display = 'block';
            img.style.opacity = '1';
            img.style.transition = 'opacity 0.3s ease';
        };
    } else {
        // URLが無効な場合はデフォルトアイコンを表示
        img.style.display = 'none';
        const fallbackIcon = document.createElement('div');
        fallbackIcon.className = 'w-5 h-5 mr-3 flex-shrink-0';
        fallbackIcon.innerHTML = defaultIcon;
        return fallbackIcon;
    }
    
    return img;
}

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
                bookmarkElement.className = 'bg-white bg-opacity-70 hover:bg-opacity-90 rounded-lg p-3 transition-all duration-200 bookmark-item relative';
                
                const bookmarkLink = document.createElement('a');
                bookmarkLink.href = bookmark.url;
                bookmarkLink.target = '_blank';
                bookmarkLink.className = 'block';
                
                // Faviconとタイトルを横並びで表示
                const bookmarkHeader = document.createElement('div');
                bookmarkHeader.className = 'flex items-center mb-2';
                
                // Faviconを追加
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
                bookmarkActions.className = 'absolute top-2 right-2 flex space-x-1 bookmark-actions transition-opacity duration-200';
                
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