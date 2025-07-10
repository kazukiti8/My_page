// ===================================================================================
// Weather Module
// ===================================================================================

// 天気アイコンのマッピング
const weatherIcons = {
  '01d': 'fas fa-sun',
  '01n': 'fas fa-moon',
  '02d': 'fas fa-cloud-sun',
  '02n': 'fas fa-cloud-moon',
  '03d': 'fas fa-cloud',
  '03n': 'fas fa-cloud',
  '04d': 'fas fa-cloud',
  '04n': 'fas fa-cloud',
  '09d': 'fas fa-cloud-rain',
  '09n': 'fas fa-cloud-rain',
  '10d': 'fas fa-cloud-sun-rain',
  '10n': 'fas fa-cloud-moon-rain',
  '11d': 'fas fa-bolt',
  '11n': 'fas fa-bolt',
  '13d': 'fas fa-snowflake',
  '13n': 'fas fa-snowflake',
  '50d': 'fas fa-smog',
  '50n': 'fas fa-smog',
};

// -----------------------------------------------------------------------------------
// State Management
// -----------------------------------------------------------------------------------

const weatherState = {
  weatherData: null,
  forecastData: null,
  isLoading: false,
  lastUpdate: null,
  locationError: false,
};

// -----------------------------------------------------------------------------------
// API Client
// -----------------------------------------------------------------------------------

/**
 * APIからデータを非同期に取得する汎用関数
 * @param {string} url - 取得先のURL
 * @returns {Promise<object>} - 取得したJSONデータ
 */
async function fetchApi(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.details || `HTTP ${response.status}: ${response.statusText}`
    );
  }
  return response.json();
}

/**
 * 現在の天気データを取得する
 * @param {object|null} coords - { lat, lon } 形式の座標オブジェクト
 * @returns {Promise<object>} - 天気データ
 */
function fetchCurrentWeather(coords) {
  let url = '/api/weather';
  if (coords) {
    url += `?lat=${coords.lat}&lon=${coords.lon}`;
  }
  return fetchApi(url);
}

/**
 * 天気予報データを取得する
 * @param {object|null} coords - { lat, lon } 形式の座標オブジェクト
 * @returns {Promise<object>} - 予報データ
 */
function fetchWeatherForecast(coords) {
  let url = '/api/forecast';
  if (coords) {
    url += `?lat=${coords.lat}&lon=${coords.lon}`;
  }
  return fetchApi(url);
}

/**
 * ブラウザから現在の位置情報を取得する (Promise版)
 * @returns {Promise<object>} - 座標オブジェクト { latitude, longitude }
 */
function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported.'));
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// -----------------------------------------------------------------------------------
// UI Rendering
// -----------------------------------------------------------------------------------

/**
 * 天気ウィジェットのUIを現在の状態に基づいて更新する
 */
function renderWeatherWidget() {
  const container = document.getElementById('weather-widget');
  if (!container) return;

  if (weatherState.isLoading) {
    container.innerHTML = getLoadingHTML();
    return;
  }

  if (!weatherState.weatherData) {
    container.innerHTML = getErrorHTML('天気データを取得できませんでした。');
    return;
  }

  // 今日の予報から最高・最低気温を取得
  const today = new Date().toISOString().split('T')[0];
  const todaysForecast = weatherState.forecastData?.find(
    (day) => day.date === today
  );

  const tempMax = todaysForecast?.temp_max ?? weatherState.weatherData.temp_max;
  const tempMin = todaysForecast?.temp_min ?? weatherState.weatherData.temp_min;

  container.innerHTML = getMainHTML(weatherState.weatherData, tempMax, tempMin);

  if (weatherState.forecastData) {
    renderForecast(weatherState.forecastData);
  } else {
    showForecastError('予報データがありません。');
  }

  // 更新ボタンにイベントリスナーを再設定
  const refreshBtn = document.getElementById('weather-refresh-btn');
  if (refreshBtn) {
    refreshBtn.onclick = (e) => {
      e.preventDefault();
      loadWeather();
    };
  }
}

/**
 * メインの天気情報HTMLを生成する
 * @param {object} data - 天気データ
 * @param {number} tempMax - 最高気温
 * @param {number} tempMin - 最低気温
 * @returns {string} - HTML文字列
 */
