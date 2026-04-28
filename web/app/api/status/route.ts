import { NextResponse } from 'next/server';
import { getTargets, getLatestStatuses, getLastChecked } from '@/lib/store';
import type { DashboardData } from '@/lib/types';

/**
 * GET /api/status
 * 現在のステータスと監視対象一覧を返す。
 * ダッシュボードのポーリングで使用。
 */
export async function GET() {
  const [targets, statuses, lastChecked] = await Promise.all([
    getTargets(),
    getLatestStatuses(),
    getLastChecked(),
  ]);

  const data: DashboardData = { targets, statuses, lastChecked };

  return NextResponse.json(data);
}
