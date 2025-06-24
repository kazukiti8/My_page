// キーボードショートカット機能
class Shortcuts {
    constructor() {
        this.shortcuts = {
            'Ctrl+Shift+S': { action: 'search', description: '検索ボックスにフォーカス' },
            'Ctrl+Shift+B': { action: 'bookmark', description: 'ブックマーク追加' },
            'Ctrl+Shift+T': { action: 'todo', description: 'ToDo入力' },
            'Ctrl+Shift+N': { action: 'note', description: 'メモ保存' },
            'Ctrl+Shift+R': { action: 'refresh', description: 'ニュース更新' },
            'Ctrl+Shift+W': { action: 'weather', description: '天気更新' },
            'Ctrl+Shift+H': { action: 'help', description: 'ショートカット一覧表示' },
            'Ctrl+Shift+E': { action: 'theme', description: 'テーマ切り替え' }
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
        if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt') {
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
                this.saveNote();
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
                const category = prompt('カテゴリを入力してください（省略可）:') || 'その他';
                
                // ブックマーク追加処理
                if (window.addBookmark) {
                    window.addBookmark(url, title, category);
                }
            }
        }
    }

    // ToDo追加
    addTodo() {
        const text = prompt('ToDoを入力してください:');
        if (text) {
            // ToDo追加処理
            if (window.addTodo) {
                window.addTodo(text);
            }
        }
    }

    // メモ保存
    saveNote() {
        const textarea = document.getElementById('notes-textarea');
        if (textarea) {
            textarea.focus();
            // 保存処理は自動で行われる
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
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-gray-800">キーボードショートカット</h2>
                    <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('#shortcuts-modal').classList.add('hidden')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="space-y-2">
                    ${Object.entries(this.shortcuts).map(([key, shortcut]) => `
                        <div class="flex justify-between items-center py-2 border-b border-gray-200">
                            <span class="text-sm text-gray-600">${shortcut.description}</span>
                            <kbd class="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded">${key}</kbd>
                        </div>
                    `).join('')}
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

export default window.shortcuts; 