function getMainHTML(data, tempMax, tempMin) {
  const iconClass = weatherIcons[data.icon] || 'fas fa-cloud';
  const updateTime =
    weatherState.lastUpdate?.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit',
    }) || '';
  const windDirection = data.wind_deg ? getWindDirection(data.wind_deg) : '';
  const feelsLike = calculateFeelsLike(
    data.temperature,
    data.humidity,
    data.wind_speed
  );

  return `
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center cursor-pointer hover:bg-white hover:bg-opacity-10 rounded-lg p-2 transition-colors" onclick="window.open('https://weather.yahoo.co.jp/weather/jp/13/4410.html', '_blank')">
                <i class="${iconClass} text-3xl mr-3 text-yellow-400"></i>
                <div>
                    <div class="text-xl font-semibold">${data.description}</div>
                    <div class="text-sm text-gray-300">${data.location}, ${data.country}</div>
                </div>
                <i class="fas fa-external-link-alt ml-2 text-sm opacity-60"></i>
            </div>
            <button id="weather-refresh-btn" class="text-blue-400 hover:text-blue-300 transition-colors" title="天気を更新">
                <i class="fas fa-sync-alt"></i>
            </button>
        </div>
        <div class="grid grid-cols-2 gap-4 mb-3">
            <div>
                <div class="text-3xl font-bold">${data.temperature}°C</div>
                <div class="text-sm text-gray-300">体感: ${feelsLike}°C</div>
            </div>
            <div class="text-right">
                <div class="text-sm">
                    <span class="text-red-400">H: ${tempMax}°</span><br>
                    <span class="text-blue-400">L: ${tempMin}°</span>
                </div>
            </div>
        </div>
        <div class="text-xs text-gray-300 mb-3">
            <i class="fas fa-tint mr-1"></i>湿度: ${data.humidity}% | 
            <i class="fas fa-wind mr-1"></i>風速: ${data.wind_speed}m/s
            ${windDirection ? ` | <i class="fas fa-compass mr-1"></i>${windDirection}` : ''}
        </div>
        ${
          updateTime
            ? `<div class="text-xs text-gray-400 mb-3">
            <i class="fas fa-clock mr-1"></i>最終更新: ${updateTime}
        </div>`
            : ''
        }
        <div id="weather-forecast" class="mt-4 border-t border-white border-opacity-10 pt-3"></div>
    `;
}

/**
 * 5日間予報のUIをレンダリングする
 * @param {Array<object>} forecast - 予報データ配列
 */
function renderForecast(forecast) {
  const container = document.getElementById('weather-forecast');
  if (!container) return;

  container.innerHTML = `
        <div class="text-xs font-semibold mb-2">5日間予報</div>
        <div class="grid grid-cols-5 gap-2">
            ${forecast.map((day) => getForecastDayHTML(day)).join('')}
        </div>
    `;
}

/**
 * 予報日1日分のHTMLを生成する
 * @param {object} day - 1日分の予報データ
 * @returns {string} - HTML文字列
 */
function getForecastDayHTML(day) {
  const iconClass = weatherIcons[day.icon] || 'fas fa-cloud';
  const date = new Date(day.date);
  const dayLabel = date.toLocaleDateString('ja-JP', { weekday: 'short' });
  const dateLabel = date.toLocaleDateString('ja-JP', {
    month: 'numeric',
    day: 'numeric',
  });

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
}

/**
 * ローディング中の表示HTMLを返す
 * @returns {string} HTML文字列
 */
function getLoadingHTML() {
  return `
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
    `;
}

/**
 * エラー表示用のHTMLを返す
 * @param {string} errorMessage - 表示するエラーメッセージ
 * @returns {string} HTML文字列
 */
function getErrorHTML(errorMessage) {
  return `
        <div class="flex items-center justify-between mb-3">
            <div class="flex items-center">
                <i class="fas fa-exclamation-triangle text-3xl mr-3 text-red-400"></i>
                <div>
                    <div class="text-xl font-semibold">エラー</div>
                    <div class="text-sm text-gray-300">情報を取得できませんでした</div>
                </div>
            </div>
            <button id="weather-refresh-btn" class="text-blue-400 hover:text-blue-300 transition-colors" title="再試行">
                <i class="fas fa-redo"></i>
            </button>
        </div>
        <div class="text-xs mt-3 p-2 bg-red-50 bg-opacity-50 rounded-lg border border-red-200 border-opacity-50">
            <span class="text-red-300">${errorMessage}</span>
        </div>
    `;
}

/**
 * 予報データ取得失敗時のHTMLを表示する
 * @param {string} errorMessage - エラーメッセージ
 */
function showForecastError(errorMessage) {
  const container = document.getElementById('weather-forecast');
  if (!container) return;
  container.innerHTML = `<div class="text-xs text-red-300">${errorMessage}</div>`;
}

// -----------------------------------------------------------------------------------
// Main Logic
// -----------------------------------------------------------------------------------

/**
 * 天気情報の読み込みと表示を行うメイン関数
 */
