import React from "react";

type DefaultLayoutProps = {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
};

export default function DefaultLayout({
  sidebar,
  header,
  main,
}: DefaultLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <aside className="sticky top-0 h-screen w-64 bg-white border-r border-gray-300 p-4 flex-shrink-0 overflow-y-auto">
        {sidebar}
      </aside>

      {/* メインエリア */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* ヘッダー */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-300">
          {header}
        </header>

        {/* メインコンテンツ */}
        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">{main}</main>
      </div>
    </div>
  );
}
