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

### 2. APIキーの設定

#### OpenWeatherMap API（天気予報機能）
1. [OpenWeatherMap](https://openweathermap.org/api) でアカウントを作成
2. APIキーを取得
3. `server.js` の `OPENWEATHER_API_KEY` を実際のAPIキーに置き換え

```javascript
const OPENWEATHER_API_KEY = 'your_actual_api_key_here';
```

#### Unsplash API（背景画像）
- 現在は無料のAPIキーを使用しています
- 必要に応じて独自のAPIキーに変更可能

### 3. サーバーの起動
```bash
npm start
```

または、PM2を使用：
```bash
pm2 start ecosystem.config.js
```

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

## ライセンス

ISC License 