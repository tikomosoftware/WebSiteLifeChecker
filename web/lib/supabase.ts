import { createClient, SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/**
 * Supabase クライアントを取得する。
 * 環境変数が未設定の場合は null を返す（インメモリフォールバック用）。
 */
export function getSupabase(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('[Supabase] URL set:', !!url, '| Key set:', !!key);

  if (!url || !key) {
    console.warn('[Supabase] Missing env vars, using in-memory fallback');
    return null;
  }

  client = createClient(url, key);
  console.log('[Supabase] Client created successfully');
  return client;
}
