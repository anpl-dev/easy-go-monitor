import { useState, useEffect, useCallback } from "react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Sidebar from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
// import { SideModal } from "@/components/ui/SideModal";
import { API_ENDPOINTS } from "@/constants/api";
import { useUser } from "@/hooks/useUser";
import { MonitorList } from "@/components/monitor/MonitorList";
import { MonitorForm } from "@/components/monitor/MonitorForm";
// import { SettingsFormHTTP } from "@/components/monitor/SettingsFormHTTP";
import type {
  Monitor,
  MonitorCreateInput,
  // MonitorUpdateInput,
} from "@/type/monitor";
import { toast } from "sonner";
import { sanitizeInput } from "@/lib/utils";

export default function Monitor() {
  const { user } = useUser();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [open, setOpen] = useState(false);
  /*   const [editOpen, setEditOpen] = useState(false);
  const [editingMonitorID, setEditingMonitorID] = useState<string | null>(null);
  const [editData, setEditData] = useState<MonitorUpdateInput>({
    name: "",
    url: "",
    type: "HTTP",
    settings: {},
    is_enabled: true,
  }); */
  const [newMonitor, setNewMonitor] = useState<MonitorCreateInput>({
    name: "",
    url: "",
    type: "HTTP",
  });

  const fetchMonitors = useCallback(async () => {
    if (!user?.id) return;
    const token = localStorage.getItem("token");
    const res = await fetch(API_ENDPOINTS.MONITORS, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (res.ok) setMonitors(json.data || []);
  }, [user?.id]);

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  const handleCreateMonitor = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const sanitized = {
        name: sanitizeInput(newMonitor.name),
        url: sanitizeInput(newMonitor.url),
        type: newMonitor.type,
      };
      const res = await fetch(API_ENDPOINTS.MONITORS, {
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

      await fetchMonitors();
      setOpen(false);
      setNewMonitor({ name: "", url: "", type: "HTTP" });
      toast.success("モニターを作成しました");
    } catch (err) {
      toast.error(`通信中にエラーが発生しました: ${err}`);
    }
  };

  /*   const handleUpdateMonitor = async (id: string, data: MonitorUpdateInput) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.MONITORS}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const jsonData = await res.json();
      if (!res.ok) throw new Error(jsonData.message);

      await fetchMonitors();
      setEditingMonitorID(null);
      setEditOpen(false);
      toast.success("モニターを更新しました");
    } catch {
      toast.error("更新中にエラーが発生しました");
    }
  } */ const handleDeleteMonitor = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!confirm("このモニターを削除してもよろしいですか？")) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.MONITORS}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status !== 204) {
        const jsonData = await res.json();
        if (!res.ok) throw new Error(jsonData.message);
      }

      await fetchMonitors();
      toast.success("モニターを削除しました");
    } catch {
      toast.error("削除中にエラーが発生しました");
    }
  };

  const handleToggleMonitor = async (id: string, isEnabled: boolean) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_ENDPOINTS.MONITORS}/${id}/enabled`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_enabled: isEnabled }),
      });

      if (!res.ok) {
        const jsonData = await res.json();
        throw new Error(jsonData.message);
      }
      setMonitors((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_enabled: isEnabled } : m))
      );

      toast.success(
        isEnabled ? "モニターを有効化しました" : "モニターを無効化しました"
      );
      fetchMonitors();
    } catch {
      toast.error("状態の変更に失敗しました");
    }
  };

  return (
    <DefaultLayout
      sidebar={<Sidebar />}
      header={
        <Header title="Monitors">
          <Button intent="primary" onClick={() => setOpen(true)}>
            + 新規追加
          </Button>
        </Header>
      }
      main={
        <div className="space-y-6">
          <MonitorList
            monitors={monitors}
            /*  onEditClick={(id, m) => {
              setEditingMonitorID(id);
              setEditData({
                name: m.name,
                url: m.url,
                type: m.type,
                settings: m.settings || {},
                is_enabled: m.is_enabled,
              });
              setEditOpen(true);
            }} */
            onDelete={handleDeleteMonitor}
            onToggle={handleToggleMonitor}
          />

          {/* 新規追加用モーダル */}
          <Modal
            open={open}
            title="新規モニター追加"
            onClose={() => setOpen(false)}
          >
            <MonitorForm
              monitor={newMonitor}
              onChange={(field, value) =>
                setNewMonitor((prev) => ({
                  ...prev,
                  [field]: value,
                }))
              }
              onSubmit={handleCreateMonitor}
              onCancel={() => setOpen(false)}
            />
          </Modal>

          {/* 編集用サイドモーダル */}
          {/* 
          <SideModal
            open={editOpen}
            title={`モニター編集：${editData.name}`}
            onClose={() => setEditOpen(false)}
          >
            <SettingsFormHTTP
              value={editData.settings}
              onChange={(v) =>
                setEditData((prev) => ({ ...prev, settings: v }))
              }
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button intent="secondary" onClick={() => setEditOpen(false)}>
                キャンセル
              </Button>
              <Button
                intent="primary"
                onClick={() =>
                  editingMonitorID &&
                  handleUpdateMonitor(editingMonitorID, editData)
                }
              >
                保存
              </Button>
            </div>
          </SideModal> */}
        </div>
      }
    />
  );
}
