// メールウィジェット機能
class MailWidget {
    constructor() {
        this.container = null;
        this.unreadCount = 0;
        this.recentEmails = [];
        this.isInitialized = false;
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.createWidget();
        this.loadSettings();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    createWidget() {
        // メールウィジェットのHTMLを作成
        const mailWidgetHTML = `
            <div class="blur-bg rounded-xl p-4 text-white">
                <div class="flex justify-between items-center mb-3">
                    <div class="flex items-center">
                        <i class="fas fa-envelope text-2xl mr-3"></i>
                        <h3 class="text-lg font-semibold">メール</h3>
                        <span id="mail-unread-badge" class="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full hidden">0</span>
                    </div>
                    <div class="flex space-x-2">
                        <button id="refresh-mail-btn" class="text-blue-400 hover:text-blue-300" title="更新">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button id="mail-settings-btn" class="text-blue-400 hover:text-blue-300" title="設定">
                            <i class="fas fa-cog"></i>
                        </button>
                    </div>
                </div>
                
                <div id="mail-content">
                    <div id="mail-loading" class="text-center py-4">
                        <i class="fas fa-spinner fa-spin text-2xl mb-2"></i>
                        <p class="text-sm">メールを読み込み中...</p>
                    </div>
                    
                    <div id="mail-list" class="space-y-2 max-h-48 overflow-y-auto hidden">
                        <!-- メールリストがここに表示されます -->
                    </div>
                    
                    <div id="mail-error" class="text-center py-4 hidden">
                        <i class="fas fa-exclamation-triangle text-2xl mb-2 text-yellow-400"></i>
                        <p class="text-sm">メールの取得に失敗しました</p>
                        <button id="retry-mail-btn" class="mt-2 text-blue-400 hover:text-blue-300 text-sm">
                            再試行
                        </button>
                    </div>
                    
                    <div id="mail-setup" class="text-center py-4 hidden">
                        <i class="fas fa-envelope-open text-2xl mb-2 text-gray-400"></i>
                        <p class="text-sm mb-2">Gmailアカウントを設定してください</p>
                        <button id="setup-gmail-btn" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                            Gmail設定
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 左カラムにメールウィジェットを追加
        const leftColumn = document.querySelector('.left-column');
        if (leftColumn) {
            // 既存のウィジェットの後に追加
            leftColumn.insertAdjacentHTML('beforeend', mailWidgetHTML);
            this.container = leftColumn.lastElementChild;
        }
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('mailSettings') || '{}');
        this.settings = {
            gmailAccount: settings.gmailAccount || '',
            refreshInterval: settings.refreshInterval || 5, // 分
            maxEmails: settings.maxEmails || 5,
            showUnreadOnly: settings.showUnreadOnly || false,
            ...settings
        };
    }

    setupEventListeners() {
        // 更新ボタン
        document.getElementById('refresh-mail-btn')?.addEventListener('click', () => {
            this.fetchEmails();
        });

        // 設定ボタン
        document.getElementById('mail-settings-btn')?.addEventListener('click', () => {
            this.showSettingsModal();
        });

        // 再試行ボタン
        document.getElementById('retry-mail-btn')?.addEventListener('click', () => {
            this.fetchEmails();
        });

        // Gmail設定ボタン
        document.getElementById('setup-gmail-btn')?.addEventListener('click', () => {
            this.showSettingsModal();
        });

        // メール設定モーダルのイベントハンドラー
        document.getElementById('cancel-mail-settings-btn')?.addEventListener('click', () => {
            this.hideSettingsModal();
        });

        document.getElementById('save-mail-settings-btn')?.addEventListener('click', () => {
            this.saveSettingsFromForm();
        });

        // モーダル外クリックで閉じる
        document.getElementById('mail-settings-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'mail-settings-modal') {
                this.hideSettingsModal();
            }
        });
    }

    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        this.refreshInterval = setInterval(() => {
            if (this.settings.gmailAccount) {
                this.fetchEmails();
            }
        }, this.settings.refreshInterval * 60 * 1000);
    }

    async fetchEmails() {
        if (!this.settings.gmailAccount) {
            this.showSetupMessage();
            return;
        }

        this.showLoading();

        try {
            // Gmail APIを使用してメールを取得
            const response = await fetch('/api/gmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    account: this.settings.gmailAccount,
                    maxResults: this.settings.maxEmails,
                    unreadOnly: this.settings.showUnreadOnly
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.recentEmails = data.emails || [];
            this.unreadCount = data.unreadCount || 0;
            
            this.displayEmails();
            this.updateUnreadBadge();
            
        } catch (error) {
            console.error('メール取得エラー:', error);
            this.showError();
        }
    }

    displayEmails() {
        const mailList = document.getElementById('mail-list');
        const mailLoading = document.getElementById('mail-loading');
        const mailError = document.getElementById('mail-error');
        const mailSetup = document.getElementById('mail-setup');

        // すべての状態を非表示
        mailLoading.classList.add('hidden');
        mailError.classList.add('hidden');
        mailSetup.classList.add('hidden');

        if (this.recentEmails.length === 0) {
            mailList.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-inbox text-2xl mb-2 text-gray-400"></i>
                    <p class="text-sm text-gray-300">メールがありません</p>
                </div>
            `;
            mailList.classList.remove('hidden');
            return;
        }

        const emailsHTML = this.recentEmails.map(email => `
            <div class="mail-item bg-white bg-opacity-10 rounded p-2 cursor-pointer hover:bg-opacity-20 transition-all" 
                 onclick="window.open('https://mail.google.com/mail/u/0/#inbox/${email.id}', '_blank')">
                <div class="flex items-start justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center mb-1">
                            <span class="font-medium text-sm truncate">${this.escapeHtml(email.from)}</span>
                            ${email.unread ? '<span class="ml-2 w-2 h-2 bg-blue-400 rounded-full"></span>' : ''}
                        </div>
                        <div class="text-xs text-gray-300 truncate">${this.escapeHtml(email.subject)}</div>
                        <div class="text-xs text-gray-400 mt-1">${this.formatDate(email.date)}</div>
                    </div>
                    ${email.hasAttachment ? '<i class="fas fa-paperclip text-xs text-gray-400 ml-2"></i>' : ''}
                </div>
            </div>
        `).join('');

        mailList.innerHTML = emailsHTML;
        mailList.classList.remove('hidden');
    }

