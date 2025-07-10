#!/usr/bin/env node

/**
 * セキュリティ設定チェックスクリプト
 * このスクリプトは、プロジェクトのセキュリティ設定が正しく行われているかを確認します
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 セキュリティ設定チェックを開始します...\n');

let allChecksPassed = true;

// 1. .envファイルの存在チェック
console.log('1. 環境変数ファイルのチェック');
if (fs.existsSync('.env')) {
  console.log('   ✅ .envファイルが存在します');

  // .envファイルの内容をチェック（機密情報は表示しない）
  const envContent = fs.readFileSync('.env', 'utf8');
  const hasOpenWeatherKey = envContent.includes('OPENWEATHER_API_KEY=');
  const hasUnsplashKey = envContent.includes('UNSPLASH_ACCESS_KEY=');

  if (hasOpenWeatherKey) {
    console.log('   ✅ OpenWeatherMap APIキーが設定されています');
  } else {
    console.log('   ❌ OpenWeatherMap APIキーが設定されていません');
    allChecksPassed = false;
  }

  if (hasUnsplashKey) {
    console.log('   ✅ Unsplash APIキーが設定されています');
  } else {
    console.log('   ❌ Unsplash APIキーが設定されていません');
    allChecksPassed = false;
  }
} else {
  console.log('   ❌ .envファイルが存在しません');
  console.log('   💡 env.exampleをコピーして.envファイルを作成してください');
  allChecksPassed = false;
}

// 2. .gitignoreのチェック
console.log('\n2. .gitignoreファイルのチェック');
if (fs.existsSync('.gitignore')) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');

  if (gitignoreContent.includes('.env')) {
    console.log('   ✅ .envファイルが.gitignoreに含まれています');
  } else {
    console.log('   ❌ .envファイルが.gitignoreに含まれていません');
    allChecksPassed = false;
  }

  if (gitignoreContent.includes('node_modules')) {
    console.log('   ✅ node_modulesが.gitignoreに含まれています');
  } else {
    console.log('   ❌ node_modulesが.gitignoreに含まれていません');
    allChecksPassed = false;
  }
} else {
  console.log('   ❌ .gitignoreファイルが存在しません');
  allChecksPassed = false;
}

// 3. ソースコード内のAPIキーハードコーディングチェック
console.log('\n3. ソースコード内のAPIキーハードコーディングチェック');

const filesToCheck = [
  'server.js',
  'js/background.js',
  'js/weather.js',
  'js/news.js',
];

filesToCheck.forEach((file) => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');

    // APIキーのパターンをチェック
    const apiKeyPatterns = [
      /['"][a-zA-Z0-9]{32,}['"]/, // 32文字以上の文字列
      /OPENWEATHER_API_KEY\s*=\s*['"][^'"]+['"]/,
      /UNSPLASH_ACCESS_KEY\s*=\s*['"][^'"]+['"]/,
    ];

    let hasHardcodedKey = false;
    apiKeyPatterns.forEach((pattern) => {
      if (pattern.test(content)) {
        hasHardcodedKey = true;
      }
    });

    if (hasHardcodedKey) {
      console.log(
        `   ❌ ${file}にハードコーディングされたAPIキーが検出されました`
      );
      allChecksPassed = false;
    } else {
      console.log(`   ✅ ${file}にハードコーディングされたAPIキーはありません`);
    }
  }
});

// 4. セキュリティヘッダーのチェック
console.log('\n4. セキュリティヘッダーのチェック');
if (fs.existsSync('server.js')) {
  const serverContent = fs.readFileSync('server.js', 'utf8');

  const securityHeaders = [
    'X-XSS-Protection',
    'X-Content-Type-Options',
    'X-Frame-Options',
  ];

  securityHeaders.forEach((header) => {
    if (serverContent.includes(header)) {
      console.log(`   ✅ ${header}ヘッダーが設定されています`);
    } else {
      console.log(`   ❌ ${header}ヘッダーが設定されていません`);
      allChecksPassed = false;
    }
  });
}

// 5. CORS設定のチェック
console.log('\n5. CORS設定のチェック');
if (fs.existsSync('server.js')) {
  const serverContent = fs.readFileSync('server.js', 'utf8');

  if (serverContent.includes('cors(') && serverContent.includes('origin:')) {
    console.log('   ✅ CORS設定が適切に構成されています');
  } else {
    console.log('   ❌ CORS設定が適切に構成されていません');
    allChecksPassed = false;
  }
}

// 結果の表示
console.log('\n' + '='.repeat(50));
if (allChecksPassed) {
  console.log('🎉 すべてのセキュリティチェックが通過しました！');
  console.log('プロジェクトは安全に設定されています。');
} else {
  console.log('⚠️  セキュリティチェックで問題が検出されました。');
  console.log('上記の問題を修正してから本番環境にデプロイしてください。');
}
console.log('='.repeat(50));

// 終了コード
process.exit(allChecksPassed ? 0 : 1);
