/** 監視対象のWebサイト設定 */
export interface WebsiteTarget {
  name: string;
  url: string;
  timeout: number;
  expectedStatus: number;
}

/** ヘルスチェック結果 */
export interface HealthStatus {
  targetName: string;
  isHealthy: boolean;
  responseTime: number;
  errorMessage: string | null;
  timestamp: string; // ISO 8601
}

/** ヘルスチェック履歴エントリ */
export interface HealthLogEntry {
  timestamp: string;
  targetName: string;
  isHealthy: boolean;
  responseTime: number;
  errorMessage: string | null;
}

/** ダッシュボード全体のレスポンス */
export interface DashboardData {
  targets: WebsiteTarget[];
  statuses: HealthStatus[];
  lastChecked: string | null;
}

/** 監視設定（環境変数 or UI から） */
export interface MonitorConfig {
  websites: WebsiteTarget[];
}
