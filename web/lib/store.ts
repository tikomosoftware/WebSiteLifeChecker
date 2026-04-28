/**
 * データストア。
 *
 * Supabase が設定されている場合は DB に永続化。
 * 未設定の場合はインメモリで動作（ローカル開発用フォールバック）。
 */
import type { WebsiteTarget, HealthStatus, HealthLogEntry } from './types';
import { getSupabase } from './supabase';

// ============================================================
// デフォルト設定
// ============================================================

const DEFAULT_TARGETS: WebsiteTarget[] = [
  {
    name: 'Tikomo Software',
    url: 'https://tikomosoftware.github.io/',
    timeout: 10,
    expectedStatus: 200,
  },
  {
    name: 'Zenn - como',
    url: 'https://zenn.dev/como',
    timeout: 10,
    expectedStatus: 200,
  },
];

// ============================================================
// インメモリフォールバック用
// ============================================================

let memTargets: WebsiteTarget[] = [];
let memStatuses: HealthStatus[] = [];
let memHistory: HealthLogEntry[] = [];
let memLastChecked: string | null = null;
const MAX_HISTORY = 500;

function loadTargetsFromEnv(): WebsiteTarget[] {
  const raw = process.env.MONITOR_TARGETS;
  if (!raw) return DEFAULT_TARGETS;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((t: Record<string, unknown>) => ({
        name: String(t.name ?? ''),
        url: String(t.url ?? ''),
        timeout: Number(t.timeout ?? 10),
        expectedStatus: Number(t.expectedStatus ?? t.expected_status ?? 200),
      }));
    }
  } catch {
    console.error('Failed to parse MONITOR_TARGETS env var');
  }
  return DEFAULT_TARGETS;
}

// ============================================================
// 監視対象
// ============================================================

export async function getTargets(): Promise<WebsiteTarget[]> {
  const supabase = getSupabase();
  if (!supabase) {
    if (memTargets.length === 0) memTargets = loadTargetsFromEnv();
    return memTargets;
  }

  const { data, error } = await supabase
    .from('monitor_targets')
    .select('name, url, timeout, expected_status')
    .order('id');

  if (error) {
    console.error('Supabase getTargets error:', error.message);
    return loadTargetsFromEnv();
  }

  if (!data || data.length === 0) {
    return loadTargetsFromEnv();
  }

  return data.map((row) => ({
    name: row.name,
    url: row.url,
    timeout: row.timeout,
    expectedStatus: row.expected_status,
  }));
}

export async function setTargets(newTargets: WebsiteTarget[]): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    memTargets = newTargets;
    return;
  }

  // 全件削除して再挿入（監視対象は少数なのでシンプルに）
  const { error: deleteError } = await supabase
    .from('monitor_targets')
    .delete()
    .gte('id', 0); // 全行削除

  if (deleteError) {
    console.error('Supabase deleteTargets error:', deleteError.message);
    return;
  }

  const rows = newTargets.map((t) => ({
    name: t.name,
    url: t.url,
    timeout: t.timeout,
    expected_status: t.expectedStatus,
  }));

  if (rows.length > 0) {
    const { error: insertError } = await supabase
      .from('monitor_targets')
      .insert(rows);

    if (insertError) {
      console.error('Supabase insertTargets error:', insertError.message);
    }
  }
}

// ============================================================
// ステータス & ログ保存
// ============================================================

export async function getLatestStatuses(): Promise<HealthStatus[]> {
  const supabase = getSupabase();
  if (!supabase) return memStatuses;

  // 各ターゲットの最新ログを取得する
  // Supabase は DISTINCT ON をサポートしないため、
  // 最新100件から JS 側で各ターゲットの最新を抽出する
  const { data, error } = await supabase
    .from('health_logs')
    .select('target_name, is_healthy, response_time, error_message, checked_at')
    .order('checked_at', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Supabase getLatestStatuses error:', error.message);
    return memStatuses;
  }

  if (!data || data.length === 0) return [];

  // 各ターゲットの最新1件だけ抽出
  const seen = new Set<string>();
  const statuses: HealthStatus[] = [];

  for (const row of data) {
    if (seen.has(row.target_name)) continue;
    seen.add(row.target_name);
    statuses.push({
      targetName: row.target_name,
      isHealthy: row.is_healthy,
      responseTime: row.response_time,
      errorMessage: row.error_message,
      timestamp: row.checked_at,
    });
  }

  return statuses;
}

export async function setLatestStatuses(
  statuses: HealthStatus[],
): Promise<void> {
  const supabase = getSupabase();

  // インメモリも更新（同一インスタンス内のキャッシュとして）
  memStatuses = statuses;
  memLastChecked = new Date().toISOString();

  if (!supabase) {
    // インメモリフォールバック
    for (const s of statuses) {
      memHistory.push({
        timestamp: s.timestamp,
        targetName: s.targetName,
        isHealthy: s.isHealthy,
        responseTime: s.responseTime,
        errorMessage: s.errorMessage,
      });
    }
    if (memHistory.length > MAX_HISTORY) {
      memHistory = memHistory.slice(-MAX_HISTORY);
    }
    return;
  }

  // Supabase にログを挿入
  const rows = statuses.map((s) => ({
    target_name: s.targetName,
    is_healthy: s.isHealthy,
    response_time: s.responseTime,
    error_message: s.errorMessage,
    checked_at: s.timestamp,
  }));

  const { error } = await supabase.from('health_logs').insert(rows);

  if (error) {
    console.error('Supabase insertLogs error:', error.message);
  } else {
    console.log(`[Supabase] Inserted ${rows.length} health log(s)`);
  }
}

// ============================================================
// 履歴
// ============================================================

export async function getHistory(
  limit: number = 200,
): Promise<HealthLogEntry[]> {
  const supabase = getSupabase();
  if (!supabase) return memHistory;

  const { data, error } = await supabase
    .from('health_logs')
    .select('target_name, is_healthy, response_time, error_message, checked_at')
    .order('checked_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Supabase getHistory error:', error.message);
    return [];
  }

  if (!data) return [];

  return data.map((row) => ({
    timestamp: row.checked_at,
    targetName: row.target_name,
    isHealthy: row.is_healthy,
    responseTime: row.response_time,
    errorMessage: row.error_message,
  }));
}

// ============================================================
// 最終チェック時刻
// ============================================================

export async function getLastChecked(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return memLastChecked;

  const { data, error } = await supabase
    .from('health_logs')
    .select('checked_at')
    .order('checked_at', { ascending: false })
    .limit(1);

  if (error) {
    console.error('Supabase getLastChecked error:', error.message);
    return memLastChecked;
  }

  if (!data || data.length === 0) return null;

  return data[0].checked_at;
}
