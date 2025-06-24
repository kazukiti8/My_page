// ウィジェット管理機能
class WidgetManager {
    constructor() {
        this.widgets = [
            { id: 'bookmarks', name: 'ブックマーク', icon: 'fas fa-bookmark', visible: true, order: 0, size: 'normal' },
            { id: 'todo', name: 'ToDo', icon: 'fas fa-tasks', visible: true, order: 1, size: 'normal' },
            { id: 'notes', name: 'メモ', icon: 'fas fa-sticky-note', visible: true, order: 2, size: 'normal' },
            { id: 'news', name: 'ニュース', icon: 'fas fa-newspaper', visible: true, order: 3, size: 'normal' },
            { id: 'weather', name: '天気', icon: 'fas fa-cloud-sun', visible: true, order: 4, size: 'normal' }
        ];
        this.init();
    }

    // 初期化
    init() {
        this.loadSettings();
        this.setupWidgetControls();
        this.applyWidgetSettings();
        this.setupDragAndDrop();
    }

    // 設定を読み込み
    loadSettings() {
        const savedWidgets = localStorage.getItem('widgetSettings');
        if (savedWidgets) {
            const saved = JSON.parse(savedWidgets);
            this.widgets = this.widgets.map(widget => {
                const savedWidget = saved.find(w => w.id === widget.id);
                return savedWidget ? { ...widget, ...savedWidget } : widget;
            });
        }
    }

    // 設定を保存
    saveSettings() {
        localStorage.setItem('widgetSettings', JSON.stringify(this.widgets));
    }

