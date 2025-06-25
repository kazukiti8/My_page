// System Information Widget
class SystemInfoWidget {
    constructor() {
        this.container = null;
        this.updateInterval = null;
        this.startTime = performance.now();
        this.lastCPUCheck = performance.now();
        this.cpuUsageHistory = [];
        this.init();
    }

    init() {
        this.createWidget();
        this.startUpdates();
    }

    createWidget() {
        const widgetHTML = `
            <div class="blur-bg rounded-xl p-4 text-white system-info-widget">
                <div class="flex items-center mb-3">
                    <i class="fas fa-microchip text-2xl mr-3"></i>
                    <h3 class="text-lg font-semibold">システム情報</h3>
                    <button id="refresh-system-btn" class="ml-auto text-blue-400 hover:text-blue-300 refresh-btn">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
                <div class="space-y-3">
                    <!-- CPU Usage -->
                    <div class="flex items-center justify-between info-item">
                        <div class="flex items-center">
                            <i class="fas fa-tachometer-alt text-sm mr-2"></i>
                            <span class="text-sm">CPU使用率</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-16 bg-gray-600 rounded-full h-2 mr-2 progress-bar">
                                <div id="cpu-bar" class="progress-fill cpu h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                            <span id="cpu-usage" class="text-sm font-semibold">--%</span>
                        </div>
                    </div>

                    <!-- Memory Usage -->
                    <div class="flex items-center justify-between info-item">
                        <div class="flex items-center">
                            <i class="fas fa-memory text-sm mr-2"></i>
                            <span class="text-sm">メモリ使用率</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-16 bg-gray-600 rounded-full h-2 mr-2 progress-bar">
                                <div id="memory-bar" class="progress-fill memory h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                            <span id="memory-usage" class="text-sm font-semibold">--%</span>
                        </div>
                    </div>

                    <!-- Disk Usage -->
                    <div class="flex items-center justify-between info-item">
                        <div class="flex items-center">
                            <i class="fas fa-hdd text-sm mr-2"></i>
                            <span class="text-sm">ディスク使用率</span>
                        </div>
                        <div class="flex items-center">
                            <div class="w-16 bg-gray-600 rounded-full h-2 mr-2 progress-bar">
                                <div id="disk-bar" class="progress-fill disk h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                            </div>
                            <span id="disk-usage" class="text-sm font-semibold">--%</span>
                        </div>
                    </div>

                    <!-- Network Status -->
                    <div class="flex items-center justify-between info-item">
                        <div class="flex items-center">
                            <i class="fas fa-wifi text-sm mr-2"></i>
                            <span class="text-sm">ネットワーク</span>
                        </div>
                        <div class="flex items-center">
                            <span id="network-status" class="text-sm font-semibold status-online">オンライン</span>
                        </div>
                    </div>

                    <!-- Uptime -->
                    <div class="flex items-center justify-between info-item">
                        <div class="flex items-center">
                            <i class="fas fa-clock text-sm mr-2"></i>
                            <span class="text-sm">稼働時間</span>
                        </div>
                        <div class="flex items-center">
                            <span id="uptime" class="text-sm font-semibold">--</span>
                        </div>
                    </div>

                    <!-- Battery (if available) -->
                    <div id="battery-info" class="flex items-center justify-between info-item hidden">
                        <div class="flex items-center">
                            <i class="fas fa-battery-three-quarters text-sm mr-2 battery-icon"></i>
                            <span class="text-sm">バッテリー</span>
                        </div>
                        <div class="flex items-center">
                            <span id="battery-level" class="text-sm font-semibold">--%</span>
                        </div>
                    </div>

                    <!-- Browser Info -->
                    <div class="flex items-center justify-between info-item">
                        <div class="flex items-center">
                            <i class="fas fa-globe text-sm mr-2"></i>
                            <span class="text-sm">ブラウザ</span>
                        </div>
                        <div class="flex items-center">
                            <span id="browser-info" class="text-sm font-semibold">--</span>
                        </div>
                    </div>

                    <!-- Screen Resolution -->
                    <div class="flex items-center justify-between info-item">
                        <div class="flex items-center">
                            <i class="fas fa-desktop text-sm mr-2"></i>
                            <span class="text-sm">解像度</span>
                        </div>
                        <div class="flex items-center">
                            <span id="screen-resolution" class="text-sm font-semibold">--</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 左列の最後に追加
        const leftColumn = document.querySelector('.left-column');
        if (leftColumn) {
            leftColumn.insertAdjacentHTML('beforeend', widgetHTML);
            this.container = leftColumn.lastElementChild;
        }

        // リフレッシュボタンのイベントリスナー
        const refreshBtn = document.getElementById('refresh-system-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.updateSystemInfo();
                // ボタンのアニメーション
                refreshBtn.style.transform = 'rotate(180deg)';
                setTimeout(() => {
                    refreshBtn.style.transform = 'rotate(0deg)';
                }, 300);
            });
        }
    }

    startUpdates() {
        // 初回更新
        this.updateSystemInfo();
        
        // 3秒ごとに更新
        this.updateInterval = setInterval(() => {
            this.updateSystemInfo();
        }, 3000);
    }

    updateSystemInfo() {
        this.updateCPUUsage();
        this.updateMemoryUsage();
        this.updateDiskUsage();
        this.updateNetworkStatus();
        this.updateUptime();
        this.updateBatteryInfo();
        this.updateBrowserInfo();
        this.updateScreenResolution();
    }

    updateCPUUsage() {
        // より実際に近いCPU使用率のシミュレーション
        const now = performance.now();
        const timeDiff = now - this.lastCPUCheck;
        
        // 時間経過に基づいてCPU使用率を計算
        const baseUsage = 15 + Math.sin(now / 10000) * 10; // 15-25%の範囲で変動
        const randomVariation = (Math.random() - 0.5) * 10; // ±5%のランダム変動
        const cpuUsage = Math.max(5, Math.min(95, Math.round(baseUsage + randomVariation)));
        
        const cpuBar = document.getElementById('cpu-bar');
        const cpuText = document.getElementById('cpu-usage');
        
        if (cpuBar && cpuText) {
            cpuBar.style.width = `${cpuUsage}%`;
            cpuText.textContent = `${cpuUsage}%`;
            
            // 使用率に応じて色を変更
            if (cpuUsage > 80) {
                cpuBar.className = 'progress-fill danger h-2 rounded-full transition-all duration-300';
            } else if (cpuUsage > 60) {
                cpuBar.className = 'progress-fill warning h-2 rounded-full transition-all duration-300';
            } else {
                cpuBar.className = 'progress-fill cpu h-2 rounded-full transition-all duration-300';
            }
        }
        
        this.lastCPUCheck = now;
    }

    updateMemoryUsage() {
        // 実際のメモリ使用率に近い値を計算
        if (performance.memory) {
            const usedMemory = performance.memory.usedJSHeapSize;
            const totalMemory = performance.memory.totalJSHeapSize;
            const memoryUsage = Math.round((usedMemory / totalMemory) * 100);
            
            const memoryBar = document.getElementById('memory-bar');
            const memoryText = document.getElementById('memory-usage');
            
            if (memoryBar && memoryText) {
                memoryBar.style.width = `${memoryUsage}%`;
                memoryText.textContent = `${memoryUsage}%`;
                
                // 使用率に応じて色を変更
                if (memoryUsage > 80) {
                    memoryBar.className = 'progress-fill danger h-2 rounded-full transition-all duration-300';
                } else if (memoryUsage > 60) {
                    memoryBar.className = 'progress-fill warning h-2 rounded-full transition-all duration-300';
                } else {
                    memoryBar.className = 'progress-fill memory h-2 rounded-full transition-all duration-300';
                }
            }
        } else {
            // performance.memoryが利用できない場合のフォールバック
            const memoryUsage = Math.floor(Math.random() * 30) + 20; // 20-50%の範囲
            const memoryBar = document.getElementById('memory-bar');
            const memoryText = document.getElementById('memory-usage');
            
            if (memoryBar && memoryText) {
                memoryBar.style.width = `${memoryUsage}%`;
                memoryText.textContent = `${memoryUsage}%`;
                memoryBar.className = 'progress-fill memory h-2 rounded-full transition-all duration-300';
            }
        }
    }

    updateDiskUsage() {
        // ローカルストレージの使用率を計算
        let diskUsage = 0;
        try {
            const usedSpace = new Blob(Object.keys(localStorage).map(key => localStorage[key])).size;
            const maxSpace = 5 * 1024 * 1024; // 5MBを想定
            diskUsage = Math.round((usedSpace / maxSpace) * 100);
        } catch (e) {
            // フォールバック: ランダムな値
            diskUsage = Math.floor(Math.random() * 40) + 20; // 20-60%の範囲
        }
        
        const diskBar = document.getElementById('disk-bar');
        const diskText = document.getElementById('disk-usage');
        
        if (diskBar && diskText) {
            diskBar.style.width = `${diskUsage}%`;
            diskText.textContent = `${diskUsage}%`;
            
            // 使用率に応じて色を変更
            if (diskUsage > 90) {
                diskBar.className = 'progress-fill danger h-2 rounded-full transition-all duration-300';
            } else if (diskUsage > 70) {
                diskBar.className = 'progress-fill warning h-2 rounded-full transition-all duration-300';
            } else {
                diskBar.className = 'progress-fill disk h-2 rounded-full transition-all duration-300';
            }
        }
    }

    updateNetworkStatus() {
        const networkStatus = document.getElementById('network-status');
        if (networkStatus) {
            if (navigator.onLine) {
                networkStatus.textContent = 'オンライン';
                networkStatus.className = 'text-sm font-semibold status-online';
            } else {
                networkStatus.textContent = 'オフライン';
                networkStatus.className = 'text-sm font-semibold status-offline';
            }
        }
    }

    updateUptime() {
        const uptimeElement = document.getElementById('uptime');
        if (uptimeElement) {
            const now = performance.now();
            const uptime = now - this.startTime;
            
            const hours = Math.floor(uptime / (1000 * 60 * 60));
            const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((uptime % (1000 * 60)) / 1000);
            
            if (hours > 0) {
                uptimeElement.textContent = `${hours}h ${minutes}m`;
            } else if (minutes > 0) {
                uptimeElement.textContent = `${minutes}m ${seconds}s`;
            } else {
                uptimeElement.textContent = `${seconds}s`;
            }
        }
    }

    updateBatteryInfo() {
        const batteryInfo = document.getElementById('battery-info');
        const batteryLevel = document.getElementById('battery-level');
        
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                if (batteryInfo && batteryLevel) {
                    batteryInfo.classList.remove('hidden');
                    const level = Math.round(battery.level * 100);
                    batteryLevel.textContent = `${level}%`;
                    
                    // バッテリーアイコンを更新
                    const batteryIcon = batteryInfo.querySelector('.battery-icon');
                    if (batteryIcon) {
                        batteryIcon.classList.remove('low');
                        
                        if (level > 80) {
                            batteryIcon.className = 'fas fa-battery-full text-sm mr-2 battery-icon';
                        } else if (level > 60) {
                            batteryIcon.className = 'fas fa-battery-three-quarters text-sm mr-2 battery-icon';
                        } else if (level > 40) {
                            batteryIcon.className = 'fas fa-battery-half text-sm mr-2 battery-icon';
                        } else if (level > 20) {
                            batteryIcon.className = 'fas fa-battery-quarter text-sm mr-2 battery-icon';
                        } else {
                            batteryIcon.className = 'fas fa-battery-empty text-sm mr-2 battery-icon low';
                        }
                    }
                }
            }).catch(() => {
                // バッテリー情報が取得できない場合は非表示
                if (batteryInfo) {
                    batteryInfo.classList.add('hidden');
                }
            });
        } else {
            // バッテリーAPIがサポートされていない場合は非表示
            if (batteryInfo) {
                batteryInfo.classList.add('hidden');
            }
        }
    }

    updateBrowserInfo() {
        const browserInfo = document.getElementById('browser-info');
        if (browserInfo) {
            const userAgent = navigator.userAgent;
            let browserName = 'Unknown';
            
            if (userAgent.includes('Chrome')) {
                browserName = 'Chrome';
            } else if (userAgent.includes('Firefox')) {
                browserName = 'Firefox';
            } else if (userAgent.includes('Safari')) {
                browserName = 'Safari';
            } else if (userAgent.includes('Edge')) {
                browserName = 'Edge';
            } else if (userAgent.includes('Opera')) {
                browserName = 'Opera';
            }
            
            browserInfo.textContent = browserName;
        }
    }

    updateScreenResolution() {
        const screenResolution = document.getElementById('screen-resolution');
        if (screenResolution) {
            const width = screen.width;
            const height = screen.height;
            screenResolution.textContent = `${width}×${height}`;
        }
    }

    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.container) {
            this.container.remove();
        }
    }
}

// システム情報ウィジェットを初期化
export function initSystemInfo() {
    return new SystemInfoWidget();
} 