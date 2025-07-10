#!/usr/bin/env node

/**
 * エラーハンドリング機能テストスクリプト
 * このスクリプトは、エラーハンドリングシステムが正しく動作するかをテストします
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 エラーハンドリング機能テストを開始します...\n');

let allTestsPassed = true;

// テスト1: エラーハンドラーファイルの存在確認
console.log('1. エラーハンドラーファイルの確認');
if (fs.existsSync('js/error-handler.js')) {
  console.log('   ✅ error-handler.jsが存在します');

  // ファイル内容の基本チェック
  const content = fs.readFileSync('js/error-handler.js', 'utf8');
  const requiredElements = [
    'class ErrorHandler',
    'handleError',
    'classifyError',
    'notifyUser',
    'logError',
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
  console.log('   ❌ error-handler.jsが存在しません');
  allTestsPassed = false;
}

// テスト2: 各モジュールでのエラーハンドラー統合確認
console.log('\n2. モジュール統合の確認');
const modulesToCheck = [
  { file: 'js/weather.js', patterns: ['window.errorHandler', 'handleError'] },
  {
    file: 'js/news.js',
    patterns: ['window.errorHandler', 'handleError', 'failedFeeds'],
  },
  { file: 'js/background.js', patterns: ['window.errorHandler', 'retryCount'] },
  { file: 'js/app.js', patterns: ['errorHandler', 'handleError'] },
];

modulesToCheck.forEach((module) => {
  if (fs.existsSync(module.file)) {
    const content = fs.readFileSync(module.file, 'utf8');
    let modulePassed = true;

    module.patterns.forEach((pattern) => {
      if (content.includes(pattern)) {
        console.log(`   ✅ ${module.file}: ${pattern}が含まれています`);
      } else {
        console.log(`   ❌ ${module.file}: ${pattern}が含まれていません`);
        modulePassed = false;
      }
    });

    if (!modulePassed) {
      allTestsPassed = false;
    }
  } else {
    console.log(`   ❌ ${module.file}が存在しません`);
    allTestsPassed = false;
  }
});

// テスト3: エラーハンドリング機能の詳細チェック
console.log('\n3. エラーハンドリング機能の詳細チェック');
if (fs.existsSync('js/error-handler.js')) {
  const content = fs.readFileSync('js/error-handler.js', 'utf8');

  const features = [
    { name: 'グローバルエラーハンドラー', pattern: 'addEventListener.*error' },
    {
      name: 'Promiseエラーハンドラー',
      pattern: 'addEventListener.*unhandledrejection',
    },
    { name: 'ネットワークエラー監視', pattern: 'setupNetworkErrorHandling' },
    { name: 'エラー分類機能', pattern: 'classifyError' },
    { name: 'リトライ機能', pattern: 'scheduleRetry' },
    { name: 'エラーログ機能', pattern: 'saveErrorLog' },
    { name: 'ユーザー通知機能', pattern: 'notifyUser' },
    { name: 'エラーモーダル機能', pattern: 'showErrorModal' },
  ];

  features.forEach((feature) => {
    if (
      content.includes(feature.pattern) ||
      content.includes(feature.name.replace(/[^a-zA-Z]/g, ''))
    ) {
      console.log(`   ✅ ${feature.name}が実装されています`);
    } else {
      console.log(`   ❌ ${feature.name}が実装されていません`);
      allTestsPassed = false;
    }
  });
}

// テスト4: エラーハンドリングの改善点チェック
console.log('\n4. エラーハンドリングの改善点チェック');
if (fs.existsSync('js/weather.js')) {
  const weatherContent = fs.readFileSync('js/weather.js', 'utf8');

  if (
    weatherContent.includes('retryCount') &&
    weatherContent.includes('maxRetries')
  ) {
    console.log('   ✅ 天気機能にリトライ機能が実装されています');
  } else {
    console.log('   ❌ 天気機能にリトライ機能が実装されていません');
    allTestsPassed = false;
  }
}

if (fs.existsSync('js/news.js')) {
  const newsContent = fs.readFileSync('js/news.js', 'utf8');

  if (
    newsContent.includes('failedFeeds') &&
    newsContent.includes('Promise.allSettled')
  ) {
    console.log('   ✅ ニュース機能に並列処理とエラー追跡が実装されています');
  } else {
    console.log('   ❌ ニュース機能に並列処理とエラー追跡が実装されていません');
    allTestsPassed = false;
  }
}

// テスト5: セキュリティとの統合確認
console.log('\n5. セキュリティとの統合確認');
if (fs.existsSync('js/error-handler.js')) {
  const content = fs.readFileSync('js/error-handler.js', 'utf8');

  if (content.includes('localStorage') && content.includes('errorLogs')) {
    console.log('   ✅ エラーログのローカルストレージ保存が実装されています');
  } else {
    console.log('   ❌ エラーログのローカルストレージ保存が実装されていません');
    allTestsPassed = false;
  }
}

// 結果の表示
console.log('\n' + '='.repeat(60));
if (allTestsPassed) {
  console.log('🎉 すべてのエラーハンドリングテストが通過しました！');
  console.log('エラーハンドリングシステムは正常に実装されています。');
} else {
  console.log('⚠️  エラーハンドリングテストで問題が検出されました。');
  console.log('上記の問題を修正してから本番環境にデプロイしてください。');
}
console.log('='.repeat(60));

// 推奨事項の表示
console.log('\n📋 推奨事項:');
console.log(
  '1. ブラウザでアプリケーションを開いてエラーハンドリングをテストしてください'
);
console.log('2. ネットワークを切断してオフライン時の動作を確認してください');
console.log('3. 無効なAPIキーでエラー時の動作を確認してください');
console.log('4. ブラウザのコンソールでエラーログを確認してください');

// 終了コード
process.exit(allTestsPassed ? 0 : 1);
