import { SideModal } from "@/components/ui/SideModal";

type RunnerHistoryItem = {
  id: string;
  status: string;
  started_at: string;
  response_time_ms: number;
};

type RunnerHistoryProps = {
  open: boolean;
  onClose: () => void;
  histories: RunnerHistoryItem[];
};

export function RunnerHistory({ open, onClose, histories }: RunnerHistoryProps) {
  return (
    <SideModal open={open} onClose={onClose} title="実行履歴">
      {histories.length === 0 ? (
        <p className="text-gray-500 text-center py-8">履歴がありません</p>
      ) : (
        <div className="overflow-x-auto max-h-[70vh]">
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead className="sticky top-0 bg-gray-100">
              <tr>
                <th className="border px-3 py-2 text-left">ステータス</th>
                <th className="border px-3 py-2 text-left">開始</th>
                <th className="border px-3 py-2 text-left">応答時間 (ms)</th>
              </tr>
            </thead>
            <tbody>
              {histories.map((h) => (
                <tr
                  key={h.id}
                  className="hover:bg-gray-50 transition-colors border-t"
                >
                  <td
                    className={`border px-3 py-2 font-medium ${
                      h.status === "success"
                        ? "text-green-600"
                        : h.status === "error"
                        ? "text-red-500"
                        : "text-gray-600"
                    }`}
                  >
                    {h.status}
                  </td>
                  <td className="border px-3 py-2 text-gray-700 whitespace-nowrap">
                    {new Date(h.started_at).toLocaleString("ja-JP", {
                      hour12: false,
                    })}
                  </td>
                  <td className="border px-3 py-2 text-right text-gray-700">
                    {h.response_time_ms}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SideModal>
  );
}