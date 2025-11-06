import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../constants/api";
import { tv } from "tailwind-variants";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/Button";
import { useState } from "react";
import { CircleAlert } from "lucide-react";

const label = tv({
  base: "font-bold block text-md text-gray-600 mb-1",
});

const input = tv({
  base: "w-full p-2 rounded-md focus:ring-2 focus:ring-blue-400 outline-none border border-gray800 text-gray-800",
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const jsonData = await res.json();

      if (!res.ok) {
        if (jsonData.message) {
          console.log(jsonData.message);
        }
        throw new Error(jsonData.error || jsonData.message);
      }

      localStorage.setItem("token", jsonData.data.token);

      // ダッシュボードへ遷移
      navigate("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setMessage("Invalid login or password");
      } else {
        setMessage("Failed to connecting server...");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-white">
      <div className="rounded-lg p-5 w-full max-w-md pt-50">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-10">
          Easy Go Monitor
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={cn(label())}>メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(input())}
              required
            />
          </div>

          <div>
            <label className={cn(label())}>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(input())}
              required
            />
          </div>
          <Button
            intent="primary"
            type="submit"
            className="w-full mt-2"
            disabled={loading}
          >
            {loading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>
        <div className="h-10 mt-10">
          {message && (
            <div className="flex items-center gap-2 rounded-lg bg-red-100 p-4">
              <CircleAlert className="w-5 h-5 text-red-700" />
              <p className="text-gray-700 text-center">{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
