import { useState, useCallback } from "react";
import { API_ENDPOINTS } from "@/constants/api";

export type Runner = {
  id: string;
  name: string;
  region: string;
  interval_second: number;
  is_enabled: boolean;
  monitor_id: string;
};

export const useRunners = (userId?: string) => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRunners = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_ENDPOINTS.RUNNERS}?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok) {
        console.error("fetchRunners failed:", json.message);
        return;
      }

      setRunners(json.data || []);
    } catch (err) {
      console.error("fetchRunners error:", err);
      setRunners([]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const deleteRunner = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await fetch(`${API_ENDPOINTS.RUNNERS}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchRunners();
  };

  return { runners, loading, fetchRunners, deleteRunner };
};
