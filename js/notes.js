// メモ帳管理
const notesArea = document.getElementById('notes-area');
const saveNoteBtn = document.getElementById('save-note-btn');
let notes = localStorage.getItem('notes') || '';

export function loadNotes() {
    notesArea.value = notes;
}

export function setupNotesEvents() {
    saveNoteBtn.addEventListener('click', () => {
        notes = notesArea.value;
        localStorage.setItem('notes', notes);
        const originalText = saveNoteBtn.textContent;
        saveNoteBtn.textContent = 'Saved!';
        setTimeout(() => {
            saveNoteBtn.textContent = originalText;
        }, 2000);
    });
} 