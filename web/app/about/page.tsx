import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - WebSite Life Checker',
  description: 'WebSite Life Checker について',
};

const LIBRARIES = [
  {
    name: 'Next.js',
    version: '15',
    url: 'https://nextjs.org/',
    license: 'MIT',
    copyright: 'Copyright (c) 2024 Vercel, Inc.',
  },
  {
    name: 'React',
    version: '19',
    url: 'https://react.dev/',
    license: 'MIT',
    copyright: 'Copyright (c) Meta Platforms, Inc. and affiliates.',
  },
  {
    name: 'Tailwind CSS',
    version: '4',
    url: 'https://tailwindcss.com/',
    license: 'MIT',
    copyright: 'Copyright (c) Tailwind Labs, Inc.',
  },
  {
    name: 'Supabase JS',
    version: '2',
    url: 'https://supabase.com/',
    license: 'MIT',
    copyright: 'Copyright (c) 2020 Supabase.',
  },
  {
    name: 'TypeScript',
    version: '5',
    url: 'https://www.typescriptlang.org/',
    license: 'Apache-2.0',
    copyright: 'Copyright (c) Microsoft Corporation.',
  },
  {
    name: 'PostCSS',
    version: '8',
    url: 'https://postcss.org/',
    license: 'MIT',
    copyright: 'Copyright (c) 2013 Andrey Sitnik <andrey@sitnik.ru>.',
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold tracking-tight mb-6">About</h1>

      {/* アプリ概要 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          WebSite Life Checker とは
        </h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 space-y-3 text-gray-300 text-sm leading-relaxed">
          <p>
            WebSite Life Checker
            は、登録したWebサイトの死活監視を行うダッシュボードアプリケーションです。
          </p>
          <p>
            HTTPリクエストを送信し、ステータスコードと応答時間を計測して、サイトが正常に稼働しているかをリアルタイムで確認できます。
          </p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Webサイトの HTTP ヘルスチェック</li>
            <li>並列実行による高速な監視</li>
            <li>タイムアウト制御とステータスコード検証</li>
            <li>レスポンスタイム計測</li>
            <li>Supabase (PostgreSQL) へのログ永続化</li>
            <li>Vercel Cron Jobs による定期自動チェック</li>
          </ul>
        </div>
      </section>

      {/* 技術スタック */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">技術スタック</h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 text-sm">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400">フレームワーク</p>
              <p className="font-medium">Next.js 15 (App Router)</p>
            </div>
            <div>
              <p className="text-gray-400">UI</p>
              <p className="font-medium">React 19</p>
            </div>
            <div>
              <p className="text-gray-400">スタイリング</p>
              <p className="font-medium">Tailwind CSS v4</p>
            </div>
            <div>
              <p className="text-gray-400">言語</p>
              <p className="font-medium">TypeScript 5</p>
            </div>
            <div>
              <p className="text-gray-400">データベース</p>
              <p className="font-medium">Supabase (PostgreSQL)</p>
            </div>
            <div>
              <p className="text-gray-400">ホスティング</p>
              <p className="font-medium">Vercel</p>
            </div>
          </div>
        </div>
      </section>

      {/* ソースコード */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">ソースコード</h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 text-sm text-gray-300">
          <p>
            このプロジェクトは MIT ライセンスで公開されています。
          </p>
          <a
            href="https://github.com/tikomosoftware/WebSiteLifeChecker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            github.com/tikomosoftware/WebSiteLifeChecker →
          </a>
        </div>
      </section>

      {/* ライセンス */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">
          オープンソースライセンス
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          このアプリケーションは以下のオープンソースライブラリを使用しています。
        </p>
        <div className="space-y-3">
          {LIBRARIES.map((lib) => (
            <div
              key={lib.name}
              className="rounded-lg border border-gray-800 bg-gray-900/40 p-4 text-sm"
            >
              <div className="flex items-center justify-between mb-1">
                <a
                  href={lib.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {lib.name} v{lib.version}
                </a>
                <span className="rounded-full bg-gray-800 px-2.5 py-0.5 text-xs text-gray-400">
                  {lib.license}
                </span>
              </div>
              <p className="text-gray-500 text-xs">{lib.copyright}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MIT ライセンス全文 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">MIT License</h2>
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 text-xs text-gray-500 leading-relaxed font-mono whitespace-pre-wrap">
          {`MIT License

Copyright (c) 2025 Tikomo Software

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
        </div>
      </section>
    </main>
  );
}
