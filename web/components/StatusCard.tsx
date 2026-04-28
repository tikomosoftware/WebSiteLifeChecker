'use client';

import type { HealthStatus } from '@/lib/types';

interface StatusCardProps {
  status: HealthStatus;
}

export default function StatusCard({ status }: StatusCardProps) {
  const isHealthy = status.isHealthy;
  const responseMs = Math.round(status.responseTime * 1000);

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        isHealthy
          ? 'border-green-800 bg-green-950/40'
          : 'border-red-800 bg-red-950/40'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg truncate mr-2">
          {status.targetName}
        </h3>
        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
            isHealthy
              ? 'bg-green-900/60 text-green-300'
              : 'bg-red-900/60 text-red-300'
          }`}
        >
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isHealthy ? 'bg-green-400' : 'bg-red-400'
            }`}
          />
          {isHealthy ? '正常' : '異常'}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-400">
        {isHealthy ? (
          <p>
            応答時間:{' '}
            <span className="text-green-300 font-mono">{responseMs}ms</span>
          </p>
        ) : (
          <p className="text-red-300">{status.errorMessage}</p>
        )}
        <p>
          最終チェック:{' '}
          <span className="text-gray-300">
            {new Date(status.timestamp).toLocaleString('ja-JP')}
          </span>
        </p>
      </div>
    </div>
  );
}
