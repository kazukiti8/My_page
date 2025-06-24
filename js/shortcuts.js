// キーボードショートカット管理
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.isEnabled = true;
        this.init();
    }

    // ショートカットを登録
    register(key, callback, description = '') {
        this.shortcuts.set(key, { callback, description });
    }

    // ショートカットを削除
    unregister(key) {
        this.shortcuts.delete(key);
    }

    // 初期化
    init() {
        document.addEventListener('keydown', (e) => {
            if (!this.isEnabled) return;
            
            // 入力フィールド内では一部のショートカットを無効化
            const isInInput = this.isInInputField(e.target);
            
            // 常に有効なショートカット
            const alwaysActive = ['ctrl+k', 'cmd+k', 'ctrl+/', 'cmd+/', 'escape'];
            const key = this.getKeyString(e);
            
            if (alwaysActive.includes(key) || !isInInput) {
                this.handleKeyPress(e, key);
            }
        });

        // ショートカット一覧を表示するヘルプモーダル
        this.setupHelpModal();
    }

    // キー入力を処理
    handleKeyPress(e, key) {
        const shortcut = this.shortcuts.get(key);
        if (shortcut) {
            e.preventDefault();
            shortcut.callback();
        }
    }

    // キー文字列を取得
    getKeyString(e) {
        const keys = [];
        
        if (e.ctrlKey) keys.push('ctrl');
        if (e.metaKey) keys.push('cmd');
        if (e.altKey) keys.push('alt');
        if (e.shiftKey) keys.push('shift');
        
        if (e.key !== 'Control' && e.key !== 'Meta' && e.key !== 'Alt' && e.key !== 'Shift') {
            keys.push(e.key.toLowerCase());
        }
        
        return keys.join('+');
    }

    // 入力フィールド内かどうかを判定
    isInInputField(element) {
        const inputTypes = ['input', 'textarea', 'select'];
        return inputTypes.includes(element.tagName.toLowerCase()) || 
               element.contentEditable === 'true';
    }

    // ヘルプモーダルの設定
    setupHelpModal() {
        // ヘルプボタンを作成
        const helpButton = document.createElement('button');
        helpButton.id = 'shortcuts-help-btn';
        helpButton.className = 'fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-colors duration-200 z-40';
        helpButton.innerHTML = '<i class="fas fa-keyboard"></i>';
        helpButton.title = 'キーボードショートカット (Ctrl+/)';
        document.body.appendChild(helpButton);

        // ヘルプモーダルを作成
        const helpModal = document.createElement('div');
        helpModal.id = 'shortcuts-help-modal';
        helpModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        
        helpModal.innerHTML = `
            <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">キーボードショートカット</h3>
                    <button id="close-shortcuts-help" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div id="shortcuts-list" class="space-y-3">
                    <!-- ショートカット一覧がここに表示される -->
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);

        // イベントリスナーを設定
        helpButton.addEventListener('click', () => {
            this.showHelpModal();
        });

        helpModal.querySelector('#close-shortcuts-help').addEventListener('click', () => {
            this.hideHelpModal();
        });

        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                this.hideHelpModal();
            }
        });
    }

    // ヘルプモーダルを表示
    showHelpModal() {
        const modal = document.getElementById('shortcuts-help-modal');
        const list = document.getElementById('shortcuts-list');
        
        // ショートカット一覧を生成
        list.innerHTML = '';
        
        const categories = {
            'ナビゲーション': [],
            'ブックマーク': [],
            'ToDo': [],
            'メモ': [],
            'ニュース': [],
            'その他': []
        };

        // ショートカットをカテゴリ別に分類
        this.shortcuts.forEach((shortcut, key) => {
            if (shortcut.description.includes('検索')) {
                categories['ナビゲーション'].push({ key, ...shortcut });
            } else if (shortcut.description.includes('ブックマーク') || shortcut.description.includes('カテゴリ')) {
                categories['ブックマーク'].push({ key, ...shortcut });
            } else if (shortcut.description.includes('ToDo') || shortcut.description.includes('タスク')) {
                categories['ToDo'].push({ key, ...shortcut });
            } else if (shortcut.description.includes('メモ')) {
                categories['メモ'].push({ key, ...shortcut });
            } else if (shortcut.description.includes('ニュース')) {
                categories['ニュース'].push({ key, ...shortcut });
            } else {
                categories['その他'].push({ key, ...shortcut });
            }
        });

        // カテゴリ別に表示
        Object.entries(categories).forEach(([category, shortcuts]) => {
            if (shortcuts.length > 0) {
                const categoryDiv = document.createElement('div');
                categoryDiv.innerHTML = `
                    <h4 class="font-semibold text-gray-800 mb-2">${category}</h4>
                    <div class="space-y-2">
                        ${shortcuts.map(shortcut => `
                            <div class="flex justify-between items-center py-1">
                                <span class="text-gray-600">${shortcut.description}</span>
                                <kbd class="bg-gray-100 px-2 py-1 rounded text-sm font-mono">${shortcut.key}</kbd>
                            </div>
                        `).join('')}
                    </div>
                `;
                list.appendChild(categoryDiv);
            }
        });

        modal.classList.remove('hidden');
    }

    // ヘルプモーダルを非表示
    hideHelpModal() {
        const modal = document.getElementById('shortcuts-help-modal');
        modal.classList.add('hidden');
    }

    // ショートカットを有効/無効切り替え
    toggle() {
        this.isEnabled = !this.isEnabled;
        if (window.showToast) {
            window.showToast.info(`キーボードショートカットを${this.isEnabled ? '有効' : '無効'}にしました`);
        }
    }
}

// グローバルなショートカットマネージャーを作成
const shortcuts = new KeyboardShortcuts();

// ショートカットを登録
function registerShortcuts() {
    // 検索ボックスにフォーカス
    shortcuts.register('ctrl+k', () => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
    }, '検索ボックスにフォーカス');

    shortcuts.register('cmd+k', () => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
    }, '検索ボックスにフォーカス');

    // ヘルプモーダルを表示
    shortcuts.register('ctrl+/', () => {
        shortcuts.showHelpModal();
    }, 'ショートカット一覧を表示');

    shortcuts.register('cmd+/', () => {
        shortcuts.showHelpModal();
    }, 'ショートカット一覧を表示');

    // Escapeキーでモーダルを閉じる
    shortcuts.register('escape', () => {
        const modals = document.querySelectorAll('.fixed.inset-0.bg-black.bg-opacity-50');
        modals.forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }, 'モーダルを閉じる');

    // ブックマーク関連
    shortcuts.register('ctrl+b', () => {
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) addCategoryBtn.click();
    }, 'ブックマークカテゴリを追加');

    shortcuts.register('cmd+b', () => {
        const addCategoryBtn = document.getElementById('add-category-btn');
        if (addCategoryBtn) addCategoryBtn.click();
    }, 'ブックマークカテゴリを追加');

    // ToDo関連
    shortcuts.register('ctrl+t', () => {
        const newTodoInput = document.getElementById('new-todo-input');
        if (newTodoInput) newTodoInput.focus();
    }, 'ToDo入力にフォーカス');

    shortcuts.register('cmd+t', () => {
        const newTodoInput = document.getElementById('new-todo-input');
        if (newTodoInput) newTodoInput.focus();
    }, 'ToDo入力にフォーカス');

    // メモ関連
    shortcuts.register('ctrl+n', () => {
        const notesArea = document.getElementById('notes-area');
        if (notesArea) notesArea.focus();
    }, 'メモエリアにフォーカス');

    shortcuts.register('cmd+n', () => {
        const notesArea = document.getElementById('notes-area');
        if (notesArea) notesArea.focus();
    }, 'メモエリアにフォーカス');

    // メモを保存
    shortcuts.register('ctrl+s', () => {
        const saveNoteBtn = document.getElementById('save-note-btn');
        if (saveNoteBtn) saveNoteBtn.click();
    }, 'メモを保存');

    shortcuts.register('cmd+s', () => {
        const saveNoteBtn = document.getElementById('save-note-btn');
        if (saveNoteBtn) saveNoteBtn.click();
    }, 'メモを保存');

    // ニュース関連
    shortcuts.register('ctrl+r', () => {
        const refreshNewsBtn = document.getElementById('refresh-news-btn');
        if (refreshNewsBtn) refreshNewsBtn.click();
    }, 'ニュースを更新');

    shortcuts.register('cmd+r', () => {
        const refreshNewsBtn = document.getElementById('refresh-news-btn');
        if (refreshNewsBtn) refreshNewsBtn.click();
    }, 'ニュースを更新');

    // ニュースフィード追加
    shortcuts.register('ctrl+shift+n', () => {
        const addFeedBtn = document.getElementById('add-feed-btn');
        if (addFeedBtn) addFeedBtn.click();
    }, 'ニュースフィードを追加');

    shortcuts.register('cmd+shift+n', () => {
        const addFeedBtn = document.getElementById('add-feed-btn');
        if (addFeedBtn) addFeedBtn.click();
    }, 'ニュースフィードを追加');
}

// 初期化時にショートカットを登録
registerShortcuts();

// グローバル関数として公開
window.keyboardShortcuts = shortcuts;

export default shortcuts; 