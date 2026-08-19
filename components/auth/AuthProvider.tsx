"use client";

import { AuthGuard } from "./AuthGuard";

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}