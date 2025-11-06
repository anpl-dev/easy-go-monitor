import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "../../lib/utils";

const button = tv({
  base: "font-medium rounded-md transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  variants: {
    intent: {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    },
    size: {
      sm: "px-3 py-1 text-sm",
      smh: "px-3 py-2 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button>;

export function Button({ intent, size, className, ...props }: ButtonProps) {
  return (
    <button className={cn(button({ intent, size }), className)} {...props} />
  );
}