// 天気データの管理
let weatherData = null;
let forecastData = null;
let isLoading = false;
let lastUpdate = null;
let retryCount = 0;
const maxRetries = 3;
// 詳細表示機能を削除

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

// 風向きの変換
function getWindDirection(degrees) {
    const directions = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// 体感温度を計算（簡易版）
function calculateFeelsLike(temp, humidity, windSpeed) {
    // 簡易的な体感温度計算（風冷効果と湿度を考慮）
    let feelsLike = temp;
    
    // 風冷効果（風速が強いほど体感温度が下がる）
    if (windSpeed > 0) {
        feelsLike -= windSpeed * 0.5;
    }
    
    // 湿度効果（高温高湿度の場合は体感温度が上がる）
    if (temp > 25 && humidity > 60) {
        feelsLike += (humidity - 60) * 0.1;
    }
    
    return Math.round(feelsLike);
}

// 天気データを取得
async function fetchWeatherData() {
    console.log('fetchWeatherData called'); // デバッグログを追加
    if (isLoading) {
        console.log('Weather is already loading, skipping fetchWeatherData'); // デバッグログを追加
        return;
    }
    
    console.log('Starting weather data fetch...'); // デバッグログを追加
    isLoading = true;
    showLoadingWeather();
    
    try {
        console.log('Fetching weather from /api/weather'); // デバッグログを追加
        const response = await fetch('/api/weather');
        console.log(`Weather API response status: ${response.status}`); // デバッグログを追加
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.details || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        weatherData = await response.json();
        console.log('Weather data received:', weatherData); // デバッグログを追加
        lastUpdate = new Date();
        retryCount = 0; // 成功時にリトライカウントをリセット
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        retryCount++;
        
        // エラーハンドラーを使用
        if (window.errorHandler) {
            window.errorHandler.handleError('Weather', error, {
                retry: retryCount <= maxRetries,
                retryFunction: () => {
                    console.log(`Retrying weather fetch (attempt ${retryCount})`);
                    setTimeout(fetchWeatherData, 2000);
                }
            });
        }
        
        showWeatherError(error.message);
        
    } finally {
        isLoading = false;
    }
}

// 天気表示を更新
function updateWeatherDisplay() {
    if (!weatherData) return;

    // 今日の日付を "YYYY-MM-DD" 形式で取得
    const today = new Date().toISOString().split('T')[0];

    // 予報データがあれば、今日の最高・最低気温で weatherData を更新
    if (forecastData && forecastData.length > 0) {
        const todaysForecast = forecastData.find(day => day.date === today);
        if (todaysForecast) {
            weatherData.temp_max = todaysForecast.temp_max;
            weatherData.temp_min = todaysForecast.temp_min;
        }
    }

    const weatherContainer = document.getElementById('weather-widget');
    if (!weatherContainer) return;

    const iconClass = weatherIcons[weatherData.icon] || 'fas fa-cloud';
    const updateTime = lastUpdate ? lastUpdate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }) : '';
    const windDirection = weatherData.wind_deg ? getWindDirection(weatherData.wind_deg) : '';
    const feelsLike = calculateFeelsLike(weatherData.temperature, weatherData.humidity, weatherData.wind_speed);
    
    weatherContainer.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors" onclick="window.open('https://weather.yahoo.co.jp/weather/jp/13/4410.html', '_blank')">
                <i class="${iconClass} text-3xl mr-3 text-yellow-400"></i>
                <div>
                    <div class="text-xl font-semibold">${weatherData.description}</div>
                    <div class="text-sm text-gray-300">${weatherData.location}, ${weatherData.country}</div>
                </div>
                <i class="fas fa-external-link-alt ml-2 text-sm opacity-60"></i>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="refreshWeather()" class="text-blue-400 hover:text-blue-300 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}" title="${isLoading ? '更新中...' : '天気を更新'}" id="weather-refresh-btn">
                    <i class="fas fa-sync-alt ${isLoading ? 'animate-spin' : ''}"></i>
                </button>
            </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
                <div class="text-3xl font-bold">${weatherData.temperature}°C</div>
                <div class="text-sm text-gray-300">体感: ${feelsLike}°C</div>
            </div>
            <div class="text-right">
                <div class="text-sm">
                    <span class="text-red-400">H: ${weatherData.temp_max}°</span><br>
                    <span class="text-blue-400">L: ${weatherData.temp_min}°</span>
                </div>
            </div>
        </div>
        
        <div class="text-xs text-gray-300 mb-3">
            <i class="fas fa-tint mr-1"></i>湿度: ${weatherData.humidity}% | 
            <i class="fas fa-wind mr-1"></i>風速: ${weatherData.wind_speed}m/s
            ${windDirection ? ` | <i class="fas fa-compass mr-1"></i>${windDirection}` : ''}
        </div>
        
        ${updateTime ? `<div class="text-xs text-gray-400 mb-3">
            <i class="fas fa-clock mr-1"></i>最終更新: ${updateTime}
            <span class="ml-2 text-green-400">
                <i class="fas fa-check-circle mr-1"></i>最新
            </span>
        </div>` : ''}
        <div id="weather-forecast" class="mt-4 border-t border-white border-opacity-10 pt-3"></div>
    `;
    
    // 5日間予報を表示
    if (forecastData) {
        renderForecast(forecastData);
    }
    
    // 更新ボタンが正しく生成されたかを確認
    const refreshBtn = document.getElementById('weather-refresh-btn');
    if (refreshBtn) {
        console.log('Weather refresh button found and updated'); // デバッグログを追加
        // 既存のonclickイベントを削除して新しいイベントリスナーを追加
        refreshBtn.removeAttribute('onclick');
        refreshBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Weather refresh button clicked'); // デバッグログを追加
            
            // ローディング中はクリックを無効にする
            if (isLoading) {
                console.log('Weather is loading, ignoring click'); // デバッグログを追加
                return;
            }
            
            refreshWeather();
        });
    } else {
        console.warn('Weather refresh button not found'); // デバッグログを追加
    }
}

// 詳細表示機能を削除

// 読み込み中の天気表示
function showLoadingWeather() {
    const weatherContainer = document.getElementById('weather-widget');
    if (!weatherContainer) return;

    weatherContainer.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
                <i class="fas fa-cloud-sun text-3xl mr-3 text-yellow-400"></i>
                <div>
                    <div class="text-xl font-semibold">天気を取得中...</div>
                    <div class="text-sm text-gray-300">位置情報を確認中</div>
                </div>
            </div>
            <i class="fas fa-sync-alt animate-spin text-blue-400"></i>
        </div>
        <div class="text-3xl font-bold mb-2">--°C</div>
        <div class="text-sm mb-2">H: --° | L: --°</div>
        <div class="text-xs text-gray-300">湿度: --% | 風速: --m/s</div>
        <div id="weather-forecast" class="mt-4 border-t border-white border-opacity-10 pt-3">
            <div class="text-center py-4">
                <i class="fas fa-spinner animate-spin text-2xl text-blue-400 mb-2"></i>
                <div class="text-sm text-gray-300">予報データを取得中...</div>
            </div>
        </div>
    `;
}

