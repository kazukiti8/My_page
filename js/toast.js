// トースト通知機能
class Toast {
    constructor() {
        this.container = document.getElementById('toast-container');
    }

    // 成功メッセージを表示
    success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    // エラーメッセージを表示
    error(message, duration = 4000) {
        this.show(message, 'error', duration);
    }

    // 情報メッセージを表示
    info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }

    // 警告メッセージを表示
    warning(message, duration = 4000) {
        this.show(message, 'warning', duration);
    }

    // トースト通知を表示
    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast-notification transform transition-all duration-300 ease-in-out translate-x-full opacity-0`;
        
        // タイプに応じたスタイルを設定
        const styles = {
            success: 'bg-green-500 text-white border-l-4 border-green-600',
            error: 'bg-red-500 text-white border-l-4 border-red-600',
            info: 'bg-blue-500 text-white border-l-4 border-blue-600',
            warning: 'bg-yellow-500 text-white border-l-4 border-yellow-600'
        };

        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        toast.className += ` ${styles[type]} rounded-lg shadow-lg p-4 min-w-80 max-w-sm`;
        
        toast.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <i class="${icons[type]} text-lg"></i>
                    <span class="font-medium">${message}</span>
                </div>
                <button class="toast-close text-white hover:text-gray-200 transition-colors duration-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // 閉じるボタンのイベントリスナー
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hide(toast);
        });

        // コンテナに追加
        this.container.appendChild(toast);

        // アニメーション開始
        setTimeout(() => {
            toast.classList.remove('translate-x-full', 'opacity-0');
        }, 100);

        // 自動で閉じる
        if (duration > 0) {
            setTimeout(() => {
                this.hide(toast);
            }, duration);
        }

        return toast;
    }

    // トースト通知を非表示
    hide(toast) {
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // すべてのトースト通知をクリア
    clear() {
        const toasts = this.container.querySelectorAll('.toast-notification');
        toasts.forEach(toast => {
            this.hide(toast);
        });
    }
}

// グローバルなトーストインスタンスを作成
const toast = new Toast();

// グローバル関数として公開
window.showToast = {
    success: (message, duration) => toast.success(message, duration),
    error: (message, duration) => toast.error(message, duration),
    info: (message, duration) => toast.info(message, duration),
    warning: (message, duration) => toast.warning(message, duration)
};

export default toast; 