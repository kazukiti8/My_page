// 天気データの管理
let weatherData = null;

// 天気アイコンのマッピング（OpenWeatherMap API用）
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
            console.warn('Weather API not available, showing default weather display');
            showDefaultWeather();
            return;
        }
        weatherData = await response.json();
        updateWeatherDisplay();
    } catch (error) {
        console.warn('Error fetching weather data:', error);
        showDefaultWeather();
    }
}

// 天気表示を更新
function updateWeatherDisplay() {
    if (!weatherData) return;

    const weatherContainer = document.querySelector('.left-column .blur-bg:last-child');
    if (!weatherContainer) return;

    const iconClass = weatherIcons[weatherData.icon] || 'fas fa-cloud';
    
    weatherContainer.innerHTML = `
        <div class="flex items-center mb-2 cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors" onclick="window.open('https://weather.yahoo.co.jp/weather/jp/13/4410.html', '_blank')">
            <i class="${iconClass} text-3xl mr-3"></i>
            <div>
                <div class="text-xl font-semibold">${weatherData.description}</div>
                <div class="text-sm">${weatherData.location}, ${weatherData.country}</div>
            </div>
            <i class="fas fa-external-link-alt ml-auto text-sm opacity-60"></i>
        </div>
        <div class="text-2xl font-bold">${weatherData.temperature}°C</div>
        <div class="text-sm mt-1">H: ${weatherData.temp_max}° L: ${weatherData.temp_min}°</div>
        <div class="text-xs mt-1 text-gray-300">湿度: ${weatherData.humidity}% | 風速: ${weatherData.wind_speed}m/s</div>
        <div id="weather-forecast" class="mt-4 border-t border-white border-opacity-10 pt-2"></div>
    `;
}

// デフォルトの天気表示
function showDefaultWeather() {
    const weatherContainer = document.querySelector('.left-column .blur-bg:last-child');
    if (!weatherContainer) return;

    weatherContainer.innerHTML = `
        <div class="flex items-center mb-2 cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors" onclick="window.open('https://weather.yahoo.co.jp/weather/jp/13/4410.html', '_blank')">
            <i class="fas fa-cloud-sun text-3xl mr-3"></i>
            <div>
                <div class="text-xl font-semibold">天気情報</div>
                <div class="text-sm">APIキーを設定してください</div>
            </div>
            <i class="fas fa-external-link-alt ml-auto text-sm opacity-60"></i>
        </div>
        <div class="text-2xl font-bold">--°C</div>
        <div class="text-sm mt-1">H: --° L: --°</div>
        <div class="text-xs mt-1 text-gray-300">湿度: --% | 風速: --m/s</div>
        <div class="text-xs mt-2 text-yellow-400">
            <i class="fas fa-exclamation-triangle mr-1"></i>
            OpenWeatherMap APIキーを設定してください
        </div>
        <div id="weather-forecast" class="mt-4 border-t border-white border-opacity-10 pt-2">
            <div class="text-xs font-semibold mb-2">5日間予報</div>
            <div class="flex justify-between space-x-2">
                <div class="flex flex-col items-center flex-1 bg-white bg-opacity-10 rounded-lg p-2">
                    <div class="text-xs font-medium">--</div>
                    <div class="text-xs text-gray-300">--/--</div>
                    <i class="fas fa-cloud text-lg my-1"></i>
                    <div class="text-xs font-semibold">--°</div>
                    <div class="text-xs text-gray-300">--°/--°</div>
                </div>
                <div class="flex flex-col items-center flex-1 bg-white bg-opacity-10 rounded-lg p-2">
                    <div class="text-xs font-medium">--</div>
                    <div class="text-xs text-gray-300">--/--</div>
                    <i class="fas fa-cloud text-lg my-1"></i>
                    <div class="text-xs font-semibold">--°</div>
                    <div class="text-xs text-gray-300">--°/--°</div>
                </div>
                <div class="flex flex-col items-center flex-1 bg-white bg-opacity-10 rounded-lg p-2">
                    <div class="text-xs font-medium">--</div>
                    <div class="text-xs text-gray-300">--/--</div>
                    <i class="fas fa-cloud text-lg my-1"></i>
                    <div class="text-xs font-semibold">--°</div>
                    <div class="text-xs text-gray-300">--°/--°</div>
                </div>
                <div class="flex flex-col items-center flex-1 bg-white bg-opacity-10 rounded-lg p-2">
                    <div class="text-xs font-medium">--</div>
                    <div class="text-xs text-gray-300">--/--</div>
                    <i class="fas fa-cloud text-lg my-1"></i>
                    <div class="text-xs font-semibold">--°</div>
                    <div class="text-xs text-gray-300">--°/--°</div>
                </div>
                <div class="flex flex-col items-center flex-1 bg-white bg-opacity-10 rounded-lg p-2">
                    <div class="text-xs font-medium">--</div>
                    <div class="text-xs text-gray-300">--/--</div>
                    <i class="fas fa-cloud text-lg my-1"></i>
                    <div class="text-xs font-semibold">--°</div>
                    <div class="text-xs text-gray-300">--°/--°</div>
                </div>
            </div>
        </div>
    `;
}

// 5日間予報を取得
async function fetchForecast(lat, lon) {
    try {
        let url = '/api/forecast';
        if (lat && lon) {
            url += `?lat=${lat}&lon=${lon}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            console.warn('Forecast API not available, skipping forecast display');
            return;
        }
        const forecast = await response.json();
        renderForecast(forecast);
    } catch (e) {
        console.warn('Error fetching forecast:', e);
        // エラーが発生してもアプリケーションを停止させない
    }
}

// 5日間予報を表示
function renderForecast(forecast) {
    const container = document.getElementById('weather-forecast');
    if (!container) return;
    if (!forecast || forecast.length === 0) {
        container.innerHTML = '<div class="text-xs text-gray-300">予報データなし</div>';
        return;
    }
    container.innerHTML = `
        <div class="text-xs font-semibold mb-2">5日間予報</div>
        <div class="flex justify-between space-x-2">
            ${forecast.map(day => {
                const iconClass = weatherIcons[day.icon] || 'fas fa-cloud';
                const date = new Date(day.date);
                const dayLabel = date.toLocaleDateString('ja-JP', { weekday: 'short' });
                const dateLabel = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
                return `
                    <div class="flex flex-col items-center flex-1 bg-white bg-opacity-10 rounded-lg p-2">
                        <div class="text-xs font-medium">${dayLabel}</div>
                        <div class="text-xs text-gray-300">${dateLabel}</div>
                        <i class="${iconClass} text-lg my-1"></i>
                        <div class="text-xs font-semibold">${day.temp}°</div>
                        <div class="text-xs text-gray-300">${day.temp_min}°/${day.temp_max}°</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 位置情報を取得して天気データを更新
function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherDataWithCoords(latitude, longitude);
                fetchForecast(latitude, longitude);
            },
            (error) => {
                console.log('Location access denied, using default city');
                fetchWeatherData();
                fetchForecast();
            }
        );
    } else {
        fetchWeatherData();
        fetchForecast();
    }
}

// 緯度・経度で天気データを取得
async function fetchWeatherDataWithCoords(lat, lon) {
    try {
        const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
        if (!response.ok) {
            console.warn('Weather API not available, showing default weather display');
            showDefaultWeather();
            return;
        }
        weatherData = await response.json();
        updateWeatherDisplay();
    } catch (error) {
        console.warn('Error fetching weather data:', error);
        showDefaultWeather();
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
