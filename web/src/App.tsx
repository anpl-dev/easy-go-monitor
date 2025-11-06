import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import type { JSX } from "react";
import Runner from "./pages/Runner";
import Monitor from "./pages/Monitor";
import Settings from "./pages/Settings";
import { useUser } from "./hooks/useUser";
import { UserProvider } from "./context/UserProvider";
import { Toaster } from "sonner";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* ログインページ */}
          <Route path="/" element={<Login />} />

          {/* 認証が必要なページ */}
          <Route
            path="/*"
            element={
              <UserProvider>
                <Routes>
                  {/* (デフォルト) ダッシュボードページ */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* モニターページ */}
                  <Route
                    path="/monitors"
                    element={
                      <ProtectedRoute>
                        <Monitor />
                      </ProtectedRoute>
                    }
                  />

                  {/* ランナーページ */}
                  <Route
                    path="/runners"
                    element={
                      <ProtectedRoute>
                        <Runner />
                      </ProtectedRoute>
                    }
                  />

                  {/* 設定ページ */}
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </UserProvider>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" richColors expand={false} duration={2000} />
    </>
  );
}
