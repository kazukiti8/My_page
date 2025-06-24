// テーマ管理機能
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'auto';
        this.currentColorScheme = localStorage.getItem('colorScheme') || 'blue';
        this.customBackground = localStorage.getItem('customBackground') || '';
        this.init();
    }

    // 初期化
    init() {
        this.applyTheme();
        this.setupThemeToggle();
        this.setupColorSchemeSelector();
        this.setupBackgroundSelector();
    }

    // テーマを適用
    applyTheme() {
        const root = document.documentElement;
        
        // システムテーマの検出
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        
        // 現在のテーマを決定
        let activeTheme = this.currentTheme;
        if (this.currentTheme === 'auto') {
            activeTheme = systemTheme;
        }

        // テーマクラスを適用
        root.classList.remove('theme-light', 'theme-dark');
        root.classList.add(`theme-${activeTheme}`);

        // カラースキームを適用
        this.applyColorScheme();

        // カスタム背景を適用
        this.applyCustomBackground();
    }

    // カラースキームを適用
    applyColorScheme() {
        const root = document.documentElement;
        
        // 既存のカラースキームクラスを削除
        root.classList.remove('color-blue', 'color-green', 'color-purple', 'color-orange', 'color-red');
        root.classList.add(`color-${this.currentColorScheme}`);
    }

    // カスタム背景を適用
    applyCustomBackground() {
        const backgroundElement = document.getElementById('background');
        if (backgroundElement && this.customBackground) {
            backgroundElement.style.backgroundImage = `url(${this.customBackground})`;
        }
    }

    // テーマ切り替えボタンの設定
    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'fixed bottom-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 z-40';
        themeToggle.innerHTML = this.getThemeIcon();
        themeToggle.title = 'テーマを切り替え (Ctrl+Shift+T)';
        document.body.appendChild(themeToggle);

        themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // システムテーマの変更を監視
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.currentTheme === 'auto') {
                this.applyTheme();
            }
        });
    }

    // テーマアイコンを取得
    getThemeIcon() {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const activeTheme = this.currentTheme === 'auto' ? systemTheme : this.currentTheme;
        
        return activeTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    }

    // テーマを切り替え
    toggleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.currentTheme = themes[nextIndex];
        
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
        
        // アイコンを更新
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = this.getThemeIcon();
        }

        // トースト通知
        if (window.showToast) {
            const themeNames = { auto: '自動', light: 'ライト', dark: 'ダーク' };
            window.showToast.info(`テーマを${themeNames[this.currentTheme]}に変更しました`);
        }
    }

    // カラースキーム選択器の設定
    setupColorSchemeSelector() {
        const colorSchemes = [
            { key: 'blue', name: 'ブルー', class: 'bg-blue-500' },
            { key: 'green', name: 'グリーン', class: 'bg-green-500' },
            { key: 'purple', name: 'パープル', class: 'bg-purple-500' },
            { key: 'orange', name: 'オレンジ', class: 'bg-orange-500' },
            { key: 'red', name: 'レッド', class: 'bg-red-500' }
        ];

        const colorSelector = document.createElement('div');
        colorSelector.id = 'color-scheme-selector';
        colorSelector.className = 'fixed bottom-4 left-20 bg-white bg-opacity-80 rounded-lg shadow-lg p-2 z-40 hidden';
        
        colorSelector.innerHTML = `
            <div class="text-xs font-medium text-gray-700 mb-2">カラーテーマ</div>
            <div class="flex space-x-2">
                ${colorSchemes.map(scheme => `
                    <button class="color-scheme-btn w-8 h-8 rounded-full ${scheme.class} hover:scale-110 transition-transform duration-200 ${scheme.key === this.currentColorScheme ? 'ring-2 ring-gray-400' : ''}" 
                            data-scheme="${scheme.key}" title="${scheme.name}">
                    </button>
                `).join('')}
            </div>
        `;
        
        document.body.appendChild(colorSelector);

        // カラーボタンのイベントリスナー
        colorSelector.querySelectorAll('.color-scheme-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const scheme = btn.dataset.scheme;
                this.setColorScheme(scheme);
                
                // 選択状態を更新
                colorSelector.querySelectorAll('.color-scheme-btn').forEach(b => {
                    b.classList.remove('ring-2', 'ring-gray-400');
                });
                btn.classList.add('ring-2', 'ring-gray-400');
            });
        });

        // カラーボタンを表示/非表示
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('mouseenter', () => {
            colorSelector.classList.remove('hidden');
        });

        colorSelector.addEventListener('mouseenter', () => {
            colorSelector.classList.remove('hidden');
        });

        colorSelector.addEventListener('mouseleave', () => {
            colorSelector.classList.add('hidden');
        });
    }

    // カラースキームを設定
    setColorScheme(scheme) {
        this.currentColorScheme = scheme;
        localStorage.setItem('colorScheme', scheme);
        this.applyColorScheme();
        
        if (window.showToast) {
            const schemeNames = { blue: 'ブルー', green: 'グリーン', purple: 'パープル', orange: 'オレンジ', red: 'レッド' };
            window.showToast.info(`カラーテーマを${schemeNames[scheme]}に変更しました`);
        }
    }

    // 背景選択器の設定
    setupBackgroundSelector() {
        const backgroundSelector = document.createElement('div');
        backgroundSelector.id = 'background-selector';
        backgroundSelector.className = 'fixed bottom-4 left-20 bg-white bg-opacity-80 rounded-lg shadow-lg p-3 z-40 hidden';
        
        backgroundSelector.innerHTML = `
            <div class="text-xs font-medium text-gray-700 mb-2">背景画像</div>
            <div class="space-y-2">
                <button class="bg-auto-btn w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-xs ${!this.customBackground ? 'bg-blue-100 text-blue-700' : ''}">
                    <i class="fas fa-random mr-1"></i>自動（Unsplash）
                </button>
                <button class="bg-custom-btn w-full text-left px-2 py-1 rounded hover:bg-gray-100 text-xs">
                    <i class="fas fa-image mr-1"></i>カスタム画像
                </button>
                <input type="file" id="custom-background-input" accept="image/*" class="hidden">
            </div>
        `;
        
        document.body.appendChild(backgroundSelector);

        // 自動背景ボタン
        backgroundSelector.querySelector('.bg-auto-btn').addEventListener('click', () => {
            this.setCustomBackground('');
            backgroundSelector.classList.add('hidden');
        });

        // カスタム背景ボタン
        backgroundSelector.querySelector('.bg-custom-btn').addEventListener('click', () => {
            document.getElementById('custom-background-input').click();
        });

        // ファイル選択
        document.getElementById('custom-background-input').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.setCustomBackground(e.target.result);
                };
                reader.readAsDataURL(file);
            }
            backgroundSelector.classList.add('hidden');
        });

        // 背景ボタンを表示/非表示
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('mouseenter', () => {
            backgroundSelector.classList.remove('hidden');
        });

        backgroundSelector.addEventListener('mouseenter', () => {
            backgroundSelector.classList.remove('hidden');
        });

        backgroundSelector.addEventListener('mouseleave', () => {
            backgroundSelector.classList.add('hidden');
        });
    }

    // カスタム背景を設定
    setCustomBackground(imageData) {
        this.customBackground = imageData;
        localStorage.setItem('customBackground', imageData);
        this.applyCustomBackground();
        
        if (window.showToast) {
            if (imageData) {
                window.showToast.success('カスタム背景画像を設定しました');
            } else {
                window.showToast.info('自動背景に戻しました');
            }
        }
    }

    // 現在のテーマを取得
    getCurrentTheme() {
        return this.currentTheme;
    }

    // 現在のカラースキームを取得
    getCurrentColorScheme() {
        return this.currentColorScheme;
    }
}

// グローバルなテーママネージャーを作成
const themeManager = new ThemeManager();

// グローバル関数として公開
window.themeManager = themeManager;

export default themeManager; 