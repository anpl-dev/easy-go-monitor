import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext, type UserContextType } from "./UserContext";
import { API_ENDPOINTS } from "../constants/api";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserContextType["user"]>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<{ user_id: string }>(token);
      if (!decoded.user_id) throw new Error("Invalid token payload");

      fetch(`${API_ENDPOINTS.USERS}/${decoded.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message);
          setUser({
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
          });
        })
        .catch((err) => {
          console.error("User fetch error:", err);
          localStorage.removeItem("token");
          navigate("/");
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Invalid token", err);
      localStorage.removeItem("token");
      setLoading(false);
      navigate("/");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}
