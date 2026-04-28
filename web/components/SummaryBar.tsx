'use client';

import type { HealthStatus } from '@/lib/types';

interface SummaryBarProps {
  statuses: HealthStatus[];
  lastChecked: string | null;
}

export default function SummaryBar({ statuses, lastChecked }: SummaryBarProps) {
  const total = statuses.length;
  const healthy = statuses.filter((s) => s.isHealthy).length;
  const unhealthy = total - healthy;

  return (
    <div className="flex flex-wrap items-center gap-6 rounded-xl border border-gray-800 bg-gray-900/60 px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-400 text-sm">監視対象</span>
        <span className="text-xl font-bold">{total}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full bg-green-400" />
        <span className="text-gray-400 text-sm">正常</span>
        <span className="text-xl font-bold text-green-400">{healthy}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="inline-block h-3 w-3 rounded-full bg-red-400" />
        <span className="text-gray-400 text-sm">異常</span>
        <span className="text-xl font-bold text-red-400">{unhealthy}</span>
      </div>
      {lastChecked && (
        <div className="ml-auto text-sm text-gray-500">
          最終更新: {new Date(lastChecked).toLocaleString('ja-JP')}
        </div>
      )}
    </div>
  );
}
