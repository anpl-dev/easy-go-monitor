import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { tv } from "tailwind-variants";
import type { RunnerWithMonitor } from "@/type/runner";

type RunnerListProps = {
  runners: RunnerWithMonitor[];
  onDelete: (id: string) => void;
  onExecute: (id: string) => void;
  onShowHistory: (id: string) => void;
  onEdit: (runner: RunnerWithMonitor) => void;
};

const listColumn = tv({
  base: "px-4 py-2 text-left",
});

export function RunnerList({
  runners,
  onDelete,
  onExecute,
  onShowHistory,
  onEdit,
}: RunnerListProps) {
  if (!runners.length)
    return <p className="text-gray-500">Runnerが未登録です</p>;

  return (
    <div className="overflow-x-auto rounded-sm border border-gray-400 bg-white">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
          <tr>
            <th className={cn(listColumn())}>ランナー名</th>
            <th className={cn(listColumn())}>リージョン</th>
            <th className={cn(listColumn())}>監視間隔</th>
            <th className={cn(listColumn())}>状態</th>
            <th className={cn(listColumn())}>モニター名</th>
            <th className={cn(listColumn())}>URL</th>
            <th className={cn(listColumn())}>タイプ</th>
            <th className={cn(listColumn())}>メソッド</th>
            <th className={cn(listColumn())}>操作</th>
            <th className={cn(listColumn())}></th>
          </tr>
        </thead>
        <tbody>
          {runners.map((r) => (
            <tr
              key={r.id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-2 font-medium text-gray-900">{r.name}</td>
              <td className="px-4 py-2">{r.region}</td>
              <td className="px-4 py-2">{r.interval_second}s</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    r.monitor_is_enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {r.monitor_is_enabled ? "Enabled" : "Disabled"}
                </span>
              </td>
              <td className="px-4 py-2">{r.monitor_name ?? "未設定"}</td>
              <td className="px-4 py-2 max-w-[220px] truncate text-blue-600">
                {r.monitor_url ? (
                  <a
                    href={r.monitor_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline truncate"
                    title={r.monitor_url}
                  >
                    {r.monitor_url}
                  </a>
                ) : (
                  "-"
                )}
              </td>
              <td className="px-4 py-2">{r.monitor_type ?? "-"}</td>
              <td className="px-4 py-2">{r.settings?.method ?? "-"}</td>
              <td className="px-4 py-2 text-left space-x-2 whitespace-nowrap">
                <Button
                  intent="primary"
                  size="sm"
                  onClick={() => onExecute(r.id)}
                >
                  実行
                </Button>

                <Button intent="secondary" size="sm" onClick={() => onEdit(r)}>
                  編集
                </Button>
                <Button
                  intent="secondary"
                  size="sm"
                  onClick={() => onShowHistory(r.id)}
                >
                  履歴
                </Button>
              </td>
              <td className="px-4 py-2 text-right space-x-2 whitespace-nowrap">
                <Button
                  intent="danger"
                  size="sm"
                  onClick={() => onDelete(r.id)}
                >
                  削除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
