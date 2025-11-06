import { cn } from "../../lib/utils";
import { tv } from "tailwind-variants";

const label = tv({ base: "block text-sm font-medium text-gray-700 mb-1" });
const input = tv({
  base: "border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none",
});

type HTTPSettings = {
  monitor_name?: string;
  url?: string;
  method?: string;
  timeout?: number;
  expected_status?: number;
};

type Props = {
  value: HTTPSettings;
  onChange: (v: HTTPSettings) => void;
};

export function SettingsFormHTTP({ value, onChange }: Props) {
  const handleChange = (key: keyof HTTPSettings, val: string | number) => {
    onChange({ ...value, [key]: val } as HTTPSettings);
  };

  return (
    <div className="space-y-3">
      <label className={cn(label())}>HTTPメソッド</label>
      <select
        className={cn(input())}
        value={value.method}
        onChange={(e) => handleChange("method", e.target.value)}
      >
        <option value="GET">GET</option>
        <option value="POST">POST(Mock)</option>
        <option value="POST">PUT(Mock)</option>
        <option value="POST">DELETE(Mock)</option>
      </select>

      {/*       <label className={cn(label())}>タイムアウト（秒）</label>
      <input
        type="number"
        className={cn(input())}
        value={value.timeout ?? 5}
        onChange={(e) => handleChange("timeout", Number(e.target.value))}
      /> */}

      {/*       <label className={cn(label())}>期待ステータスコード (Mock)</label>
      <input
        type="number"
        className={cn(input())}
        value={value.expected_status ?? 200}
        onChange={(e) =>
          handleChange("expected_status", Number(e.target.value))
        }
      /> */}
    </div>
  );
}
