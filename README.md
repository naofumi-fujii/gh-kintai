# gh-kintai - 勤怠管理システム

Next.jsとSupabaseで構築された出勤・退勤管理アプリケーション

## 機能

- ユーザー認証（サインアップ/ログイン）
- 出勤記録
- 退勤記録
- 勤怠履歴の閲覧
- 勤務時間の自動計算

## 技術スタック

- **フロントエンド**: Next.js 16 (App Router), React 19, TypeScript
- **スタイリング**: Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, 認証, Row Level Security)
- **デプロイ**: Vercel推奨

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd gh-kintai
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)でアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのダッシュボードから以下の情報を取得：
   - Project URL
   - Anon/Public Key

### 4. 環境変数の設定

`.env.local`ファイルを作成：

```bash
cp .env.local.example .env.local
```

`.env.local`を編集して、Supabaseの認証情報を追加：

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 5. データベースのセットアップ

Supabaseダッシュボードの「SQL Editor」を開き、`supabase/migrations/20231107000000_initial_schema.sql`の内容を実行します。

詳細は[DATABASE_SETUP.md](./DATABASE_SETUP.md)を参照してください。

### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開きます。

## 使い方

1. **アカウント作成**: トップページから「新規登録」をクリック
2. **ログイン**: メールアドレスとパスワードでログイン
3. **出勤記録**: ダッシュボードで「出勤」ボタンをクリック
4. **退勤記録**: 「退勤」ボタンをクリック
5. **履歴確認**: ダッシュボード下部で過去30件の勤怠記録を確認

## プロジェクト構造

```
gh-kintai/
├── app/                      # Next.js App Router
│   ├── auth/                # 認証関連ページ
│   │   ├── login/          # ログインページ
│   │   ├── signup/         # サインアップページ
│   │   └── callback/       # 認証コールバック
│   ├── dashboard/          # ダッシュボード
│   ├── layout.tsx          # ルートレイアウト
│   └── page.tsx            # トップページ
├── components/              # Reactコンポーネント
│   ├── ClockInButton.tsx   # 出勤ボタン
│   ├── ClockOutButton.tsx  # 退勤ボタン
│   └── AttendanceList.tsx  # 勤怠履歴リスト
├── lib/                     # ユーティリティ
│   └── supabase/           # Supabase設定
│       ├── client.ts       # クライアント側
│       ├── server.ts       # サーバー側
│       └── middleware.ts   # ミドルウェア
├── supabase/               # データベース
│   └── migrations/         # SQLマイグレーション
├── types/                  # TypeScript型定義
│   └── attendance.ts       # 勤怠レコード型
└── middleware.ts           # Next.js ミドルウェア
```

## セキュリティ

- Supabase Row Level Security (RLS)により、ユーザーは自分の勤怠記録のみアクセス可能
- パスワードは安全にハッシュ化されて保存
- セッション管理は自動的に処理

## デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com)にリポジトリをインポート
2. 環境変数を設定：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. デプロイ

## ライセンス

ISC

## 開発者

勤怠管理を効率化するために開発されました。
