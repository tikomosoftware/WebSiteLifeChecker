import { NextResponse } from 'next/server';
import { getHistory } from '@/lib/store';

/**
 * GET /api/history
 * ヘルスチェック履歴を返す。
 */
export async function GET() {
  const history = await getHistory();
  return NextResponse.json({ history });
}
