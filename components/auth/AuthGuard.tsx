"use client";

import {
  useEffect,
  useState,
} from "react";

import { usePathname, useRouter } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      const user =
        await getCurrentUser();

      if (!mounted) {
        return;
      }

      /*
       * Usuario no autenticado
       */

      if (!user) {
        if (pathname !== "/login") {
          router.replace("/login");
        }

        setChecking(false);
        return;
      }

      /*
       * Usuario autenticado pero desactivado
       */

      if (!user.active) {
        if (pathname !== "/login") {
          router.replace("/login");
        }

        setChecking(false);
        return;
      }

      /*
       * Usuario autenticado correctamente
       */

      if (
        pathname === "/login"
      ) {
        router.replace("/dashboard");
        return;
      }

      setChecking(false);
    }

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [
    pathname,
    router,
  ]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">
          Verificando sesión...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}