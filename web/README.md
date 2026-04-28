# WebSite Life Checker - Web Dashboard

Webサイトの死活監視ダッシュボード。Next.js + Vercel で動作します。

## 技術スタック

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Vercel Cron Jobs** (5分間隔の自動ヘルスチェック)

## ローカル開発

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

http://localhost:3000 でダッシュボードが開きます。

## Vercel へのデプロイ

### 1. Vercel にプロジェクトを接続

```bash
npx vercel
```

または [vercel.com](https://vercel.com) からGitリポジトリを接続。

**Root Directory** の設定で `web` を指定してください。

### 2. 環境変数の設定

Vercel のプロジェクト設定 → Environment Variables で以下を設定:

| 変数名 | 説明 | 必須 |
|--------|------|------|
| `CRON_SECRET` | Cron Jobs の認証シークレット（任意のランダム文字列） | 推奨 |
| `MONITOR_TARGETS` | 監視対象のJSON配列（下記参照） | 任意 |

### 3. 監視対象の設定

#### 方法A: 環境変数で設定（推奨）

`MONITOR_TARGETS` 環境変数にJSON配列を設定:

```json
[
  {"name": "My Website", "url": "https://example.com", "timeout": 10, "expectedStatus": 200},
  {"name": "API Server", "url": "https://api.example.com/health", "timeout": 15, "expectedStatus": 200}
]
```

#### 方法B: ダッシュボードUIから設定

ダッシュボードの「⚙️ 設定」ボタンから監視対象を追加・編集できます。
※ Serverless Functions のインスタンスが変わるとリセットされるため、永続化が必要な場合は環境変数を使用してください。

### 4. Cron Jobs

`vercel.json` で5分間隔の自動ヘルスチェックが設定されています:

```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

> **注意**: Vercel Cron Jobs は Hobby プランでは1日1回、Pro プランでは1分間隔まで設定可能です。

## API エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| GET | `/api/status` | 現在のステータスと監視対象一覧 |
| POST | `/api/check` | 手動ヘルスチェック実行 |
| GET | `/api/cron` | Cron Jobs 用エンドポイント |
| GET | `/api/targets` | 監視対象一覧取得 |
| PUT | `/api/targets` | 監視対象更新 |
| GET | `/api/history` | ヘルスチェック履歴 |

## プロジェクト構成

```
web/
├── app/
│   ├── api/
│   │   ├── check/route.ts    # 手動チェック
│   │   ├── cron/route.ts     # Cron Jobs
│   │   ├── history/route.ts  # 履歴
│   │   ├── status/route.ts   # ステータス
│   │   └── targets/route.ts  # 監視対象管理
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # ダッシュボード
├── components/
│   ├── StatusCard.tsx         # ステータスカード
│   ├── SummaryBar.tsx         # サマリーバー
│   └── TargetEditor.tsx       # 監視対象エディタ
├── lib/
│   ├── health-checker.ts      # ヘルスチェックロジック
│   ├── store.ts               # インメモリストア
│   └── types.ts               # 型定義
├── vercel.json                # Vercel設定 (Cron Jobs)
└── package.json
```

## 元プロジェクトからの移植

Python版 Health Monitor の以下の機能を移植しています:

- ✅ Webサイトの HTTP ヘルスチェック
- ✅ 並列実行（Promise.allSettled）
- ✅ タイムアウト制御
- ✅ ステータスコード検証
- ✅ レスポンスタイム計測
- ✅ ダッシュボード表示

### 未移植（将来対応）

- ⬜ PostgreSQL データベース監視（Vercel Serverless では直接接続が制限される場合あり）
- ⬜ リトライ / サーキットブレーカー
- ⬜ 永続化ストレージ（Vercel KV / Postgres）
- ⬜ 通知機能（Slack / Email）
