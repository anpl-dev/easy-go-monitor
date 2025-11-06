import { useState, useEffect, useCallback } from "react";
import { API_ENDPOINTS } from "@/constants/api";
import { toast } from "sonner";

export type Monitor = {
  id: string;
  name: string;
  url: string;
  type: string;
  is_enabled: boolean;
  settings: Record<string, unknown>;
};

export function useMonitors() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMonitors = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(API_ENDPOINTS.MONITORS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      const data = Array.isArray(json.data)
        ? json.data
        : Array.isArray(json.items)
        ? json.items
        : [];
      setMonitors(data);
    } catch (err) {
      toast.error(`モニター一覧の取得に失敗しました: ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonitors();
  }, [fetchMonitors]);

  return { monitors, loading, fetchMonitors };
}
