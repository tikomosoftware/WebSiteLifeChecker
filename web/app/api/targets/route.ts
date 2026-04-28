import { NextRequest, NextResponse } from 'next/server';
import { getTargets, setTargets } from '@/lib/store';
import type { WebsiteTarget } from '@/lib/types';

/**
 * GET /api/targets
 * 現在の監視対象一覧を返す。
 */
export async function GET() {
  const targets = await getTargets();
  return NextResponse.json({ targets });
}

/**
 * PUT /api/targets
 * 監視対象を更新する。
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const targets: WebsiteTarget[] = body.targets;

    if (!Array.isArray(targets)) {
      return NextResponse.json(
        { error: 'targets must be an array' },
        { status: 400 },
      );
    }

    // バリデーション
    for (const t of targets) {
      if (!t.name || !t.url) {
        return NextResponse.json(
          { error: 'Each target must have name and url' },
          { status: 400 },
        );
      }
      try {
        new URL(t.url);
      } catch {
        return NextResponse.json(
          { error: `Invalid URL: ${t.url}` },
          { status: 400 },
        );
      }
    }

    await setTargets(
      targets.map((t) => ({
        name: t.name,
        url: t.url,
        timeout: t.timeout ?? 10,
        expectedStatus: t.expectedStatus ?? 200,
      })),
    );

    const updated = await getTargets();
    return NextResponse.json({ targets: updated });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
