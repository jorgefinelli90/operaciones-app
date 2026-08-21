"use client";

import { useEffect } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useAuth } from "@/lib/auth/AuthContext";

export function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    loading,
  } = useAuth();

  /*
   * ============================================================
   * ROUTING
   * ============================================================
   */

  useEffect(() => {
    if (loading) {
      return;
    }

    /*
     * ========================================================
     * SIN USUARIO
     * ========================================================
     */

    if (!user) {
      /*
       * IMPORTANTE:
       *
       * /login es una ruta pública.
       *
       * Si no hay usuario y estamos en login,
       * simplemente dejamos renderizar la página.
       */

      if (pathname === "/login") {
        return;
      }

      router.replace("/login");

      return;
    }

    /*
     * ========================================================
     * USUARIO DESACTIVADO
     * ========================================================
     */

    if (!user.active) {
      if (pathname !== "/login") {
        router.replace("/login");
      }

      return;
    }

    /*
     * ========================================================
     * USUARIO AUTENTICADO EN LOGIN
     * ========================================================
     */

    if (pathname === "/login") {
      router.replace("/dashboard");
    }
  }, [
    user,
    loading,
    pathname,
    router,
  ]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />

          <span className="text-sm text-muted-foreground">
            Verificando sesión...
          </span>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * LOGIN SIN USUARIO
   *
   * ESTA ES LA EXCEPCIÓN IMPORTANTE.
   * ============================================================
   */

  if (
    pathname === "/login" &&
    !user
  ) {
    return <>{children}</>;
  }

  /*
   * ============================================================
   * SIN USUARIO EN RUTA PRIVADA
   * ============================================================
   */

  if (!user) {
    return null;
  }

  /*
   * ============================================================
   * USUARIO DESACTIVADO
   * ============================================================
   */

  if (!user.active) {
    return null;
  }

  /*
   * ============================================================
   * TODO OK
   * ============================================================
   */

  return <>{children}</>;
}