// エラー時の天気表示
function showWeatherError(errorMessage) {
    const weatherContainer = document.getElementById('weather-widget');
    if (!weatherContainer) return;

    const retryButton = retryCount < maxRetries ? 
        `<button onclick="refreshWeather()" class="text-blue-400 hover:text-blue-300 transition-colors" title="再試行">
            <i class="fas fa-redo"></i>
        </button>` : 
        `<button onclick="refreshWeather()" class="text-gray-400 hover:text-gray-300 transition-colors" title="手動で再試行">
            <i class="fas fa-redo"></i>
        </button>`;

    weatherContainer.innerHTML = `
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors" onclick="window.open('https://weather.yahoo.co.jp/weather/jp/13/4410.html', '_blank')">
                <i class="fas fa-cloud-sun text-3xl mr-3 text-yellow-400"></i>
                <div>
                    <div class="text-xl font-semibold">天気情報</div>
                    <div class="text-sm text-gray-300">エラーが発生しました</div>
                </div>
                <i class="fas fa-external-link-alt ml-2 text-sm opacity-60"></i>
            </div>
            ${retryButton}
        </div>
        <div class="text-3xl font-bold mb-2">--°C</div>
        <div class="text-sm mb-2">H: --° | L: --°</div>
        <div class="text-xs text-gray-300">湿度: --% | 風速: --m/s</div>
        <div class="text-xs mt-3 p-2 bg-red-50 bg-opacity-50 rounded-lg border border-red-200 border-opacity-50">
            <i class="fas fa-exclamation-triangle text-red-400 mr-1"></i>
            <span class="text-red-300">${errorMessage}</span>
            ${retryCount > 0 ? `<br><span class="text-xs text-gray-400">再試行回数: ${retryCount}/${maxRetries}</span>` : ''}
        </div>
        <div id="weather-forecast" class="mt-4 border-t border-white border-opacity-10 pt-3">
            <div class="text-center py-4">
                <i class="fas fa-exclamation-circle text-2xl text-red-400 mb-2"></i>
                <div class="text-sm text-gray-300">予報データを取得できませんでした</div>
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
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.details || `HTTP ${response.status}: ${response.statusText}`);
        }
        const forecast = await response.json();
        forecastData = forecast;
    } catch (error) {
        console.error('Error fetching forecast:', error);
        
        // エラーハンドラーを使用
        if (window.errorHandler) {
            window.errorHandler.handleError('Forecast', error, {
                retry: false, // 予報は重要ではないのでリトライしない
                showToast: false // 予報エラーは静かに処理
            });
        }
        
        showForecastError(error.message);
    }
}

// 5日間予報を表示
function renderForecast(forecast) {
    const container = document.getElementById('weather-forecast');
    if (!container) return;
    
    if (!forecast || forecast.length === 0) {
        container.innerHTML = `
            <div class="text-xs font-semibold mb-2">5日間予報</div>
            <div class="text-center py-4">
                <i class="fas fa-exclamation-circle text-2xl text-yellow-400 mb-2"></i>
                <div class="text-sm text-gray-300">予報データがありません</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <div class="text-xs font-semibold">5日間予報</div>
        </div>
        <div class="grid grid-cols-5 gap-2">
            ${forecast.map(day => {
                const iconClass = weatherIcons[day.icon] || 'fas fa-cloud';
                const date = new Date(day.date);
                const dayLabel = date.toLocaleDateString('ja-JP', { weekday: 'short' });
                const dateLabel = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
                
                return `
                    <div class="flex flex-col items-center bg-white bg-opacity-10 rounded-lg p-2 hover:bg-opacity-20 transition-colors cursor-pointer" 
                         onclick="showDayDetail('${day.date}', '${day.description}', ${day.temp}, ${day.temp_max}, ${day.temp_min}, ${day.humidity || 0}, ${day.wind_speed || 0}, '${day.icon}')">
                        <div class="text-xs font-medium">${dayLabel}</div>
                        <div class="text-xs text-gray-300">${dateLabel}</div>
                        <i class="${iconClass} text-lg my-1 text-yellow-400"></i>
                        <div class="text-xs font-semibold">${day.temp}°</div>
                        <div class="text-xs text-gray-300">
                            <span class="text-red-400">${day.temp_max}°</span>/<span class="text-blue-400">${day.temp_min}°</span>
                        </div>

                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// 予報詳細表示機能を削除

// 日別詳細を表示
function showDayDetail(date, description, temp, tempMax, tempMin, humidity, windSpeed, icon) {
    const modal = document.getElementById('day-detail-modal');
    if (!modal) return;
    
    const iconClass = weatherIcons[icon] || 'fas fa-cloud';
    const dayDate = new Date(date);
    const dayLabel = dayDate.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        weekday: 'long' 
    });
    
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">${dayLabel}</h3>
                <button onclick="hideDayDetail()" class="text-gray-500 hover:text-gray-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="text-center mb-4">
                <i class="${iconClass} text-4xl text-yellow-400 mb-2"></i>
                <div class="text-2xl font-bold">${temp}°C</div>
                <div class="text-gray-600">${description}</div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-gray-50 rounded-lg p-3">
                    <div class="font-semibold text-gray-700">最高気温</div>
                    <div class="text-red-500 text-lg">${tempMax}°C</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3">
                    <div class="font-semibold text-gray-700">最低気温</div>
                    <div class="text-blue-500 text-lg">${tempMin}°C</div>
                </div>
                ${humidity ? `
                    <div class="bg-gray-50 rounded-lg p-3">
                        <div class="font-semibold text-gray-700">湿度</div>
                        <div class="text-blue-600 text-lg">${humidity}%</div>
                    </div>
                ` : ''}
                ${windSpeed ? `
                    <div class="bg-gray-50 rounded-lg p-3">
                        <div class="font-semibold text-gray-700">風速</div>
                        <div class="text-gray-600 text-lg">${windSpeed}m/s</div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// 日別詳細を非表示
function hideDayDetail() {
    const modal = document.getElementById('day-detail-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// グローバル関数として公開
window.showDayDetail = showDayDetail;
window.hideDayDetail = hideDayDetail;

// モーダル外クリックで閉じる
document.addEventListener('click', (e) => {
    const modal = document.getElementById('day-detail-modal');
    if (modal && !modal.contains(e.target)) {
        hideDayDetail();
    }
});

// ESCキーでモーダルを閉じる
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideDayDetail();
    }
});

// 予報エラー表示
function showForecastError(errorMessage) {
    const container = document.getElementById('weather-forecast');
    if (!container) return;
    
    container.innerHTML = `
        <div class="text-xs font-semibold mb-2">5日間予報</div>
        <div class="text-center py-4">
            <i class="fas fa-exclamation-triangle text-2xl text-red-400 mb-2"></i>
            <div class="text-sm text-gray-300">予報データの取得に失敗しました</div>
            <div class="text-xs text-red-300 mt-1">${errorMessage}</div>
        </div>
    `;
}

// 位置情報を取得して天気データを更新
async function getLocationAndWeather() {
    console.log('getLocationAndWeather called');
    if (isLoading) {
        console.log('Weather is already loading, skipping getLocationAndWeather');
        return;
    }

    isLoading = true;
    showLoadingWeather();

    const fetchWithLocation = async (lat, lon) => {
        const weatherPromise = fetchWeatherDataWithCoords(lat, lon);
        const forecastPromise = fetchForecast(lat, lon);
        // エラーが発生しても処理が停止しないようにPromise.allSettledを使用
        await Promise.allSettled([weatherPromise, forecastPromise]);
    };

    const fetchWithoutLocation = async () => {
        const weatherPromise = fetchWeatherData();
        const forecastPromise = fetchForecast();
        await Promise.allSettled([weatherPromise, forecastPromise]);
    };

    try {
        let locationError = false;
        if (navigator.geolocation) {
            console.log('Geolocation is available, requesting position...');
            await new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log(`Location obtained: ${latitude}, ${longitude}`);
                        await fetchWithLocation(latitude, longitude);
                        resolve();
                    },
                    async (error) => {
                        console.log('Location access denied or failed, using default city. Error:', error.message);
                        locationError = true;
                        await fetchWithoutLocation();
                        resolve(); // エラーでも処理は継続
                    }
                );
            });
        } else {
            console.log('Geolocation not available, using default city');
            await fetchWithoutLocation();
        }

        // データ取得が成功したかどうかに基づいて表示を更新
        if (weatherData) {
            updateWeatherDisplay();
            if (window.showToast) {
                let message = '天気情報を更新しました';
                if (locationError) {
                    message += ' (位置情報が使えなかったため、デフォルトの都市)';
                }
                window.showToast.success(message);
            }
        } else {
            // fetchWeatherData内でエラー表示がされているはず
            console.log("Weather data is not available after fetch.");
        }

    } catch (error) {
        console.error('An unexpected error occurred in getLocationAndWeather:', error);
        showWeatherError('天気の取得中に予期せぬエラーが発生しました。');
    } finally {
        isLoading = false;
        // isLoading状態をUIに反映させるために再度呼び出す
        if (document.getElementById('weather-widget') && weatherData) {
             updateWeatherDisplay();
        }
    }
}

