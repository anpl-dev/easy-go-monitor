import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";

const overlay = tv({
  base: "absolute inset-0 bg-gray-800/50",
});

const content = tv({
  base: "relative bg-white rounded-lg p-6 w-full max-w-md",
});

type ModalProps = {
  open: boolean;
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose} // ← 背景クリックで閉じる
    >
      {/* 背景オーバーレイ */}
      <div className={cn(overlay())} aria-hidden="true" />

      {/* モーダル本体（クリックしても閉じない） */}
      <div className={cn(content())} onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
