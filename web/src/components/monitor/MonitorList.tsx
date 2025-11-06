import { Button } from "@/components/ui/Button";
import { ToggleSwitch } from "@/components/ui/ToggleSwitch";

export type Monitor = {
  id: string;
  name: string;
  url: string;
  type: string;
  is_enabled: boolean;
  settings?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type MonitorListProps = {
  monitors: Monitor[];
  // onEditClick: (id: string, monitor: Monitor) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, enabled: boolean) => void;
};

export function MonitorList({
  monitors,
  // onEditClick,
  onDelete,
  onToggle,
}: MonitorListProps) {
  if (!monitors.length)
    return <p className="text-gray-500">モニターが未登録です</p>;

  return (
    <div className="overflow-x-auto rounded-sm border border-gray-400 bg-white">
      <table className="w-full text-sm border-collapse">
        <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
          <tr>
            <th className="px-4 py-2 text-left">モニター名</th>
            <th className="px-4 py-2 text-left">URL</th>
            <th className="px-4 py-2 text-left">タイプ</th>
            <th className="px-4 py-2 text-left">状態</th>
            <th className="px-4 py-2 text-left">作成時刻</th>
            <th className="px-4 py-2 text-left">更新時刻</th>
            <th className="px-4 py-2 text-left">操作</th>
          </tr>
        </thead>
        <tbody>
          {monitors.map((m) => (
            <tr
              key={m.id}
              className="border-t hover:bg-gray-50 transition-colors"
            >
              {/* モニター名 */}
              <td className="px-4 py-2 font-medium text-gray-900">{m.name}</td>

              {/* URL */}
              <td className="px-4 py-2 max-w-[240px] truncate text-blue-600">
                {m.url ? (
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {m.url}
                  </a>
                ) : (
                  "-"
                )}
              </td>

              {/* Type */}
              <td className="px-4 py-2">{m.type}</td>

              {/* 状態 */}
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    m.is_enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {m.is_enabled ? "Enabled" : "Disabled"}
                </span>
              </td>

              {/* 作成日 */}
              <td className="px-4 py-2 text-xs">
                {new Date(m.created_at).toLocaleString()}
              </td>

              {/* 更新日 */}
              <td className="px-4 py-2 text-xs">
                {new Date(m.updated_at).toLocaleString()}
              </td>

              {/* 操作ボタン */}
              <td className="px-4 py-2 text-left">
                <div className="flex items-center gap-2">
                  <ToggleSwitch
                    checked={m.is_enabled}
                    onChange={(v) => onToggle(m.id, v)}
                  />
                  {/*                   <Button
                    intent="secondary"
                    size="sm"
                    onClick={() => onEditClick(m.id, m)}
                  >
                    編集
                  </Button> */}
                </div>
              </td>
              <td className="px-4 py-2 text-right">
                <Button
                  intent="danger"
                  size="sm"
                  onClick={() => onDelete(m.id)}
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
