// 背景画像の管理（サーバーサイドAPI経由）
const backgroundElement = document.getElementById('background');
let retryCount = 0;
const maxRetries = 3;

export function loadBackgroundImage() {
    const query = 'nature,landscape,scenic,peaceful';
    const url = `/api/background?query=${encodeURIComponent(query)}`;
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.imageUrl) {
                backgroundElement.style.backgroundImage = `url(${data.imageUrl})`;
                backgroundElement.style.opacity = '1';
                
                // 背景画像の明度を自動調整
                adjustBackgroundBrightness(data.imageUrl);
                
                // 写真家情報を保存（将来的な機能拡張用）
                if (data.photographer) {
                    localStorage.setItem('lastBackgroundPhotographer', data.photographer);
                }
                
                // 成功時にリトライカウントをリセット
                retryCount = 0;
                
            } else if (data.fallback) {
                // フォールバック画像を使用
                backgroundElement.style.backgroundImage = `url(${data.fallback})`;
                backgroundElement.style.opacity = '1';
                console.warn('Using fallback background image');
                
                // エラーハンドラーを使用
                if (window.errorHandler) {
                    window.errorHandler.handleError('Background', new Error('Using fallback image'), {
                        retry: false,
                        showToast: false
                    });
                }
            }
        })
        .catch(error => {
            console.error('Error loading background image:', error);
            retryCount++;
            
            // エラーハンドラーを使用
            if (window.errorHandler) {
                window.errorHandler.handleError('Background', error, {
                    retry: retryCount <= maxRetries,
                    retryFunction: () => {
                        console.log(`Retrying background image load (attempt ${retryCount})`);
                        setTimeout(loadBackgroundImage, 3000);
                    },
                    showToast: false // 背景画像エラーは静かに処理
                });
            }
            
            // デフォルトのフォールバック画像
            backgroundElement.style.backgroundImage = 'url(https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)';
            backgroundElement.style.opacity = '1';
        });
}

// 背景画像の明度を自動調整する関数
function adjustBackgroundBrightness(imageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 画像をキャンバスに描画
        ctx.drawImage(img, 0, 0);
        
        // 画像の平均明度を計算
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let totalBrightness = 0;
        
        // サンプリングして明度を計算（パフォーマンス向上のため）
        const sampleSize = Math.min(1000, data.length / 4);
        for (let i = 0; i < sampleSize; i++) {
            const index = Math.floor(Math.random() * (data.length / 4)) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            // 明度計算（RGBの加重平均）
            const brightness = (r * 0.299 + g * 0.587 + b * 0.114);
            totalBrightness += brightness;
        }
        
        const averageBrightness = totalBrightness / sampleSize;
        
        // 明度に基づいてUI要素のスタイルを調整
        adjustUIForBrightness(averageBrightness);
    };
    img.src = imageUrl;
}

// 明度に基づいてUI要素のスタイルを調整
function adjustUIForBrightness(brightness) {
    const root = document.documentElement;
    
    if (brightness > 150) {
        // 明るい背景の場合
        root.style.setProperty('--ui-opacity', '0.9');
        root.style.setProperty('--text-shadow', '0 2px 4px rgba(0, 0, 0, 0.4)');
        root.style.setProperty('--blur-strength', '20px');
    } else if (brightness > 100) {
        // 中程度の明度の場合
        root.style.setProperty('--ui-opacity', '0.8');
        root.style.setProperty('--text-shadow', '0 1px 3px rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--blur-strength', '15px');
    } else {
        // 暗い背景の場合
        root.style.setProperty('--ui-opacity', '0.7');
        root.style.setProperty('--text-shadow', '0 1px 2px rgba(0, 0, 0, 0.2)');
        root.style.setProperty('--blur-strength', '10px');
    }
} 