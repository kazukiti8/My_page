// メインアプリケーション初期化
import { loadBackgroundImage } from './background.js';
import { updateClock } from './clock.js';
import { setupSearchBox } from './search.js';
import { renderCategories, setupBookmarkEvents } from './bookmarks.js';


import { initNews } from './news.js';
import { initWeather } from './weather.js';
import toast from './toast.js';
import shortcuts from './shortcuts.js';
import themeManager from './theme.js';
import errorHandler from './error-handler.js';

function init() {
    try {
        // トースト通知コンテナの確認
        const toastContainer = document.getElementById('toast-container');
        console.log('Toast container found:', !!toastContainer); // デバッグログを追加
        
        // エラーハンドラーの初期化
        console.log('🔒 エラーハンドリングシステムを初期化中...');
        
        // 各モジュールの初期化
        updateClock();
        setInterval(updateClock, 1000);
        loadBackgroundImage();
        renderCategories();

        initNews();
        initWeather();
        setupSearchBox();
        setupBookmarkEvents();

        

        
        // 初期化完了メッセージ
        console.log('✅ アプリケーションの初期化が完了しました');
        
        // 成功メッセージを表示
        console.log('Checking toast notification system...'); // デバッグログを追加
        if (window.showToast) {
            console.log('Toast system available, showing startup message'); // デバッグログを追加
            window.showToast.success('アプリケーションが正常に起動しました', 2000);
        } else {
            console.log('Toast notification system not available'); // デバッグログを追加
        }
        
    } catch (error) {
        console.error('アプリケーション初期化エラー:', error);
        
        // エラーハンドラーを使用
        if (window.errorHandler) {
            window.errorHandler.handleError('AppInit', error, {
                retry: false,
                showModal: true
            });
        }
    }
}

// ページ読み込み完了時の初期化
document.addEventListener('DOMContentLoaded', init);

// ページ離脱時のエラーログ保存
window.addEventListener('beforeunload', () => {
    if (window.errorHandler) {
        const stats = window.errorHandler.getErrorStats();
        if (Object.keys(stats).length > 0) {
            console.log('📊 セッション中のエラー統計:', stats);
        }
    }
}); 