# 🎨 Color Match Game - 色合わせゲーム

シンプルで楽しい色合わせWebゲームです。目標の色にRGBスライダーを使って近づけてスコアを獲得しましょう！

## 🎯 ゲームの特徴

- **直感的な操作**: RGBスライダーで簡単に色を調整
- **レベルシステム**: 連続成功でレベルアップ
- **スコアシステム**: 正確度とレベルに応じたポイント計算
- **レスポンシブデザイン**: スマートフォンからデスクトップまで対応
- **最高スコア保存**: ローカルストレージで記録を保持
- **美しいUI**: モダンなグラデーションとアニメーション

## 🎮 遊び方

1. 画面上部に目標色が表示されます
2. RGBスライダー（赤・緑・青）を調整して色を作成
3. 「色を決定！」ボタンで答えを提出
4. 正確度が80%以上で成功！
5. 連続成功でレベルアップ

## 🚀 デプロイ方法

### 1. 静的ホスティングサービス

#### Netlify
1. [Netlify](https://www.netlify.com/)にアカウント作成
2. プロジェクトフォルダをZIPファイルに圧縮
3. Netlify Drop にドラッグ&ドロップ

#### Vercel
1. [Vercel](https://vercel.com/)にアカウント作成
2. GitHubリポジトリを連携してデプロイ

#### GitHub Pages
1. GitHubリポジトリを作成
2. Settings → Pages → Source を "Deploy from a branch" に設定
3. Branch を "main" に設定

### 2. ローカル実行

```bash
# HTTPサーバーを起動（Python 3の場合）
python -m http.server 8000

# または Node.js の場合
npx http-server

# ブラウザで http://localhost:8000 にアクセス
```

## 📁 ファイル構成

```
color-match-game/
├── index.html      # メインHTML
├── style.css       # スタイルシート
├── script.js       # ゲームロジック
└── README.md       # プロジェクト説明
```

## 💡 技術仕様

- **HTML5**: セマンティックな構造
- **CSS3**: Flexbox、Grid、アニメーション
- **Vanilla JavaScript**: フレームワーク不要
- **レスポンシブデザイン**: モバイルファースト
- **ローカルストレージ**: 最高スコア保存
- **アクセシビリティ**: キーボード操作対応

## 🎨 カスタマイズ

### 色のテーマ変更
`style.css` の CSS変数を編集してテーマを変更できます：

```css
:root {
    --primary-color: #4facfe;
    --secondary-color: #00f2fe;
    --accent-color: #ff6b6b;
}
```

### 難易度調整
`script.js` の `generateNewTargetColor()` メソッドで難易度を調整：

```javascript
// 色の範囲を狭くすると難易度が上がります
const range = Math.max(30, 255 - (this.level - 1) * 15);
```

## 📱 動作環境

- **ブラウザ**: Chrome, Firefox, Safari, Edge (最新版)
- **デバイス**: スマートフォン、タブレット、デスクトップ
- **インターネット**: 不要（オフライン対応）

## 🤝 貢献

バグ報告や機能提案は Issues で受け付けています。
プルリクエストも歓迎します！

## 📄 ライセンス

MIT License - 自由に使用、改変、配布できます。

---

楽しんでプレイしてください！ 🎮✨ 