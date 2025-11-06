import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

const header = tv({
  base: "flex items-center justify-between px-8 py-4 bg-white border-b border-gray-300",
});

type HeaderProps = {
  title?: string;
  children?: React.ReactNode;
};

export function Header({ title, children }: HeaderProps) {
  return (
    <header className={cn(header())}>
      {/* 左側: タイトル */}
      <div className="flex-shrink-0">
        <h1 className="text-blue-600 font-bold text-lg leading-tight mb-2">Easy Go Monitor</h1>
        <h2 className="text-2xl font-semibold text-gray-800 leading-tight">{title}</h2>
      </div>

      {/* 右側: 操作コンテンツ */}
      <div className="flex items-center gap-4">{children}</div>
    </header>
  );
}
