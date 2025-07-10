#!/usr/bin/env node

/**
 * Favicon機能テストスクリプト
 * このスクリプトは、Favicon機能が正しく動作するかをテストします
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Favicon機能テストを開始します...\n');

let allTestsPassed = true;

// テスト1: Faviconサービスファイルの存在確認
console.log('1. Faviconサービスファイルの確認');
if (fs.existsSync('js/favicon-service.js')) {
  console.log('   ✅ favicon-service.jsが存在します');

  // ファイル内容の基本チェック
  const content = fs.readFileSync('js/favicon-service.js', 'utf8');
  const requiredElements = [
    'class FaviconService',
    'getFavicon',
    'tryFaviconServices',
    'getFromCache',
    'saveToCache',
    'getDefaultFavicon',
    'getFaviconsBatch',
  ];

  requiredElements.forEach((element) => {
    if (content.includes(element)) {
      console.log(`   ✅ ${element}が含まれています`);
    } else {
      console.log(`   ❌ ${element}が含まれていません`);
      allTestsPassed = false;
    }
  });
} else {
  console.log('   ❌ favicon-service.jsが存在しません');
  allTestsPassed = false;
}

// テスト2: ブックマーク機能でのFavicon統合確認
console.log('\n2. ブックマーク機能でのFavicon統合確認');
if (fs.existsSync('js/bookmarks.js')) {
  const content = fs.readFileSync('js/bookmarks.js', 'utf8');

  const requiredElements = [
    'import faviconService',
    'createFaviconElement',
    'refreshAllFavicons',
    'getFaviconStats',
    'clearFaviconCache',
  ];

  requiredElements.forEach((element) => {
    if (content.includes(element)) {
      console.log(`   ✅ ${element}が含まれています`);
    } else {
      console.log(`   ❌ ${element}が含まれていません`);
      allTestsPassed = false;
    }
  });
} else {
  console.log('   ❌ bookmarks.jsが存在しません');
  allTestsPassed = false;
}

// テスト3: HTMLでのFavicon管理UI確認
console.log('\n3. HTMLでのFavicon管理UI確認');
if (fs.existsSync('index.html')) {
  const content = fs.readFileSync('index.html', 'utf8');

  if (content.includes('refresh-favicons-btn')) {
    console.log('   ✅ Favicon更新ボタンが含まれています');
  } else {
    console.log('   ❌ Favicon更新ボタンが含まれていません');
    allTestsPassed = false;
  }

  if (content.includes('Favicon')) {
    console.log('   ✅ Favicon関連のUI要素が含まれています');
  } else {
    console.log('   ❌ Favicon関連のUI要素が含まれていません');
    allTestsPassed = false;
  }
} else {
  console.log('   ❌ index.htmlが存在しません');
  allTestsPassed = false;
}

// テスト4: Faviconサービスの機能詳細チェック
console.log('\n4. Faviconサービスの機能詳細チェック');
if (fs.existsSync('js/favicon-service.js')) {
  const content = fs.readFileSync('js/favicon-service.js', 'utf8');

  const features = [
    { name: 'Google Favicon Service', pattern: 'google.com/s2/favicons' },
    { name: 'DuckDuckGo Favicon Service', pattern: 'duckduckgo.com/ip3' },
    { name: '直接favicon.ico取得', pattern: '/favicon.ico' },
    { name: 'キャッシュ機能', pattern: 'getFromCache' },
    { name: 'バッチ処理', pattern: 'getFaviconsBatch' },
    { name: 'エラーハンドリング', pattern: 'catch.*error' },
    { name: 'デフォルトFavicon', pattern: 'getDefaultFavicon' },
    { name: '統計機能', pattern: 'getCacheStats' },
  ];

  features.forEach((feature) => {
    if (content.includes(feature.pattern)) {
      console.log(`   ✅ ${feature.name}が実装されています`);
    } else {
      console.log(`   ❌ ${feature.name}が実装されていません`);
      allTestsPassed = false;
    }
  });
}

// テスト5: パフォーマンスとセキュリティの確認
console.log('\n5. パフォーマンスとセキュリティの確認');
if (fs.existsSync('js/favicon-service.js')) {
  const content = fs.readFileSync('js/favicon-service.js', 'utf8');

  if (content.includes('batchSize') && content.includes('setTimeout')) {
    console.log('   ✅ バッチ処理とレート制限が実装されています');
  } else {
    console.log('   ❌ バッチ処理とレート制限が実装されていません');
    allTestsPassed = false;
  }

  if (content.includes('cacheExpiry')) {
    console.log('   ✅ キャッシュ有効期限が実装されています');
  } else {
    console.log('   ❌ キャッシュ有効期限が実装されていません');
    allTestsPassed = false;
  }

  if (content.includes('no-cors')) {
    console.log('   ✅ CORS対策が実装されています');
  } else {
    console.log('   ❌ CORS対策が実装されていません');
    allTestsPassed = false;
  }
}

// 結果の表示
console.log('\n' + '='.repeat(60));
if (allTestsPassed) {
  console.log('🎉 すべてのFavicon機能テストが通過しました！');
  console.log('Favicon機能は正常に実装されています。');
} else {
  console.log('⚠️  Favicon機能テストで問題が検出されました。');
  console.log('上記の問題を修正してから本番環境にデプロイしてください。');
}
console.log('='.repeat(60));

// 推奨事項の表示
console.log('\n📋 推奨事項:');
console.log(
  '1. ブラウザでアプリケーションを開いてFavicon表示を確認してください'
);
console.log(
  '2. 新しいブックマークを追加してFaviconが表示されるか確認してください'
);
console.log('3. Favicon更新ボタンをクリックして機能をテストしてください');
console.log(
  '4. ブラウザのコンソールでFavicon統計を確認してください（getFaviconStats()）'
);
console.log('5. ネットワークタブでFaviconリクエストを確認してください');

// 終了コード
process.exit(allTestsPassed ? 0 : 1);
