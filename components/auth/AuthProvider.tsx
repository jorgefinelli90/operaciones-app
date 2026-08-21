"use client";

import {
  AuthProvider as AuthContextProvider,
} from "@/lib/auth/AuthContext";

import { AuthGuard } from "./AuthGuard";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthContextProvider>
      <AuthGuard>
        {children}
      </AuthGuard>
    </AuthContextProvider>
  );
}