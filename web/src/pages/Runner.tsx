import { useRunners } from "../hooks/useRunners";
import { useUser } from "@/hooks/useUser";
import { RunnerList } from "../components/runner/RunnerList";
import { RunnerForm } from "../components/runner/RunnerForm";
import { RunnerHistory } from "../components/runner/RunnerHistory";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Sidebar from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { API_ENDPOINTS } from "@/constants/api";
import { useMonitors } from "@/hooks/useMonitors";
import type { RunnerUpdateInput, RunnerWithMonitor } from "@/type/runner";
import { SideModal } from "@/components/ui/SideModal";
import { sanitizeInput } from "@/lib/utils";

export default function Runner() {
  const { user } = useUser();
  const { runners, fetchRunners, deleteRunner } = useRunners(user?.id);
  const { monitors } = useMonitors();
  const [open, setOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [histories, setHistories] = useState([]);
  const [newRunner, setNewRunner] = useState({
    name: "",
    region: "",
    interval_second: 60,
    monitor_id: "",
  });
  const runnersWithMonitor = runners.map((r) => {
    const monitor = monitors.find((m) => String(m.id) === String(r.monitor_id));
    return {
      ...r,
      monitor_name: monitor?.name ?? "未設定",
      monitor_url: monitor?.url ?? "-",
      monitor_type: monitor?.type ?? "-",
      settings: monitor?.settings ?? {},
      monitor_is_enabled: monitor?.is_enabled ?? false,
    };
  });
  const [editingRunner, setEditingRunner] = useState<RunnerWithMonitor | null>(
    null
  );
  const [editData, setEditData] = useState<RunnerUpdateInput | null>(null);

  useEffect(() => {
    if (user?.id && monitors.length > 0) {
      fetchRunners();
    }
  }, [user?.id, monitors, fetchRunners]);

  // --- Runner作成 ---
  const handleCreateRunner = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const sanitized = {
        name: sanitizeInput(newRunner.name),
        region: sanitizeInput(newRunner.region),
        interval_second: newRunner.interval_second,
        monitor_id: newRunner.monitor_id,
      };
      const res = await fetch(API_ENDPOINTS.RUNNERS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sanitized),
      });

      const jsonData = await res.json();
      if (!res.ok) {
        toast.error(`Error: ${jsonData.message}`);
        return;
      }

      toast.success("ランナーを作成しました");
      setOpen(false);
      setNewRunner({
        name: "",
        region: "",
        interval_second: 60,
        monitor_id: "",
      });
      await fetchRunners();
    } catch (err) {
      console.error(err);
      toast.error("ランナーの作成に失敗しました");
    }
  };

  // --- Runner履歴表示 ---
  const handleShowHistory = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.RUNNERS}/${id}/histories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        setHistories(json.data || []);
        setHistoryOpen(true);
      } else {
        toast.error(json.message || "履歴の取得に失敗しました");
      }
    } catch {
      toast.error("履歴の取得に失敗しました");
    }
  };

  // --- Runner編集 ---
  const handleEditRunner = (r: RunnerWithMonitor) => {
    setEditingRunner(r);
    setEditData({
      name: r.name,
      region: r.region,
      interval_second: r.interval_second,
      is_enabled: r.is_enabled,
      monitor_id: r.monitor_id,
    });
  };

  // ---- Runner更新 ----
  const handleUpdateRunner = async (id: string, data: RunnerUpdateInput) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.RUNNERS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      toast.success("ランナーを更新しました");
      setEditingRunner(null);
      fetchRunners();
    } catch (err) {
      console.error(err);
      toast.error("ランナーの更新に失敗しました");
    }
  };

  // --- Runner実行 ---
  const handleExecuteRunner = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.RUNNERS}/${id}/execute`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("ランナーを実行しました");
      } else {
        const json = await res.json();
        throw new Error(json.message);
      }
    } catch {
      toast.error("ランナーの実行に失敗しました");
    }
  };

  return (
    <DefaultLayout
      sidebar={<Sidebar />}
      header={
        <Header title="Runners">
          <Button intent="primary" onClick={() => setOpen(true)}>
            + 新規追加
          </Button>
        </Header>
      }
      main={
        <div className="space-y-6">
          <>
            <RunnerList
              runners={runnersWithMonitor}
              onDelete={deleteRunner}
              onExecute={handleExecuteRunner}
              onShowHistory={handleShowHistory}
              onEdit={handleEditRunner}
            />

            {/* Runner編集サイドモーダル */}
            <SideModal
              open={!!editingRunner}
              title="Runner編集"
              onClose={() => setEditingRunner(null)}
            >
              {editData && (
                <RunnerForm
                  runner={editData}
                  monitors={monitors}
                  onChange={(f, v) =>
                    setEditData((prev) => ({ ...prev!, [f]: v }))
                  }
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editingRunner && editData)
                      handleUpdateRunner(editingRunner.id, editData);
                  }}
                  onCancel={() => setEditingRunner(null)}
                />
              )}
            </SideModal>
          </>

          {/* Runner作成モーダル */}
          <Modal open={open} title="Runner作成" onClose={() => setOpen(false)}>
            <RunnerForm
              runner={newRunner}
              monitors={monitors}
              onChange={(field, value) =>
                setNewRunner((prev) => ({ ...prev, [field]: value }))
              }
              onSubmit={handleCreateRunner}
              onCancel={() => setOpen(false)}
            />
          </Modal>

          {/* Runner履歴モーダル */}
          <RunnerHistory
            open={historyOpen}
            onClose={() => setHistoryOpen(false)}
            histories={histories}
          />
        </div>
      }
    />
  );
}