    // ウィジェット制御ボタンの設定
    setupWidgetControls() {
        const controlsButton = document.createElement('button');
        controlsButton.id = 'widget-controls-btn';
        controlsButton.className = 'fixed bottom-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 z-40';
        controlsButton.innerHTML = '<i class="fas fa-th-large"></i>';
        controlsButton.title = 'ウィジェット管理 (Ctrl+Shift+W)';
        document.body.appendChild(controlsButton);

        controlsButton.addEventListener('click', () => {
            this.showWidgetManager();
        });

        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'W') {
                e.preventDefault();
                this.showWidgetManager();
            }
        });
    }

    // ウィジェット管理モーダルを表示
    showWidgetManager() {
        const modal = document.createElement('div');
        modal.id = 'widget-manager-modal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-gray-800">ウィジェット管理</h2>
                    <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('#widget-manager-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="space-y-4">
                    <div class="text-sm text-gray-600 mb-4">
                        ドラッグ&ドロップで順序を変更し、チェックボックスで表示/非表示を切り替えられます。
                    </div>
                    
                    <div id="widget-list" class="space-y-2">
                        ${this.widgets.map(widget => this.createWidgetItem(widget)).join('')}
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6">
                        <button class="btn btn-secondary" onclick="this.closest('#widget-manager-modal').remove()">
                            キャンセル
                        </button>
                        <button class="btn btn-primary" onclick="window.widgetManager.applyChanges()">
                            適用
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // モーダル外クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // ドラッグ&ドロップの設定
        this.setupModalDragAndDrop();
    }

    // ウィジェットアイテムを作成
    createWidgetItem(widget) {
        return `
            <div class="widget-item bg-gray-50 rounded-lg p-4 border border-gray-200 cursor-move" data-widget-id="${widget.id}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="drag-handle text-gray-400 cursor-move">
                            <i class="fas fa-grip-vertical"></i>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="${widget.icon} text-blue-500"></i>
                            <span class="font-medium">${widget.name}</span>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2">
                            <label class="text-sm text-gray-600">サイズ:</label>
                            <select class="widget-size-select text-sm border border-gray-300 rounded px-2 py-1" data-widget-id="${widget.id}">
                                <option value="small" ${widget.size === 'small' ? 'selected' : ''}>小</option>
                                <option value="normal" ${widget.size === 'normal' ? 'selected' : ''}>中</option>
                                <option value="large" ${widget.size === 'large' ? 'selected' : ''}>大</option>
                            </select>
                        </div>
                        
                        <label class="flex items-center gap-2">
                            <input type="checkbox" class="widget-visibility" data-widget-id="${widget.id}" ${widget.visible ? 'checked' : ''}>
                            <span class="text-sm text-gray-600">表示</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    // モーダル内のドラッグ&ドロップ設定
    setupModalDragAndDrop() {
        const widgetList = document.getElementById('widget-list');
        if (!widgetList) return;

        let draggedElement = null;

        widgetList.addEventListener('dragstart', (e) => {
            if (e.target.closest('.widget-item')) {
                draggedElement = e.target.closest('.widget-item');
                e.dataTransfer.effectAllowed = 'move';
                e.target.closest('.widget-item').style.opacity = '0.5';
            }
        });

        widgetList.addEventListener('dragend', (e) => {
            if (e.target.closest('.widget-item')) {
                e.target.closest('.widget-item').style.opacity = '1';
            }
        });

        widgetList.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        widgetList.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedElement) {
                const target = e.target.closest('.widget-item');
                if (target && target !== draggedElement) {
                    const allWidgets = Array.from(widgetList.children);
                    const draggedIndex = allWidgets.indexOf(draggedElement);
                    const targetIndex = allWidgets.indexOf(target);
                    
                    if (draggedIndex < targetIndex) {
                        target.parentNode.insertBefore(draggedElement, target.nextSibling);
                    } else {
                        target.parentNode.insertBefore(draggedElement, target);
                    }
                }
            }
        });
    }

    // 変更を適用
    applyChanges() {
        const modal = document.getElementById('widget-manager-modal');
        if (!modal) return;

        // 順序を更新
        const widgetItems = Array.from(modal.querySelectorAll('.widget-item'));
        widgetItems.forEach((item, index) => {
            const widgetId = item.dataset.widgetId;
            const widget = this.widgets.find(w => w.id === widgetId);
            if (widget) {
                widget.order = index;
            }
        });

        // 表示設定を更新
        modal.querySelectorAll('.widget-visibility').forEach(checkbox => {
            const widgetId = checkbox.dataset.widgetId;
            const widget = this.widgets.find(w => w.id === widgetId);
            if (widget) {
                widget.visible = checkbox.checked;
            }
        });

        // サイズ設定を更新
        modal.querySelectorAll('.widget-size-select').forEach(select => {
            const widgetId = select.dataset.widgetId;
            const widget = this.widgets.find(w => w.id === widgetId);
            if (widget) {
                widget.size = select.value;
            }
        });

        // 設定を保存して適用
        this.saveSettings();
        this.applyWidgetSettings();
        modal.remove();

        // トースト通知
        if (window.showToast) {
            window.showToast.success('ウィジェット設定を更新しました');
        }
    }

    // ウィジェット設定を適用
    applyWidgetSettings() {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        // 既存のカードを削除
        const existingCards = mainContent.querySelectorAll('.card');
        existingCards.forEach(card => card.remove());

        // 表示するウィジェットを順序通りに並べ替え
        const visibleWidgets = this.widgets
            .filter(widget => widget.visible)
            .sort((a, b) => a.order - b.order);

        // グリッドレイアウトを調整
        if (visibleWidgets.length === 1) {
            mainContent.style.gridTemplateColumns = '1fr';
        } else if (visibleWidgets.length === 2) {
            mainContent.style.gridTemplateColumns = '1fr 1fr';
        } else {
            mainContent.style.gridTemplateColumns = '1fr 1fr';
        }

        // ウィジェットを再構築
        visibleWidgets.forEach(widget => {
            const card = this.createWidgetCard(widget);
            if (card) {
                mainContent.appendChild(card);
            }
        });
    }

    // ウィジェットカードを作成
    createWidgetCard(widget) {
        const card = document.createElement('div');
        card.className = `card widget-card widget-${widget.id}`;
        card.dataset.widgetId = widget.id;

        // サイズクラスを適用
        if (widget.size === 'small') {
            card.classList.add('widget-small');
        } else if (widget.size === 'large') {
            card.classList.add('widget-large');
        }

        // 本来の描画関数で内容を生成
        switch (widget.id) {
            case 'bookmarks': {
                const container = document.createElement('div');
                container.id = 'bookmarks-container';
                card.appendChild(container);
                if (window.renderCategories) window.renderCategories();
                break;
            }
            case 'todo': {
                const container = document.createElement('div');
                container.id = 'todo-list';
                card.appendChild(container);
                if (window.renderTodos) window.renderTodos();
                break;
            }
            case 'notes': {
                const textarea = document.createElement('textarea');
                textarea.id = 'notes-area';
                textarea.className = 'notes-textarea';
                card.appendChild(textarea);
                if (window.loadNotes) window.loadNotes();
                break;
            }
            case 'news': {
                const container = document.createElement('div');
                container.id = 'news-container';
                card.appendChild(container);
                if (window.renderNews) window.renderNews();
                break;
            }
            case 'weather': {
                const container = document.createElement('div');
                container.className = 'weather-container';
                card.appendChild(container);
                if (window.updateWeatherDisplay) window.updateWeatherDisplay();
                break;
            }
            default:
                card.innerHTML = this.getDefaultWidgetContent(widget);
        }
        return card;
    }

    // デフォルトのウィジェット内容を取得
    getDefaultWidgetContent(widget) {
        const contents = {
            bookmarks: `
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-bookmark"></i>
                        ブックマーク
                    </h3>
                    <div class="card-actions">
                        <button class="action-btn" onclick="window.addBookmark()">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="action-btn" onclick="window.showBookmarkManager()">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
                <div class="bookmarks-container">
                    <div class="text-center text-gray-500 py-8">
                        <i class="fas fa-bookmark text-3xl mb-2"></i>
                        <p>ブックマークがありません</p>
                    </div>
                </div>
            `,
            todo: `
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-tasks"></i>
                        ToDo
                    </h3>
                </div>
                <div class="todo-container">
                    <div class="text-center text-gray-500 py-8">
                        <i class="fas fa-tasks text-3xl mb-2"></i>
                        <p>ToDoがありません</p>
                    </div>
                </div>
            `,
            notes: `
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-sticky-note"></i>
                        メモ
                    </h3>
                </div>
                <div class="notes-container">
                    <textarea class="notes-textarea" placeholder="メモを入力してください..."></textarea>
                </div>
            `,
            news: `
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-newspaper"></i>
                        ニュース
                    </h3>
                    <div class="card-actions">
                        <button class="action-btn" onclick="window.refreshNews()">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="action-btn" onclick="window.showNewsManager()">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
                <div class="news-container">
                    <div class="text-center text-gray-500 py-8">
                        <i class="fas fa-newspaper text-3xl mb-2"></i>
                        <p>ニュースを読み込み中...</p>
                    </div>
                </div>
            `,
            weather: `
                <div class="card-header">
                    <h3 class="card-title">
                        <i class="fas fa-cloud-sun"></i>
                        天気
                    </h3>
                    <div class="card-actions">
                        <button class="action-btn" onclick="window.refreshWeather()">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="weather-container">
                    <div class="text-center text-gray-500 py-8">
                        <i class="fas fa-cloud-sun text-3xl mb-2"></i>
                        <p>天気情報を読み込み中...</p>
                    </div>
                </div>
            `
        };

        return contents[widget.id] || '<div class="text-center text-gray-500 py-8">ウィジェットが見つかりません</div>';
    }

    // ドラッグ&ドロップの設定
    setupDragAndDrop() {
        // メインコンテンツエリアでのドラッグ&ドロップ
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        mainContent.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        mainContent.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedWidgetId = e.dataTransfer.getData('text/plain');
            if (draggedWidgetId) {
                // ウィジェットの順序を更新
                this.updateWidgetOrder(draggedWidgetId, e.target);
            }
        });
    }

    // ウィジェットの順序を更新
    updateWidgetOrder(widgetId, target) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (!widget) return;

        // 新しい順序を計算
        const cards = Array.from(document.querySelectorAll('.widget-card'));
        const targetCard = target.closest('.widget-card');
        
        if (targetCard) {
            const targetIndex = cards.indexOf(targetCard);
            const currentIndex = cards.findIndex(card => card.dataset.widgetId === widgetId);
            
            if (currentIndex !== -1 && targetIndex !== -1) {
                // 順序を更新
                this.widgets.forEach(w => {
                    if (w.order >= targetIndex && w.order < currentIndex) {
                        w.order++;
                    } else if (w.order <= targetIndex && w.order > currentIndex) {
                        w.order--;
                    }
                });
                widget.order = targetIndex;
                
                this.saveSettings();
                this.applyWidgetSettings();
            }
        }
    }

    // ウィジェットを表示/非表示切り替え
    toggleWidget(widgetId) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.visible = !widget.visible;
            this.saveSettings();
            this.applyWidgetSettings();
        }
    }

    // ウィジェットのサイズを変更
    setWidgetSize(widgetId, size) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            widget.size = size;
            this.saveSettings();
            this.applyWidgetSettings();
        }
    }

    // 現在のウィジェット設定を取得
    getWidgetSettings() {
        return this.widgets;
    }
}

// グローバルなウィジェットマネージャーを作成
const widgetManager = new WidgetManager();

// グローバル関数として公開
window.widgetManager = widgetManager;

export default widgetManager; 