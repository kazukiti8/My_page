# My Serene Start Page 🌟

美しく機能的なスタートページ - 天気、ブックマーク、ToDoリスト、ニュースフィード、システム情報監視機能付き

## ✨ 機能

- 🌤️ **リアルタイム天気情報** - OpenWeatherMap APIを使用
- 📚 **ブックマーク管理** - カテゴリー別整理

- 📝 **クイックノート** - メモ機能
- 📰 **ニュースフィード** - RSS/Atom対応
- 📅 **Googleカレンダー** - スケジュール表示
- 🗺️ **Googleマップ** - 位置情報
- 💻 **システム情報** - CPU、メモリ、ディスク使用率
- 🎨 **テーマカスタマイズ** - ダーク/ライトモード
- 📱 **PWA対応** - オフライン動作
- 🔒 **セキュリティ** - CSP、HTTPS対応

## 🚀 クイックスタート

### 開発環境

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

### 本番環境

```bash
# 本番用ビルド
npm run build

# 本番サーバーを起動
npm start
```

## 📦 インストール

1. **リポジトリをクローン**

   ```bash
   git clone https://github.com/yourusername/my-serene-start-page.git
   cd my-serene-start-page
   ```

2. **依存関係をインストール**

   ```bash
   npm install
   ```

3. **環境変数を設定**

   ```bash
   cp env.example .env
   # .envファイルを編集してAPIキーを設定
   ```

4. **サーバーを起動**
   ```bash
   npm start
   ```

## 🔧 設定

### 環境変数

`.env`ファイルで以下の設定が可能です：

```env
# OpenWeatherMap API Key
OPENWEATHER_API_KEY=your_api_key_here

# Server Port
PORT=3000

# Environment
NODE_ENV=production
```

### APIキーの取得

1. **OpenWeatherMap API**
   - [OpenWeatherMap](https://openweathermap.org/api)に登録
   - 無料プランでAPIキーを取得
   - `.env`ファイルに設定

## 🎨 カスタマイズ

### テーマ

- ダーク/ライトモードの切り替え
- カラーテーマの変更
- 背景画像の設定

### ウィジェット

- ブックマークの追加/編集
- ニュースフィードの設定
- ToDoリストの管理

## 📱 PWA機能

- オフライン対応
- ホーム画面への追加
- プッシュ通知（将来実装予定）

## 🔒 セキュリティ

- Content Security Policy (CSP)
- HTTPS対応
- XSS対策
- CSRF対策

## 🚀 デプロイ

### Heroku

```bash
# Heroku CLIをインストール
heroku create your-app-name
git push heroku main
```

### Vercel

```bash
# Vercel CLIをインストール
npm i -g vercel
vercel --prod
```

### Netlify

```bash
# Netlify CLIをインストール
npm i -g netlify-cli
netlify deploy --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📁 プロジェクト構造

```
my-serene-start-page/
├── css/                 # スタイルシート
│   ├── main.css        # メインCSS
│   ├── theme.css       # テーマCSS
│   └── input.css       # Tailwind入力
├── js/                  # JavaScript
│   ├── app.js          # メインアプリ
│   ├── weather.js      # 天気機能
│   ├── bookmarks.js    # ブックマーク
│   ├── news.js         # ニュース機能
│   ├── system-info.js  # システム情報
│   └── ...             # その他のモジュール
├── server.js           # Expressサーバー
├── index.html          # 開発用HTML
├── index.prod.html     # 本番用HTML
├── sw.js              # Service Worker
├── package.json       # 依存関係
└── README.md          # このファイル
```

## 🛠️ 開発

### 利用技術

- **フロントエンド**: HTML5, CSS3, JavaScript (ES6+)
- **バックエンド**: Node.js, Express
- **スタイリング**: Tailwind CSS
- **アイコン**: Font Awesome
- **API**: OpenWeatherMap, Google Calendar, Google Maps

### 開発コマンド

```bash
# 開発サーバー
npm run dev

# 本番ビルド
npm run build

# 静的ファイルサーバー
npm run serve

# セキュリティチェック
npm run security-check
```

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 🙏 謝辞

- [OpenWeatherMap](https://openweathermap.org/) - 天気API
- [Tailwind CSS](https://tailwindcss.com/) - CSSフレームワーク
- [Font Awesome](https://fontawesome.com/) - アイコン
- [Google APIs](https://developers.google.com/) - カレンダー・マップAPI

## 📞 サポート

問題や質問がある場合は、[Issues](https://github.com/yourusername/my-serene-start-page/issues)で報告してください。

---

⭐ このプロジェクトが役に立ったら、スターを付けてください！
