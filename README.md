# Hoikuru

**Hoikuru** プロジェクトは、[Next.js](https://nextjs.org/) を基盤に、最新のツールを組み合わせて構築されています。BlockNote（リッチテキストエディタ）、Uppy（ファイルアップロード）、Tailwind CSS（スタイリング）、Zod（スキーマバリデーション）などを活用しています。

## プロジェクト構成

- **Next.js**: React ベースの開発とルーティングを提供するフレームワーク。
- **Tailwind CSS**: ユーティリティファーストのスタイリングとカスタムアニメーション。
- **Uppy**: ファイルアップロード管理用のプラグイン（XHR 対応）。
- **Zod**: スキーマバリデーションと型推論。
- **BlockNote**: React 向けリッチテキストエディタ。

### 前提条件

Node.js（v18 以上）と npm がインストールされていることを確認してください。

### 開発環境

#### Docker の環境構築

1. リポジトリをクローンした後、`Dockerfile` が存在するディレクトリに移動します。

   - PowerShell を使用して移動します。

2. 以下のコマンドを実行して Docker イメージをビルドします。

   ```bash
   docker-compose build
   ```

3. ビルドが完了したら、以下のコマンドでコンテナを起動します。

   ```bash
   docker-compose up -d
   ```

4. Docker コンテナが作成されたら、Docker ターミナルを開き、プロジェクトディレクトリに移動します。

5. プロジェクトディレクトリに移動後、以下のコマンドを実行して依存パッケージをインストールします。

   ```bash
   npm install
   ```

6. 開発環境を起動するために、以下のコマンドを実行します。

   ```bash
   npm run dev
   ```

#### Vercel の自動ビルド

master ブランチにプッシュされた場合、Vercel が自動でビルド処理を行います。

[Vercel](https://vercel.com/yohaku-bunkas-projects/hoikuru)
