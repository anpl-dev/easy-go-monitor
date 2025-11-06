import { useEffect, useState } from "react";
import DefaultLayout from "../components/layout/DefaultLayout";
import { Header } from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/constants/api";

type RunnerFailHistory = {
  id: string;
  runner_id: string;
  status: string;
  message?: string;
  started_at: string;
  ended_at?: string;
  response_time_ms?: number;
  created_at: string;
};

export default function Dashboard() {
  const [histories, setHistories] = useState<RunnerFailHistory[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFailHistories = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        `${API_ENDPOINTS.RUNNER_HISTORIES}?status=FAIL&minutes=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setHistories(json.data ?? []);
    } catch (err) {
      toast.error("履歴の取得に失敗しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 初回 + 30秒ごとに更新
  useEffect(() => {
    fetchFailHistories();
    const interval = setInterval(fetchFailHistories, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DefaultLayout
      sidebar={<Sidebar />}
      header={<Header title="Dashboard" />}
      main={
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">アラート情報</h2>
            <button
              onClick={fetchFailHistories}
              className="text-sm text-blue-600 hover:underline"
            >
              手動更新
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-md border border-gray-300">
            {loading ? (
              <p className="p-6 text-gray-500">読み込み中...</p>
            ) : histories.length === 0 ? (
              <p className="p-6 text-gray-500">
                現在アクティブなアラートはありません。
              </p>
            ) : (
              <table className="w-full text-sm border-collapse">
                <thead className="bg-gray-50 text-gray-700 font-semibold border-b">
                  <tr>
                    <th className="px-4 py-2 text-left">Runner ID</th>
                    <th className="px-4 py-2 text-left">Message</th>
                    <th className="px-4 py-2 text-left">Response Time</th>
                    <th className="px-4 py-2 text-left">TimeStamp</th>
                  </tr>
                </thead>
                <tbody>
                  {histories.map((h) => (
                    <tr
                      key={h.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-2 font-medium text-gray-800">
                        {h.runner_id}
                      </td>
                      <td className="px-4 py-2 text-red-600">{h.message}</td>
                      <td className="px-4 py-2">
                        {h.response_time_ms ?? "-"} ms
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {new Date(h.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      }
    />
  );
}
