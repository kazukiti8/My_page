// メインアプリケーション初期化
import { loadBackgroundImage } from './background.js';
import { updateClock } from './clock.js';
import { setupSearchBox } from './search.js';
import { renderCategories, setupBookmarkEvents } from './bookmarks.js';
import { renderTodos, setupTodoEvents } from './todo.js';
import { loadNotes, setupNotesEvents } from './notes.js';
import { initNews } from './news.js';
import { initWeather } from './weather.js';
import toast from './toast.js';
import shortcuts from './shortcuts.js';
import themeManager from './theme.js';
import errorHandler from './error-handler.js';

function init() {
    try {
        // エラーハンドラーの初期化
        console.log('🔒 エラーハンドリングシステムを初期化中...');
        
        // 各モジュールの初期化
        updateClock();
        setInterval(updateClock, 1000);
        loadBackgroundImage();
        renderCategories();
        renderTodos();
        loadNotes();
        initNews();
        initWeather();
        setupSearchBox();
        setupBookmarkEvents();
        setupTodoEvents();
        setupNotesEvents();
        

        
        // 初期化完了メッセージ
        console.log('✅ アプリケーションの初期化が完了しました');
        
        // 成功メッセージを表示
        if (window.showToast) {
            window.showToast.success('アプリケーションが正常に起動しました', 2000);
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