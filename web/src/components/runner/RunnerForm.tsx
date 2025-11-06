import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { tv } from "tailwind-variants";
import type { MonitorItem, RunnerCreateInput } from "@/type/runner";

// --- styles ---
const label = tv({ base: "block text-sm font-medium text-gray-700 mb-1" });
const input = tv({
  base: "border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none",
});

type RunnerFormProps = {
  runner: RunnerCreateInput;
  monitors: MonitorItem[];
  onChange: (field: keyof RunnerCreateInput, value: string | number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

// --- コンポーネント本体 ---
export function RunnerForm({
  runner,
  monitors,
  onChange,
  onSubmit,
  onCancel,
}: RunnerFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* Runner名 */}
      <label className={cn(label())}>ランナー名</label>
      <input
        type="text"
        className={cn(input())}
        value={runner.name}
        onChange={(e) => onChange("name", e.target.value)}
        required
      />

      {/* Region */}
      <label className={cn(label())}>Region</label>
      <input
        type="text"
        className={cn(input())}
        value={runner.region}
        onChange={(e) => onChange("region", e.target.value)}
        required
      />

      {/* Interval */}
      <label className={cn(label())}>Interval (秒)</label>
      <input
        type="number"
        min={10}
        className={cn(input())}
        value={runner.interval_second}
        onChange={(e) => onChange("interval_second", Number(e.target.value))}
      />

      {/* 対象モニター */}
      <label className={cn(label())}>対象モニター</label>
      <select
        className={cn(input())}
        value={runner.monitor_id}
        onChange={(e) => onChange("monitor_id", e.target.value)}
        required
      >
        <option value="">モニターを選択</option>
        {monitors.map((m) => (
          <option
            key={m.id}
            value={m.id}
            disabled={!m.is_enabled}
            className={!m.is_enabled ? "text-gray-400" : ""}
          >
            {m.name} {m.is_enabled ? "" : "(無効)"}
          </option>
        ))}
      </select>

      {/* ボタン */}
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" intent="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        <Button intent="primary" type="submit">
          保存
        </Button>
      </div>
    </form>
  );
}
