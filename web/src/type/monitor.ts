export type Monitor = {
  id: string;
  user_id?: string;
  name: string;
  url: string;
  type: "http" | "tcp" | "udp" | string;
  settings: Record<string, unknown>;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
  runners_count?: number;
};

/** --- Monitor 作成時の入力型 --- */
export type MonitorCreateInput = {
  name: string;
  url: string;
  type: string;
};

/** --- Monitor 更新時の入力型 --- */
export type MonitorUpdateInput = {
  name: string;
  url: string;
  type: string;
  settings: Record<string, unknown>;
  is_enabled: boolean;
};