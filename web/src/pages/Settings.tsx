import { useState, useEffect } from "react";
import DefaultLayout from "@/components/layout/DefaultLayout";
import Sidebar from "@/components/ui/Sidebar";
import { Header } from "@/components/ui/Header";
import { Button } from "@/components/ui/Button";
import { useUser } from "@/hooks/useUser";
import { API_ENDPOINTS } from "@/constants/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user } = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // --- 初期値をセット ---
  useEffect(() => {
    if (user) {
      setUsername(user.name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  // --- ユーザー更新処理 ---
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !user?.id) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.USERS}/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: username,
          email: email,
          password: password,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      toast.success("ユーザー情報を更新しました");
      setPassword("");
    } catch (err) {
      console.error(err);
      toast.error("ユーザー情報の更新に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DefaultLayout
      sidebar={<Sidebar />}
      header={<Header title="Settings" />}
      main={
        <div className="p-10 bg-white border border-gray-400 rounded-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ユーザー設定
          </h2>

          <form onSubmit={handleUpdateUser} className="space-y-5">
            {/* ユーザー名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ユーザー名
              </label>
              <input
                type="text"
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* メール */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* パスワード */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                パスワード
              </label>
              <input
                type="password"
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* 保存ボタン */}
            <div className="flex justify-end mt-6">
              <Button intent="primary" type="submit" disabled={saving}>
                保存
              </Button>
            </div>
          </form>
        </div>
      }
    />
  );
}
