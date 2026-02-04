"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/actions/logout";
import { routes } from "@/config/routes";
import type { User } from "@/types/user";

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  isLoggedIn: () => boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const router = useRouter();

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
  }, []);

  const logout = useCallback(async () => {
    await logoutAction();
    setUserState(null);
    router.push(routes.home);
  }, [router, setUserState]);

  const isLoggedIn = useCallback(() => Boolean(user?.isLoggedIn), [user]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      logout,
      isLoggedIn,
    }),
    [user, setUser, logout, isLoggedIn],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
