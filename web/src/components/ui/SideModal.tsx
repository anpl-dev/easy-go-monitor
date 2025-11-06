import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { tv, type VariantProps } from "tailwind-variants";
import React from "react";

const sideModal = tv({
  slots: {
    overlay: [
      "fixed inset-0 z-40 transition-all duration-300",
      "bg-black/30",
      "flex justify-end", // 右側にモーダルを配置
    ],
    panel: [
      "h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col",
      "border-l border-gray-200",
    ],
    header: [
      "flex justify-between items-center px-5 py-3 border-b",
      "bg-gray-50",
    ],
    body: ["flex-1 overflow-y-auto p-5"],
  },
  variants: {
    open: {
      true: { overlay: "visible opacity-100", panel: "translate-x-0" },
      false: { overlay: "invisible opacity-0", panel: "translate-x-full" },
    },
    size: {
      sm: { panel: "w-[320px]" },
      md: { panel: "w-[420px]" },
      lg: { panel: "w-[560px]" },
    },
  },
  defaultVariants: {
    open: false,
    size: "md",
  },
});

type SideModalProps = {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
} & VariantProps<typeof sideModal>;

// コンポーネント本体
export function SideModal({
  open,
  title,
  onClose,
  children,
  size,
}: SideModalProps) {
  const { overlay, panel, header, body } = sideModal({ open, size });

  return (
    <div
      className={cn(overlay())}
      onClick={onClose}
      aria-hidden={!open}
      role="dialog"
    >
      <div
        className={cn(panel())}
        onClick={(e) => e.stopPropagation()} // 内側クリックでは閉じない
      >
        <div className={cn(header())}>
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 transition"
            aria-label="閉じる"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className={cn(body())}>{children}</div>
      </div>
    </div>
  );
}
