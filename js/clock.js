// 時計・日付・曜日の管理
const clockElement = document.getElementById('clock');
const dateElement = document.getElementById('date');
const dayElement = document.getElementById('day');

export function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    dateElement.textContent = now.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    dayElement.textContent = now.toLocaleDateString(undefined, { weekday: 'long' });
} 