# My Serene Start Page

自分だけのオリジナルスタートページです。美しい背景画像、時計、天気予報、ニュースフィード、ブックマーク管理、ToDoリスト、メモ帳機能を備えています。

## 機能

- 🌅 **背景画像表示** - Unsplash APIを使用した美しい自然画像
- ⏰ **時計・日付表示** - リアルタイムの時刻と日付
- 🌤️ **天気予報** - OpenWeatherMap APIを使用した現在の天気
- 📰 **ニュースフィード** - 複数のRSSフィードから最新ニュース
- 🔖 **ブックマーク管理** - カテゴリ別のブックマーク管理
- ✅ **ToDoリスト** - タスク管理機能
- 📝 **メモ帳** - 簡単なメモ機能
- 🔍 **検索機能** - Google検索連携

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定

#### 環境変数ファイルの作成
```bash
cp env.example .env
```

#### APIキーの設定

**OpenWeatherMap API（天気予報機能）**
1. [OpenWeatherMap](https://openweathermap.org/api) でアカウントを作成
2. APIキーを取得
3. `.env` ファイルの `OPENWEATHER_API_KEY` を実際のAPIキーに置き換え

**Unsplash API（背景画像）**
1. [Unsplash Developers](https://unsplash.com/developers) でアカウントを作成
2. アプリケーションを作成してAccess Keyを取得
3. `.env` ファイルの `UNSPLASH_ACCESS_KEY` を実際のAPIキーに置き換え

```bash
# .env ファイルの例
OPENWEATHER_API_KEY=your_actual_openweather_api_key_here
UNSPLASH_ACCESS_KEY=your_actual_unsplash_access_key_here
PORT=3000
NODE_ENV=development
```

### 3. サーバーの起動
```bash
npm start
```

または、PM2を使用：
```bash
pm2 start ecosystem.config.js
```

## セキュリティ機能

- 🔒 **環境変数によるAPIキー管理** - APIキーをソースコードから分離
- 🛡️ **セキュリティヘッダー** - XSS、クリックジャッキング、コンテンツスニッフィング保護
- 🔐 **CORS設定** - 適切なオリジン制限
- 🚫 **APIキーのクライアントサイド露出防止** - すべてのAPI呼び出しをサーバーサイドで処理

## エラーハンドリング機能

- 🚨 **包括的なエラーハンドリング** - グローバルエラー、Promiseエラー、ネットワークエラーの自動検出
- 🔄 **自動リトライ機能** - 一時的なエラーに対する自動復旧（最大3回）
- 📊 **エラー分類システム** - HTTPエラー、ネットワークエラー、APIエラー、タイムアウトエラーの適切な分類
- 📝 **エラーログ機能** - ローカルストレージにエラーログを保存（最新10件）
- 🔔 **ユーザー通知** - エラーの重要度に応じたトースト通知とモーダル表示
- 🛠️ **並列処理エラーハンドリング** - ニュースフィードの並列取得時の個別エラー処理
- 📈 **エラー統計** - セッション中のエラー発生回数の追跡

## 使用方法

### 天気予報
- 位置情報の許可を求められた場合は許可してください
- 位置情報が利用できない場合は、デフォルトで東京の天気を表示

### ニュースフィード
- 右カラムの「+」ボタンでフィードを追加
- プリセットフィードから選択可能
- 手動でRSSフィードURLを入力可能

### ブックマーク
- 中央カラムでカテゴリとブックマークを管理
- ホバー時に編集・削除ボタンが表示

## 技術スタック

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **CSSフレームワーク**: Tailwind CSS
- **アイコン**: Font Awesome
- **バックエンド**: Node.js, Express
- **外部API**: OpenWeatherMap, Unsplash, RSSフィード
- **データ保存**: ブラウザ ローカルストレージ
- **セキュリティ**: dotenv, セキュリティヘッダー, CORS

## カスタマイズ

### デフォルト都市の変更
`server.js` の `DEFAULT_CITY` を変更：
```javascript
const DEFAULT_CITY = 'Osaka,JP'; // 大阪に変更
```

### 天気更新間隔の変更
`js/weather.js` の更新間隔を変更：
```javascript
setInterval(getLocationAndWeather, 30 * 60 * 1000); // 30分間隔
```

## トラブルシューティング

### APIキーエラー
- `.env` ファイルが正しく作成されているか確認
- APIキーが有効で、適切な権限が設定されているか確認
- サーバーを再起動して環境変数を読み込み直す

### 背景画像が表示されない
- Unsplash APIキーが正しく設定されているか確認
- ネットワーク接続を確認
- ブラウザのコンソールでエラーメッセージを確認

### エラーハンドリングの確認
- ブラウザのコンソールでエラーログを確認
- ローカルストレージの `errorLogs` を確認
- ネットワークタブでAPI呼び出しの状況を確認

### エラーハンドリングテスト
```bash
# エラーハンドリング機能のテスト
npm run test-error-handling

# セキュリティ設定の確認
npm run security-check
```

### エラーログの確認方法
1. ブラウザの開発者ツールを開く（F12）
2. コンソールタブでエラーメッセージを確認
3. アプリケーションタブ > ローカルストレージで `errorLogs` を確認
4. エラーの詳細情報と統計を確認

### よくあるエラーと対処法
- **401 Unauthorized**: APIキーが無効または期限切れ
- **429 Too Many Requests**: API制限に達した（しばらく待ってから再試行）
- **Network Error**: インターネット接続を確認
- **Timeout Error**: サーバーの応答が遅い（自動リトライされます）

## ライセンス

ISC License 