// 個人用設定ファイル
// このファイルを編集して自分の好みにカスタマイズしてください

const personalConfig = {
  // デフォルト都市（天気表示用）
  defaultCity: 'Tokyo,JP', // 例: 'Osaka,JP', 'Kyoto,JP', 'Yokohama,JP'

  // デフォルトのGoogleカレンダーID
  calendarId: 'ririnnba8@gmail.com', // 自分のGoogleカレンダーIDに変更

  // デフォルトの地図位置（Googleマップ用）
  defaultMapLocation: {
    lat: 35.6812, // 緯度
    lng: 139.7671, // 経度
    zoom: 12, // ズームレベル
  },

  // デフォルトのニュースフィード
  defaultNewsFeeds: [
    {
      name: 'Googleニュース（日本）',
      url: 'https://news.google.com/rss?hl=ja&gl=JP&ceid=JP:ja',
    },
    {
      name: 'Yahoo!ニュース',
      url: 'https://news.yahoo.co.jp/rss/topics/top-picks.xml',
    },
  ],

  // デフォルトのブックマークカテゴリー
  defaultBookmarkCategories: [
    {
      name: 'よく使うサイト',
      bookmarks: [
        { name: 'Google', url: 'https://www.google.com' },
        { name: 'YouTube', url: 'https://www.youtube.com' },
        { name: 'GitHub', url: 'https://github.com' },
      ],
    },
    {
      name: 'ニュース',
      bookmarks: [
        { name: 'Yahoo!ニュース', url: 'https://news.yahoo.co.jp' },
        { name: 'NHKニュース', url: 'https://www3.nhk.or.jp/news' },
      ],
    },
  ],

  // テーマ設定
  theme: {
    defaultTheme: 'light', // 'light' または 'dark'
    defaultColor: 'blue', // 'blue', 'green', 'purple', 'orange', 'red'
    autoTheme: true, // 時間に応じて自動でテーマを切り替え
  },

  // 更新間隔（ミリ秒）
  updateIntervals: {
    weather: 30 * 60 * 1000, // 30分
    news: 15 * 60 * 1000, // 15分
    systemInfo: 5 * 1000, // 5秒
  },

  // 表示設定
  display: {
    showSystemInfo: true, // システム情報を表示
    showWeather: true, // 天気を表示
    showNews: true, // ニュースを表示
    showCalendar: true, // カレンダーを表示
    showMap: true, // マップを表示
    showTodo: true, // ToDoリストを表示
    showNotes: true, // メモを表示
  },
};

// 設定をエクスポート
if (typeof module !== 'undefined' && module.exports) {
  module.exports = personalConfig;
} else {
  window.personalConfig = personalConfig;
}
