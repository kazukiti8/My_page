// 天気データの管理
let weatherData = null;

// 天気アイコンのマッピング
const weatherIcons = {
    '01d': 'fas fa-sun',           // 晴れ
    '01n': 'fas fa-moon',          // 晴れ（夜）
    '02d': 'fas fa-cloud-sun',     // 曇り時々晴れ
    '02n': 'fas fa-cloud-moon',    // 曇り時々晴れ（夜）
    '03d': 'fas fa-cloud',         // 曇り
    '03n': 'fas fa-cloud',         // 曇り（夜）
    '04d': 'fas fa-cloud',         // 曇り
    '04n': 'fas fa-cloud',         // 曇り（夜）
    '09d': 'fas fa-cloud-rain',    // 小雨
    '09n': 'fas fa-cloud-rain',    // 小雨（夜）
    '10d': 'fas fa-cloud-sun-rain', // 雨時々晴れ
    '10n': 'fas fa-cloud-moon-rain', // 雨時々晴れ（夜）
    '11d': 'fas fa-bolt',          // 雷雨
    '11n': 'fas fa-bolt',          // 雷雨（夜）
    '13d': 'fas fa-snowflake',     // 雪
    '13n': 'fas fa-snowflake',     // 雪（夜）
    '50d': 'fas fa-smog',          // 霧
    '50n': 'fas fa-smog'           // 霧（夜）
};

// 天気データを取得
async function fetchWeatherData() {
    try {
        const response = await fetch('/api/weather');
        if (!response.ok) {
            throw new Error(`Weather data fetch failed: ${response.status}`);
        }
        weatherData = await response.json();
        updateWeatherDisplay();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showWeatherError();
    }
}

// 天気表示を更新
function updateWeatherDisplay() {
    if (!weatherData) return;

    const weatherContainer = document.querySelector('.left-column .blur-bg:last-child');
    if (!weatherContainer) return;

    const iconClass = weatherIcons[weatherData.icon] || 'fas fa-cloud';
    
    weatherContainer.innerHTML = `
        <div class="flex items-center mb-2">
            <i class="${iconClass} text-3xl mr-3"></i>
            <div>
                <div class="text-xl font-semibold">${weatherData.description}</div>
                <div class="text-sm">${weatherData.location}, ${weatherData.country}</div>
            </div>
        </div>
        <div class="text-2xl font-bold">${weatherData.temperature}°C</div>
        <div class="text-sm mt-1">H: ${weatherData.temp_max}° L: ${weatherData.temp_min}°</div>
        <div class="text-xs mt-1 text-gray-300">湿度: ${weatherData.humidity}% | 風速: ${weatherData.wind_speed}m/s</div>
    `;
}

// 天気エラー表示
function showWeatherError() {
    const weatherContainer = document.querySelector('.left-column .blur-bg:last-child');
    if (!weatherContainer) return;

    weatherContainer.innerHTML = `
        <div class="flex items-center mb-2">
            <i class="fas fa-exclamation-triangle text-3xl mr-3 text-yellow-400"></i>
            <div>
                <div class="text-xl font-semibold">天気データ取得エラー</div>
                <div class="text-sm">データを更新できませんでした</div>
            </div>
        </div>
        <div class="text-sm mt-2">
            <button id="retry-weather-btn" class="text-blue-400 hover:text-blue-300">
                <i class="fas fa-sync-alt mr-1"></i>再試行
            </button>
        </div>
    `;
    
    // 再試行ボタンのイベントリスナーを追加
    document.getElementById('retry-weather-btn').addEventListener('click', fetchWeatherData);
}

// 位置情報を取得して天気データを更新
function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherDataWithCoords(latitude, longitude);
            },
            (error) => {
                console.log('Location access denied, using default city');
                fetchWeatherData();
            }
        );
    } else {
        fetchWeatherData();
    }
}

// 緯度・経度で天気データを取得
async function fetchWeatherDataWithCoords(lat, lon) {
    try {
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) {
            throw new Error(`Weather data fetch failed: ${response.status}`);
        }
        weatherData = await response.json();
        updateWeatherDisplay();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        showWeatherError();
    }
}

// 初期化
export function initWeather() {
    getLocationAndWeather();
    // 30分ごとに天気データを更新
    setInterval(getLocationAndWeather, 30 * 60 * 1000);
}

// グローバルスコープで利用できるようにする
window.fetchWeatherData = fetchWeatherData; 