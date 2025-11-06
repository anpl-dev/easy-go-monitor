import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { tv } from "tailwind-variants";
import type { MonitorCreateInput } from "../../type/monitor";

const label = tv({ base: "block text-sm font-medium text-gray-700 mb-1" });
const input = tv({
  base: "border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none",
});

type MonitorFormProps = {
  monitor: MonitorCreateInput;
  onChange: <K extends keyof MonitorCreateInput>(
    key: K,
    value: MonitorCreateInput[K]
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
};

export function MonitorForm({
  monitor,
  onChange,
  onSubmit,
  onCancel,
}: MonitorFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className={cn(label())}>モニター名</label>
      <input
        type="text"
        className={cn(input())}
        value={monitor.name}
        onChange={(e) => onChange("name", e.target.value)}
        required
      />

      <label className={cn(label())}>URL</label>
      <input
        type="url"
        className={cn(input())}
        value={monitor.url}
        onChange={(e) => onChange("url", e.target.value)}
        required
      />

      <label className={cn(label())}>タイプ</label>
      <select
        className={cn(input())}
        value={monitor.type}
        onChange={(e) => onChange("type", e.target.value)}
      >
        <option value="http">HTTP</option>
      </select>

      <div className="flex justify-end gap-2 mt-4">
        <Button intent="secondary" onClick={onCancel}>
          キャンセル
        </Button>
        <Button intent="primary" type="submit">
          保存
        </Button>
      </div>
    </form>
  );
}
