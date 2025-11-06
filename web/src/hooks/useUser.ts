import { useContext } from "react";
import { UserContext } from "../context/UserContext"; // Context定義ファイル
import type { UserContextType } from "../context/UserContext";

// UserProvider.tsxをラップした関数
export function useUser(): UserContextType {
  const context = useContext(UserContext);

  // Contextが存在しない場合はエラー
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
