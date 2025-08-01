# Remony 見守りサービス管理システム

## プロジェクト概要

このプロジェクトは、高齢者や要介護者の見守りサービスを管理するためのWebアプリケーションです。Next.js、Firebase、Tailwind CSSを使用して構築されており、利用者の登録、管理、アラート設定などの機能を提供します。

## 主な機能

### 🏠 ホームダッシュボード
- システム全体の概要を表示
- 各機能へのクイックアクセス

### 👤 利用者登録・管理
- 新しい利用者の登録
- 個人情報（名前、住所、連絡先など）の管理
- バイタル機器の設定
- 通知先の設定（メール・LINE）

### 📊 利用者一覧
- 登録済み利用者の一覧表示
- 検索機能
- 利用者情報の詳細表示

### ⚙️ アラート設定
- 心拍数アラートの設定
- 皮膚温アラートの設定
- 歩数アラートの設定
- 距離アラートの設定
- 睡眠アラートの設定
- カロリー消費アラートの設定
- 発電量アラートの設定

## 技術スタック

### フロントエンド
- **Next.js 12.3.1** - Reactフレームワーク
- **React 18.2.0** - UIライブラリ
- **TypeScript 4.8.4** - 型安全な開発
- **Tailwind CSS 3.1.8** - スタイリング

### バックエンド・インフラ
- **Firebase 11.0.2** - 認証・データベース
- **Axios 1.7.7** - HTTP通信
- **JSON Web Token 9.0.2** - 認証トークン

### 開発ツール
- **ESLint 8.24.0** - コード品質管理
- **Prettier 2.7.1** - コードフォーマット
- **PostCSS 8.4.17** - CSS処理

## セットアップ手順

### 前提条件
- Node.js (v16以上推奨)
- npm または yarn

### 1. リポジトリのクローン
```bash
git clone [リポジトリURL]
cd remony-frontend
```

### 2. 依存関係のインストール
```bash
npm install
```

### 3. 環境変数の設定
プロジェクトルートに `.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
NEXT_PUBLIC_LAMBDA_API_URL=your_api_endpoint_url
```

### 4. 開発サーバーの起動
```bash
npm run dev
```

開発サーバーが起動すると、ブラウザで `http://localhost:3000` にアクセスできます。

## 利用可能なスクリプト

```bash
# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm run start

# コードの品質チェック
npm run lint
```

## プロジェクト構造

```
remony-frontend/
├── public/                 # 静的ファイル
├── src/
│   ├── api/               # API関連ファイル
│   │   ├── users.ts       # ユーザー関連API
│   │   └── userSettings.ts # ユーザー設定API
│   ├── layout/            # レイアウトコンポーネント
│   ├── pages/             # Next.jsページ
│   │   ├── index.tsx      # ホームページ
│   │   ├── users.tsx      # 利用者一覧
│   │   └── user/          # ユーザー関連ページ
│   ├── styles/            # スタイルファイル
│   └── types/             # TypeScript型定義
├── next.config.js         # Next.js設定
├── tailwind.config.js     # Tailwind CSS設定
└── tsconfig.json          # TypeScript設定
```

## 主要なページ

### ホームページ (`/`)
- システムのメインダッシュボード
- 各機能へのナビゲーション

### 利用者登録 (`/user/register`)
- 新しい利用者の登録フォーム
- 個人情報、バイタル機器設定の入力

### 利用者一覧 (`/users`)
- 登録済み利用者の一覧表示
- 検索・フィルタリング機能

### 利用者詳細 (`/user/[id]`)
- 特定の利用者の詳細情報表示

### アラート設定 (`/user/[id]/setting`)
- 利用者のアラート設定管理
- 各種バイタルデータの閾値設定

## 開発ガイドライン

### コードスタイル
- TypeScriptを使用し、型安全性を確保
- ESLintとPrettierでコード品質を維持
- コンポーネントは関数型コンポーネントを使用

### スタイリング
- Tailwind CSSを使用
- レスポンシブデザインを考慮
- アクセシビリティに配慮

### API通信
- Axiosを使用したHTTP通信
- エラーハンドリングを適切に実装
- 環境変数でAPIエンドポイントを管理

## トラブルシューティング

### よくある問題

1. **依存関係のインストールエラー**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScriptエラー**
   ```bash
   npm run lint
   ```

3. **ビルドエラー**
   ```bash
   npm run build
   ```

## ライセンス

このプロジェクトはプライベートプロジェクトです。

## サポート

技術的な問題や質問がある場合は、開発チームにお問い合わせください。