// 座標指定で天気データを取得
async function fetchWeatherDataWithCoords(lat, lon) {
    console.log(`fetchWeatherDataWithCoords called with lat: ${lat}, lon: ${lon}`); // デバッグログを追加
    try {
        const url = `/api/weather?lat=${lat}&lon=${lon}`;
        console.log(`Fetching weather from: ${url}`); // デバッグログを追加
        const response = await fetch(url);
        console.log(`Weather API response status: ${response.status}`); // デバッグログを追加
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.details || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        weatherData = await response.json();
        console.log('Weather data received:', weatherData); // デバッグログを追加
        lastUpdate = new Date();
        
    } catch (error) {
        console.error('Error fetching weather data with coordinates:', error);
        showWeatherError(error.message);
    }
}

// 天気を手動で更新
function refreshWeather() {
    console.log('refreshWeather called'); // デバッグログを追加
    if (isLoading) {
        console.log('Weather is already loading, skipping...'); // デバッグログを追加
        if (window.showToast) {
            window.showToast.info('天気情報を取得中です...');
        }
        return;
    }
    // 実際の処理はgetLocationAndWeatherに集約
    getLocationAndWeather();
}

// グローバル関数として公開
window.refreshWeather = refreshWeather;
console.log('refreshWeather function registered globally'); // デバッグログを追加

// 初期化
export function initWeather() {
    console.log('Initializing weather module...'); // デバッグログを追加
    
    // 初回読み込み
    getLocationAndWeather();
    
    // 30分ごとに自動更新
    setInterval(() => {
        if (!isLoading) {
            getLocationAndWeather();
        }
    }, 30 * 60 * 1000);
    
    // 更新ボタンのイベントリスナーを追加（念のため）
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Setting up weather refresh button event listeners...'); // デバッグログを追加
        // 既存のボタンにイベントリスナーを追加
        const refreshButtons = document.querySelectorAll('[onclick*="refreshWeather"]');
        refreshButtons.forEach(button => {
            console.log('Found refresh button:', button); // デバッグログを追加
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Refresh button clicked via event listener'); // デバッグログを追加
                refreshWeather();
            });
        });
    });
}

// グローバルスコープで利用できるようにする
window.fetchWeatherData = fetchWeatherData;