    updateUnreadBadge() {
        const badge = document.getElementById('mail-unread-badge');
        if (this.unreadCount > 0) {
            badge.textContent = this.unreadCount > 99 ? '99+' : this.unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }

    showLoading() {
        document.getElementById('mail-loading').classList.remove('hidden');
        document.getElementById('mail-list').classList.add('hidden');
        document.getElementById('mail-error').classList.add('hidden');
        document.getElementById('mail-setup').classList.add('hidden');
    }

    showError() {
        document.getElementById('mail-loading').classList.add('hidden');
        document.getElementById('mail-list').classList.add('hidden');
        document.getElementById('mail-error').classList.remove('hidden');
        document.getElementById('mail-setup').classList.add('hidden');
    }

    showSetupMessage() {
        document.getElementById('mail-loading').classList.add('hidden');
        document.getElementById('mail-list').classList.add('hidden');
        document.getElementById('mail-error').classList.add('hidden');
        document.getElementById('mail-setup').classList.remove('hidden');
    }

    showSettingsModal() {
        // メール設定モーダルを表示
        const modal = document.getElementById('mail-settings-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.populateSettingsForm();
        }
    }

    hideSettingsModal() {
        // メール設定モーダルを非表示
        const modal = document.getElementById('mail-settings-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    populateSettingsForm() {
        const form = document.getElementById('mail-settings-form');
        if (form) {
            form.gmailAccount.value = this.settings.gmailAccount;
            form.refreshInterval.value = this.settings.refreshInterval;
            form.maxEmails.value = this.settings.maxEmails;
            form.showUnreadOnly.checked = this.settings.showUnreadOnly;
        }
    }

    saveSettings(formData) {
        this.settings = {
            gmailAccount: formData.gmailAccount,
            refreshInterval: parseInt(formData.refreshInterval),
            maxEmails: parseInt(formData.maxEmails),
            showUnreadOnly: formData.showUnreadOnly === 'on'
        };

        localStorage.setItem('mailSettings', JSON.stringify(this.settings));
        this.startAutoRefresh();
        
        if (this.settings.gmailAccount) {
            this.fetchEmails();
        } else {
            this.showSetupMessage();
        }
    }

    saveSettingsFromForm() {
        const form = document.getElementById('mail-settings-form');
        if (form) {
            const formData = {
                gmailAccount: form.gmailAccount.value,
                refreshInterval: form.refreshInterval.value,
                maxEmails: form.maxEmails.value,
                showUnreadOnly: form.showUnreadOnly.checked
            };
            
            this.saveSettings(formData);
            this.hideSettingsModal();
            
            // 成功メッセージを表示
            if (window.showToast) {
                window.showToast('メール設定を保存しました', 'success');
            }
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);

        if (diffInHours < 1) {
            return '今';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}時間前`;
        } else if (diffInHours < 48) {
            return '昨日';
        } else {
            return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 通知機能
    showNotification(title, body) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: body,
                icon: '/favicon.ico'
            });
        }
    }

    // 初期化時にメールを取得
    initialize() {
        if (!this.isInitialized) {
            this.isInitialized = true;
            this.fetchEmails();
        }
    }
}

// メールウィジェットのインスタンスを作成
const mailWidget = new MailWidget();

// ページ読み込み完了後に初期化
document.addEventListener('DOMContentLoaded', () => {
    mailWidget.initialize();
});

export default mailWidget; 