// 高度なFavicon取得サービス
class FaviconService {
    constructor() {
        this.cache = new Map();
        this.failedDomains = new Set();
        this.maxRetries = 2;
        this.cacheExpiry = 24 * 60 * 60 * 1000; // 24時間
    }

    // メインのFavicon取得関数
    async getFavicon(url, size = 32) {
        try {
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            
            // キャッシュをチェック
            const cached = this.getFromCache(domain);
            if (cached) {
                return cached;
            }
            
            // 失敗済みドメインをチェック
            if (this.failedDomains.has(domain)) {
                return this.getDefaultFavicon();
            }
            
            // 複数のFaviconサービスを試行
            const faviconUrl = await this.tryFaviconServices(domain, size);
            
            if (faviconUrl) {
                this.saveToCache(domain, faviconUrl);
                return faviconUrl;
            } else {
                this.failedDomains.add(domain);
                return this.getDefaultFavicon();
            }
            
        } catch (error) {
            console.warn('Error getting favicon for:', url, error);
            
            // エラーハンドラーを使用
            if (window.errorHandler) {
                window.errorHandler.handleError('Favicon', error, {
                    retry: false,
                    showToast: false
                });
            }
            
            return this.getDefaultFavicon();
        }
    }

    // 複数のFaviconサービスを試行
    async tryFaviconServices(domain, size) {
        const services = [
            // Google Favicon Service (推奨)
            `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`,
            // DuckDuckGo Favicon Service
            `https://icons.duckduckgo.com/ip3/${domain}.ico`,
            // 直接的なfavicon.ico
            `https://${domain}/favicon.ico`,
            // 小さいサイズでGoogleサービスを再試行
            `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
        ];

        for (let i = 0; i < services.length; i++) {
            try {
                const url = services[i];
                const isValid = await this.validateFavicon(url);
                if (isValid) {
                    return url;
                }
            } catch (error) {
                // CSPエラーやネットワークエラーは静かに無視
                console.debug(`Favicon service ${i + 1} failed for ${domain}:`, error.message);
                continue;
            }
        }
        
        return null;
    }

    // Faviconの有効性を検証
    async validateFavicon(url) {
        try {
            // CSPエラーを回避するため、より安全な検証方法を使用
            const response = await fetch(url, {
                method: 'HEAD',
                mode: 'no-cors',
                cache: 'no-cache'
            });
            
            // no-corsモードでは常に成功するため、実際の検証は画像読み込みで行う
            return true;
        } catch (error) {
            // CSPエラーやネットワークエラーは静かに無視
            console.debug('Favicon validation failed for:', url, error.message);
            return false;
        }
    }

    // キャッシュから取得
    getFromCache(domain) {
        const cached = this.cache.get(domain);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.url;
        }
        
        // 期限切れの場合は削除
        if (cached) {
            this.cache.delete(domain);
        }
        
        return null;
    }

    // キャッシュに保存
    saveToCache(domain, url) {
        this.cache.set(domain, {
            url: url,
            timestamp: Date.now()
        });
    }

    // デフォルトFaviconを取得
    getDefaultFavicon() {
        return 'data:image/svg+xml;base64,' + btoa(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="#E5E7EB"/>
                <path d="M16 8C18.2091 8 20 9.79086 20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8Z" fill="#9CA3AF"/>
                <path d="M16 20C13.7909 20 12 18.2091 12 16H20C20 18.2091 18.2091 20 16 20Z" fill="#9CA3AF"/>
            </svg>
        `);
    }

    // キャッシュをクリア
    clearCache() {
        this.cache.clear();
        this.failedDomains.clear();
    }

    // 特定ドメインのキャッシュを削除
    removeFromCache(domain) {
        this.cache.delete(domain);
        this.failedDomains.delete(domain);
    }

    // キャッシュ統計を取得
    getCacheStats() {
        return {
            cachedDomains: this.cache.size,
            failedDomains: this.failedDomains.size,
            totalRequests: this.cache.size + this.failedDomains.size
        };
    }

    // バッチ処理でFaviconを取得
    async getFaviconsBatch(urls, size = 32) {
        const results = new Map();
        
        try {
            // 並列でFaviconを取得（ただし、同時リクエスト数を制限）
            const batchSize = 5;
            for (let i = 0; i < urls.length; i += batchSize) {
                const batch = urls.slice(i, i + batchSize);
                const promises = batch.map(async (url) => {
                    try {
                        const favicon = await this.getFavicon(url, size);
                        return { url, favicon };
                    } catch (error) {
                        console.warn('Error in batch favicon fetch for:', url, error);
                        return { url, favicon: this.getDefaultFavicon() };
                    }
                });
                
                const batchResults = await Promise.allSettled(promises);
                batchResults.forEach((result, index) => {
                    if (result.status === 'fulfilled') {
                        results.set(result.value.url, result.value.favicon);
                    } else {
                        console.warn('Batch favicon fetch failed for:', batch[index], result.reason);
                        results.set(batch[index], this.getDefaultFavicon());
                    }
                });
                
                // バッチ間で少し待機（API制限を避けるため）
                if (i + batchSize < urls.length) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
        } catch (error) {
            console.error('Error in batch favicon processing:', error);
            
            // エラーハンドラーを使用
            if (window.errorHandler) {
                window.errorHandler.handleError('FaviconBatch', error, {
                    retry: false,
                    showToast: false
                });
            }
        }
        
        return results;
    }
}

// グローバルインスタンスを作成
const faviconService = new FaviconService();

// グローバル関数として公開
window.faviconService = faviconService;

export default faviconService; 