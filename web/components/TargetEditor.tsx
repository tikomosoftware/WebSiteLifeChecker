'use client';

import { useState } from 'react';
import type { WebsiteTarget } from '@/lib/types';

interface TargetEditorProps {
  targets: WebsiteTarget[];
  onSave: (targets: WebsiteTarget[]) => Promise<void>;
  onClose: () => void;
}

export default function TargetEditor({
  targets: initialTargets,
  onSave,
  onClose,
}: TargetEditorProps) {
  const [targets, setTargets] = useState<WebsiteTarget[]>(initialTargets);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addTarget() {
    setTargets([
      ...targets,
      { name: '', url: 'https://', timeout: 10, expectedStatus: 200 },
    ]);
  }

  function removeTarget(index: number) {
    setTargets(targets.filter((_, i) => i !== index));
  }

  function updateTarget(
    index: number,
    field: keyof WebsiteTarget,
    value: string | number,
  ) {
    setTargets(
      targets.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    );
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await onSave(targets);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">監視対象の編集</h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-700 p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {targets.map((target, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">#{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeTarget(index)}
                  className="text-red-400 hover:text-red-300 text-sm cursor-pointer"
                >
                  削除
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-sm text-gray-400">名前</span>
                  <input
                    type="text"
                    value={target.name}
                    onChange={(e) =>
                      updateTarget(index, 'name', e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="My Website"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-400">URL</span>
                  <input
                    type="url"
                    value={target.url}
                    onChange={(e) =>
                      updateTarget(index, 'url', e.target.value)
                    }
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    placeholder="https://example.com"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-400">
                    タイムアウト (秒)
                  </span>
                  <input
                    type="number"
                    value={target.timeout}
                    onChange={(e) =>
                      updateTarget(index, 'timeout', Number(e.target.value))
                    }
                    min={1}
                    max={60}
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-sm text-gray-400">
                    期待ステータスコード
                  </span>
                  <input
                    type="number"
                    value={target.expectedStatus}
                    onChange={(e) =>
                      updateTarget(
                        index,
                        'expectedStatus',
                        Number(e.target.value),
                      )
                    }
                    min={100}
                    max={599}
                    className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addTarget}
          className="mt-4 w-full rounded-lg border border-dashed border-gray-600 py-2 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
        >
          + 監視対象を追加
        </button>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-600 px-4 py-2 text-sm hover:bg-gray-800 transition-colors cursor-pointer"
          >
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>
    </div>
  );
}
