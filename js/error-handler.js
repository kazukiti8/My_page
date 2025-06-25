// 包括的なエラーハンドリングシステム
class ErrorHandler {
    constructor() {
        this.errorCounts = new Map();
        this.maxRetries = 3;
        this.retryDelays = [1000, 3000, 5000]; // リトライ間隔（ミリ秒）
        this.setupGlobalErrorHandlers();
    }

    // グローバルエラーハンドラーの設定
    setupGlobalErrorHandlers() {
        // 未処理のPromiseエラーをキャッチ
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleError('Promise Error', event.reason);
            event.preventDefault();
        });

        // グローバルエラーをキャッチ
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleError('Global Error', event.error);
        });

        // ネットワークエラーの監視
        this.setupNetworkErrorHandling();
    }

    // ネットワークエラーの監視
    setupNetworkErrorHandling() {
        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                
                // レスポンスが成功でも、エラーレスポンスの場合は処理
                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
                    error.status = response.status;
                    error.response = response;
                    throw error;
                }
                
                return response;
            } catch (error) {
                // ネットワークエラーの詳細情報を追加
                if (error.name === 'TypeError' && error.message.includes('fetch')) {
                    error.type = 'NETWORK_ERROR';
                    error.message = 'ネットワーク接続に失敗しました。インターネット接続を確認してください。';
                }
                throw error;
            }
        };
    }

    // エラーの分類と処理
    handleError(context, error, options = {}) {
        const errorInfo = this.classifyError(error);
        const errorKey = `${context}_${errorInfo.type}`;
        
        // エラー回数をカウント
        this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);
        
        // エラーログ
        this.logError(context, error, errorInfo);
        
        // ユーザーへの通知
        this.notifyUser(errorInfo, options);
        
        // 自動復旧の試行
        if (options.retry !== false && this.shouldRetry(errorKey)) {
            this.scheduleRetry(context, error, options);
        }
    }

    // エラーの分類
    classifyError(error) {
        const errorInfo = {
            type: 'UNKNOWN',
            severity: 'MEDIUM',
            userMessage: 'エラーが発生しました',
            canRetry: true
        };

        // HTTPエラー
        if (error.status) {
            errorInfo.type = 'HTTP_ERROR';
            switch (error.status) {
                case 401:
                    errorInfo.severity = 'HIGH';
                    errorInfo.userMessage = '認証エラーが発生しました。APIキーを確認してください。';
                    errorInfo.canRetry = false;
                    break;
                case 403:
                    errorInfo.severity = 'HIGH';
                    errorInfo.userMessage = 'アクセスが拒否されました。';
                    errorInfo.canRetry = false;
                    break;
                case 404:
                    errorInfo.severity = 'MEDIUM';
                    errorInfo.userMessage = 'リソースが見つかりませんでした。';
                    errorInfo.canRetry = false;
                    break;
                case 429:
                    errorInfo.severity = 'MEDIUM';
                    errorInfo.userMessage = 'リクエスト制限に達しました。しばらく待ってから再試行してください。';
                    errorInfo.canRetry = true;
                    break;
                case 500:
                case 502:
                case 503:
                case 504:
                    errorInfo.severity = 'MEDIUM';
                    errorInfo.userMessage = 'サーバーエラーが発生しました。しばらく待ってから再試行してください。';
                    errorInfo.canRetry = true;
                    break;
                default:
                    errorInfo.userMessage = `サーバーエラー (${error.status}) が発生しました。`;
                    errorInfo.canRetry = true;
            }
        }
        // ネットワークエラー
        else if (error.type === 'NETWORK_ERROR' || error.name === 'TypeError') {
            errorInfo.type = 'NETWORK_ERROR';
            errorInfo.severity = 'HIGH';
            errorInfo.userMessage = 'ネットワーク接続に失敗しました。インターネット接続を確認してください。';
            errorInfo.canRetry = true;
        }
        // APIエラー
        else if (error.message && error.message.includes('API')) {
            errorInfo.type = 'API_ERROR';
            errorInfo.severity = 'HIGH';
            errorInfo.userMessage = 'APIエラーが発生しました。設定を確認してください。';
            errorInfo.canRetry = true;
        }
        // タイムアウトエラー
        else if (error.name === 'AbortError' || error.message.includes('timeout')) {
            errorInfo.type = 'TIMEOUT_ERROR';
            errorInfo.severity = 'MEDIUM';
            errorInfo.userMessage = 'リクエストがタイムアウトしました。';
            errorInfo.canRetry = true;
        }

        return errorInfo;
    }

    // エラーログ
    logError(context, error, errorInfo) {
        const logData = {
            timestamp: new Date().toISOString(),
            context: context,
            errorType: errorInfo.type,
            severity: errorInfo.severity,
            message: error.message,
            stack: error.stack,
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        console.error('Error logged:', logData);
        
        // ローカルストレージにエラーログを保存（最新10件）
        this.saveErrorLog(logData);
    }

    // エラーログの保存
    saveErrorLog(logData) {
        try {
            const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
            logs.unshift(logData);
            
            // 最新10件のみ保持
            if (logs.length > 10) {
                logs.splice(10);
            }
            
            localStorage.setItem('errorLogs', JSON.stringify(logs));
        } catch (e) {
            console.error('Failed to save error log:', e);
        }
    }

    // ユーザーへの通知
    notifyUser(errorInfo, options = {}) {
        const { showToast = true, showModal = false } = options;
        
        if (showToast && window.showToast) {
            const duration = errorInfo.severity === 'HIGH' ? 6000 : 4000;
            
            if (errorInfo.severity === 'HIGH') {
                window.showToast.error(errorInfo.userMessage, duration);
            } else {
                window.showToast.warning(errorInfo.userMessage, duration);
            }
        }

        if (showModal) {
            this.showErrorModal(errorInfo);
        }
    }

    // エラーモーダルの表示
    showErrorModal(errorInfo) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md mx-4">
                <div class="flex items-center mb-4">
                    <i class="fas fa-exclamation-triangle text-red-500 text-2xl mr-3"></i>
                    <h3 class="text-lg font-semibold">エラーが発生しました</h3>
                </div>
                <p class="text-gray-700 mb-4">${errorInfo.userMessage}</p>
                <div class="flex justify-end">
                    <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onclick="this.closest('.fixed').remove()">
                        閉じる
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // 背景クリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // リトライすべきかどうかの判定
    shouldRetry(errorKey) {
        const count = this.errorCounts.get(errorKey) || 0;
        return count <= this.maxRetries;
    }

    // リトライのスケジュール
    scheduleRetry(context, error, options) {
        const errorKey = `${context}_${this.classifyError(error).type}`;
        const retryCount = this.errorCounts.get(errorKey) || 0;
        const delay = this.retryDelays[Math.min(retryCount - 1, this.retryDelays.length - 1)];
        
        console.log(`Scheduling retry for ${context} in ${delay}ms (attempt ${retryCount})`);
        
        setTimeout(() => {
            if (options.retryFunction && typeof options.retryFunction === 'function') {
                options.retryFunction();
            }
        }, delay);
    }

    // エラー統計の取得
    getErrorStats() {
        const stats = {};
        for (const [key, count] of this.errorCounts) {
            const [context, type] = key.split('_');
            if (!stats[context]) stats[context] = {};
            stats[context][type] = count;
        }
        return stats;
    }

    // エラーログの取得
    getErrorLogs() {
        try {
            return JSON.parse(localStorage.getItem('errorLogs') || '[]');
        } catch (e) {
            return [];
        }
    }

    // エラーログのクリア
    clearErrorLogs() {
        localStorage.removeItem('errorLogs');
        this.errorCounts.clear();
    }
}

// グローバルエラーハンドラーインスタンスを作成
const errorHandler = new ErrorHandler();

// グローバル関数として公開
window.errorHandler = errorHandler;

export default errorHandler; 