// メインアプリケーション初期化
import { loadBackgroundImage } from './background.js';
import { updateClock } from './clock.js';
import { setupSearchBox } from './search.js';
import { renderCategories, setupBookmarkEvents } from './bookmarks.js';
import { renderTodos, setupTodoEvents } from './todo.js';
import { loadNotes, setupNotesEvents } from './notes.js';
import { initNews } from './news.js';

function init() {
    updateClock();
    setInterval(updateClock, 1000);
    loadBackgroundImage();
    renderCategories();
    renderTodos();
    loadNotes();
    initNews();
    setupSearchBox();
    setupBookmarkEvents();
    setupTodoEvents();
    setupNotesEvents();
}

document.addEventListener('DOMContentLoaded', init); 