async function loadWeather() {
  if (weatherState.isLoading) return;

  weatherState.isLoading = true;
  weatherState.locationError = false;
  renderWeatherWidget();

  let coords = null;
  try {
    const position = await getCurrentLocation();
    coords = { lat: position.coords.latitude, lon: position.coords.longitude };
  } catch (error) {
    console.warn('Could not get location:', error.message);
    weatherState.locationError = true;
  }

  try {
    const [weatherResult, forecastResult] = await Promise.allSettled([
      fetchCurrentWeather(coords),
      fetchWeatherForecast(coords),
    ]);

    if (weatherResult.status === 'fulfilled') {
      weatherState.weatherData = weatherResult.value;
      weatherState.lastUpdate = new Date();
    } else {
      throw new Error(
        `現在の天気を取得できませんでした: ${weatherResult.reason.message}`
      );
    }

    if (forecastResult.status === 'fulfilled') {
      weatherState.forecastData = forecastResult.value;
    } else {
      console.error('Forecast fetch failed:', forecastResult.reason.message);
      weatherState.forecastData = null; // 失敗時はデータをクリア
    }
  } catch (error) {
    console.error('Weather loading failed:', error);
    weatherState.weatherData = null; // エラー時はデータをクリア
    if (window.errorHandler) {
      window.errorHandler.handleError('Weather', error, { showToast: true });
    }
  } finally {
    weatherState.isLoading = false;
    renderWeatherWidget();

    if (window.showToast && !weatherState.weatherData) {
      // エラーメッセージはerrorHandlerに任せる
    } else if (window.showToast) {
      let message = '天気情報を更新しました';
      if (weatherState.locationError) {
        message += ' (位置情報が使えず、デフォルト都市で表示)';
      }
      window.showToast.success(message);
    }
  }
}

// -----------------------------------------------------------------------------------
// Initializer
// -----------------------------------------------------------------------------------

/**
 * 天気モジュールを初期化する
 */
export function initWeather() {
  loadWeather();
  setInterval(loadWeather, 30 * 60 * 1000); // 30分ごとに自動更新

  // グローバルスコープに関数を公開（HTMLのonclickなどで使用）
  window.refreshWeather = loadWeather;
}

// -----------------------------------------------------------------------------------
// Helper Functions (unchanged)
// -----------------------------------------------------------------------------------

function getWindDirection(degrees) {
  const directions = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function calculateFeelsLike(temp, humidity, windSpeed) {
  let feelsLike = temp;
  if (windSpeed > 0) feelsLike -= windSpeed * 0.5;
  if (temp > 25 && humidity > 60) feelsLike += (humidity - 60) * 0.1;
  return Math.round(feelsLike);
}

// (Modal related functions are unchanged and kept for simplicity)
function showDayDetail(
  date,
  description,
  temp,
  tempMax,
  tempMin,
  humidity,
  windSpeed,
  icon
) {
  const modal = document.getElementById('day-detail-modal');
  if (!modal) return;
  const iconClass = weatherIcons[icon] || 'fas fa-cloud';
  const dayDate = new Date(date);
  const dayLabel = dayDate.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
  modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold">${dayLabel}</h3>
                <button onclick="hideDayDetail()" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
            </div>
            <div class="text-center mb-4">
                <i class="${iconClass} text-4xl text-yellow-400 mb-2"></i>
                <div class="text-2xl font-bold">${temp}°C</div>
                <div class="text-gray-600">${description}</div>
            </div>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="bg-gray-50 rounded-lg p-3"><div class="font-semibold text-gray-700">最高気温</div><div class="text-red-500 text-lg">${tempMax}°C</div></div>
                <div class="bg-gray-50 rounded-lg p-3"><div class="font-semibold text-gray-700">最低気温</div><div class="text-blue-500 text-lg">${tempMin}°C</div></div>
                ${humidity ? `<div class="bg-gray-50 rounded-lg p-3"><div class="font-semibold text-gray-700">湿度</div><div class="text-blue-600 text-lg">${humidity}%</div></div>` : ''}
                ${windSpeed ? `<div class="bg-gray-50 rounded-lg p-3"><div class="font-semibold text-gray-700">風速</div><div class="text-gray-600 text-lg">${windSpeed}m/s</div></div>` : ''}
            </div>
        </div>
    `;
  modal.classList.remove('hidden');
}
function hideDayDetail() {
  const modal = document.getElementById('day-detail-modal');
  if (modal) modal.classList.add('hidden');
}
window.showDayDetail = showDayDetail;
window.hideDayDetail = hideDayDetail;
document.addEventListener('click', (e) => {
  const modal = document.getElementById('day-detail-modal');
  if (
    modal &&
    !modal.contains(e.target) &&
    !e.target.closest('[onclick^="showDayDetail"]')
  ) {
    hideDayDetail();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideDayDetail();
});
