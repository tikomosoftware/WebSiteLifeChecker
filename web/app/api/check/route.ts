import { NextResponse } from 'next/server';
import { checkAllWebsites } from '@/lib/health-checker';
import { getTargets, setLatestStatuses } from '@/lib/store';

/**
 * POST /api/check
 * 手動でヘルスチェックを実行する。
 * ダッシュボードの「今すぐチェック」ボタンから呼ばれる。
 */
export async function POST() {
  try {
    const targets = await getTargets();

    if (targets.length === 0) {
      return NextResponse.json(
        { error: 'No targets configured' },
        { status: 400 },
      );
    }

    const statuses = await checkAllWebsites(targets);
    await setLatestStatuses(statuses);

    return NextResponse.json({ statuses, checkedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { error: 'Health check execution failed' },
      { status: 500 },
    );
  }
}
