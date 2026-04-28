-- ============================================================
-- WebSite Life Checker - Supabase テーブル定義
-- Supabase の SQL Editor で実行してください。
-- ============================================================

-- 監視対象テーブル
CREATE TABLE IF NOT EXISTS monitor_targets (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name       TEXT NOT NULL,
  url        TEXT NOT NULL,
  timeout    INT NOT NULL DEFAULT 10,
  expected_status INT NOT NULL DEFAULT 200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ヘルスチェックログテーブル
CREATE TABLE IF NOT EXISTS health_logs (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  target_name   TEXT NOT NULL,
  is_healthy    BOOLEAN NOT NULL,
  response_time DOUBLE PRECISION NOT NULL DEFAULT 0,
  error_message TEXT,
  checked_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 最新ステータスを高速に取得するためのインデックス
CREATE INDEX IF NOT EXISTS idx_health_logs_target_checked
  ON health_logs (target_name, checked_at DESC);

-- 履歴取得用のインデックス
CREATE INDEX IF NOT EXISTS idx_health_logs_checked_at
  ON health_logs (checked_at DESC);

-- ============================================================
-- Row Level Security (RLS) の設定
-- service_role キーを使うため、RLS は無効のままでも動作しますが、
-- 必要に応じて有効化してください。
-- ============================================================

-- ALTER TABLE monitor_targets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE health_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 初期データ（任意）
-- ============================================================
-- INSERT INTO monitor_targets (name, url, timeout, expected_status) VALUES
--   ('Google', 'https://www.google.com', 10, 200),
--   ('GitHub', 'https://github.com', 15, 200);
