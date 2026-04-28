import { NextRequest, NextResponse } from 'next/server';
import { checkAllWebsites } from '@/lib/health-checker';
import { getTargets, setLatestStatuses } from '@/lib/store';

/**
 * GET /api/cron
 * Vercel Cron Jobs から定期的に呼ばれるエンドポイント。
 * vercel.json の crons 設定で呼び出しスケジュールを定義する。
 *
 * セキュリティ: CRON_SECRET 環境変数で認証する。
 */
export async function GET(request: NextRequest) {
  // Vercel Cron の認証チェック
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const targets = await getTargets();

    if (targets.length === 0) {
      return NextResponse.json({ message: 'No targets configured' });
    }

    const statuses = await checkAllWebsites(targets);
    await setLatestStatuses(statuses);

    const summary = {
      total: statuses.length,
      healthy: statuses.filter((s) => s.isHealthy).length,
      unhealthy: statuses.filter((s) => !s.isHealthy).length,
      checkedAt: new Date().toISOString(),
    };

    console.log('Cron health check completed:', summary);

    return NextResponse.json(summary);
  } catch (error) {
    console.error('Cron health check failed:', error);
    return NextResponse.json(
      { error: 'Cron health check failed' },
      { status: 500 },
    );
  }
}
