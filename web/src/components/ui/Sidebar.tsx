import { tv } from "tailwind-variants";
import { cn } from "../../lib/utils";
import { LogOut, Home, BarChart3, Settings, Play, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { VERSION } from "../../constants/config";
import { useRef, useEffect, useState } from "react";

const sidebar = tv({
  base: "flex flex-col h-full bg-white relative",
});

const navItem = tv({
  base: "flex px-6 py-5 items-center gap-3 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer",
  variants: {
    active: {
      true: "bg-blue-100 text-blue-700 font-semibold",
      false: "",
    },
  },
  defaultVariants: {
    active: false,
  },
});

const userMenu = tv({
  base: "absolute top-15 w-48 bg-white border border-gray-300 hover:bg-gray-100 rounded-md shadow-lg py-2",
});

const userButton = tv({
  base: "flex items-center gap-3 w-full hover:bg-gray-100 rounded-md p-2 transition",
});

export default function Sidebar() {
  const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "Monitors", path: "/monitors", icon: BarChart3 },
    { label: "Runners", path: "/runners", icon: Play },
    { label: "Settings", path: "/settings", icon: Settings },
  ];
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  if (!user) return "unknown name";

  return (
    <aside className={cn(sidebar())}>
      {/* Header: ユーザ情報 */}
      <div className="w-full flex items-center mb-10 mt-2" ref={menuRef}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={cn(userButton())
          }
        >
          <User className="flex rounded-full gap-3 space-y-10 w-7 h-7 bg-gray-300 text-gray-600" />
          <span className="text-gray-700 text-xl font-medium">
            {user?.name}
          </span>
        </button>

        {open && (
          <div className={cn(userMenu())}>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700"
            >
              <LogOut className="w-4 h-4" />
              ログアウト
            </button>
          </div>
        )}
      </div>

      {/* ナビゲーションリスト */}
      <nav className="w-full flex-1 flex-col space-y-1">
        {navItems.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} end className="block">
            {({ isActive }) => (
              <div className={cn(navItem({ active: isActive }))}>
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer: システム情報 */}
      <div className="border-t border-gray-300 px-4 py-3 text-sm text-gray-500 ">
        {VERSION}
      </div>
    </aside>
  );
}
