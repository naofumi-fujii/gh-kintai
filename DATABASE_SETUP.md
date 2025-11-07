# データベースセットアップガイド

## Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com)にアクセスしてアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトのダッシュボードから以下の情報を取得：
   - Project URL
   - Anon/Public Key

## 環境変数の設定

`.env.local`ファイルを作成し、以下の値を設定：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## データベースマイグレーションの実行

1. Supabaseダッシュボードの「SQL Editor」を開く
2. `supabase/migrations/20231107000000_initial_schema.sql`の内容をコピー
3. SQL Editorに貼り付けて実行

または、Supabase CLIを使用する場合：

```bash
# Supabase CLIをインストール
npm install -g supabase

# Supabaseプロジェクトにリンク
supabase link --project-ref your-project-ref

# マイグレーションを実行
supabase db push
```

## メール認証の設定（オプション）

1. Supabaseダッシュボードで「Authentication」→「Settings」を開く
2. 「Email Auth」を有効化
3. 必要に応じてメールテンプレートをカスタマイズ

## データベーススキーマ

### attendance_records テーブル

| カラム名 | 型 | 説明 |
|---------|-----|------|
| id | UUID | 主キー |
| user_id | UUID | ユーザーID（auth.usersへの外部キー） |
| clock_in | TIMESTAMPTZ | 出勤時刻 |
| clock_out | TIMESTAMPTZ | 退勤時刻（NULL可） |
| created_at | TIMESTAMPTZ | レコード作成日時 |
| updated_at | TIMESTAMPTZ | レコード更新日時 |

### セキュリティ

- Row Level Security (RLS) が有効
- ユーザーは自分のレコードのみ閲覧・作成・更新可能
