// UserContext.ts
import { createContext } from "react";

export type User = {
  id: string;
  name: string;
  email: string;
};

export type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => void;
};

export const UserContext = createContext<UserContextType | null>(null);
