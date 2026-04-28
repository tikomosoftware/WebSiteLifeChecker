'use client';

import { useState, useEffect, useCallback } from 'react';
import type { DashboardData, WebsiteTarget } from '@/lib/types';
import StatusCard from '@/components/StatusCard';
import SummaryBar from '@/components/SummaryBar';
import TargetEditor from '@/components/TargetEditor';

const POLL_INTERVAL = 30_000; // 30秒ごとにポーリング

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const json: DashboardData = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  async function runCheck() {
    setChecking(true);
    try {
      const res = await fetch('/api/check', { method: 'POST' });
      if (res.ok) {
        await fetchStatus();
      }
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setChecking(false);
    }
  }

  async function saveTargets(targets: WebsiteTarget[]) {
    const res = await fetch('/api/targets', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targets }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save targets');
    }
    await fetchStatus();
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            ダッシュボード
          </h1>
          <p className="mt-1 text-gray-400">
            Webサイトの死活監視
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowEditor(true)}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm hover:bg-gray-800 transition-colors cursor-pointer"
          >
            ⚙️ 設定
          </button>
          <button
            type="button"
            onClick={runCheck}
            disabled={checking}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {checking ? 'チェック中...' : '🔄 今すぐチェック'}
          </button>
        </div>
      </div>

      {/* ローディング */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-600 border-t-blue-500" />
          <span className="ml-3 text-gray-400">読み込み中...</span>
        </div>
      )}

      {/* データ表示 */}
      {!loading && data && (
        <>
          {/* サマリー */}
          {data.statuses.length > 0 && (
            <div className="mb-6">
              <SummaryBar
                statuses={data.statuses}
                lastChecked={data.lastChecked}
              />
            </div>
          )}

          {/* ステータスカード */}
          {data.statuses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.statuses.map((status) => (
                <StatusCard key={status.targetName} status={status} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-12 text-center">
              <p className="text-xl mb-2">まだチェックが実行されていません</p>
              <p className="text-gray-400 mb-6">
                「今すぐチェック」ボタンを押してヘルスチェックを開始してください。
                <br />
                {data.targets.length > 0
                  ? `${data.targets.length} 件の監視対象が設定されています。`
                  : '「設定」から監視対象を追加してください。'}
              </p>
              <button
                type="button"
                onClick={runCheck}
                disabled={checking || data.targets.length === 0}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer"
              >
                {checking ? 'チェック中...' : '🔄 今すぐチェック'}
              </button>
            </div>
          )}

          {/* 監視対象一覧（ステータスがない場合） */}
          {data.statuses.length === 0 && data.targets.length > 0 && (
            <div className="mt-6 rounded-xl border border-gray-800 bg-gray-900/60 p-6">
              <h2 className="text-lg font-semibold mb-3">
                設定済みの監視対象
              </h2>
              <ul className="space-y-2">
                {data.targets.map((t) => (
                  <li
                    key={t.name}
                    className="flex items-center gap-3 text-sm text-gray-400"
                  >
                    <span className="inline-block h-2 w-2 rounded-full bg-gray-600" />
                    <span className="font-medium text-gray-200">{t.name}</span>
                    <span className="text-gray-500">{t.url}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* 監視対象エディタ */}
      {showEditor && data && (
        <TargetEditor
          targets={data.targets}
          onSave={saveTargets}
          onClose={() => setShowEditor(false)}
        />
      )}
    </main>
  );
}
