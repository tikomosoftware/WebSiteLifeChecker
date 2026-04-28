import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'WebSite Life Checker',
  description: 'Webサイトの死活監視ダッシュボード',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-4 py-3">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight hover:text-blue-400 transition-colors"
            >
              🌐 WebSite Life Checker
            </Link>
            <div className="flex gap-4 text-sm">
              <Link
                href="/"
                className="text-gray-400 hover:text-gray-100 transition-colors"
              >
                ダッシュボード
              </Link>
              <Link
                href="/about"
                className="text-gray-400 hover:text-gray-100 transition-colors"
              >
                About
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
