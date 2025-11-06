// ---- Runner構造体 ----
export type Runner = {
  id: string;
  name: string;
  region: string;
  interval_second: number;
  is_enabled: boolean;
  monitor_id: string;
  created_at?: string;
  updated_at?: string;
};

// --- MonitorとJOINしたRunner用（フロント表示用） ---
export type RunnerWithMonitor = Runner & {
  monitor_name?: string;
  monitor_url?: string;
  monitor_type?: string;
  monitor_is_enabled?: boolean;
  settings?: {
    method?: string;
    timeout_ms?: number;
    headers?: Record<string, string>;
    body?: string;
  };
};

// ---- Monitor 構造体 ----
export type MonitorItem = {
  id: string;
  name: string;
  url?: string;
  type?: string;
  is_enabled?: boolean;
};

// --- Runner作成用 ---
export type RunnerCreateInput = {
  name: string;
  region: string;
  interval_second: number;
  monitor_id: string;
};

// --- Runner更新用 ---
export type RunnerUpdateInput = {
  name: string;
  region: string;
  interval_second: number;
  monitor_id: string;
  is_enabled: boolean;
};
