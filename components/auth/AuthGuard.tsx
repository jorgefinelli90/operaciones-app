"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase/client";
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
      /*
       * ========================================================
       * 1. PRIMERO: ¿HAY SESIÓN?
       * ========================================================
       */

      const {
        data: {
          session,
        },
      } =
        await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      /*
       * ========================================================
       * 2. SIN SESIÓN
       * ========================================================
       */

      if (!session) {
        if (pathname !== "/login") {
          router.replace("/login");
          return;
        }

        setChecking(false);
        return;
      }

      /*
       * ========================================================
       * 3. HAY SESIÓN → CARGAR PROFILE
       * ========================================================
       */

      const user =
        await getCurrentUser();

      if (!mounted) {
        return;
      }

      /*
       * Auth existe pero profile no.
       */

      if (!user) {
        await supabase.auth.signOut();

        router.replace("/login");
        return;
      }

      /*
       * ========================================================
       * 4. USUARIO DESACTIVADO
       * ========================================================
       */

      if (!user.active) {
        await supabase.auth.signOut();

        router.replace("/login");
        return;
      }

      /*
       * ========================================================
       * 5. YA LOGUEADO → NO MOSTRAR LOGIN
       * ========================================================
       */

      if (pathname === "/login") {
        router.replace("/dashboard");
        return;
      }

      /*
       * ========================================================
       * 6. TODO OK
       * ========================================================
       */

      setChecking(false);
    }

    checkAuth();

    /*
     * ==========================================================
     * CAMBIOS DE SESIÓN
     * ==========================================================
     */

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event) => {
          if (!mounted) {
            return;
          }

          if (
            event ===
            "SIGNED_OUT"
          ) {
            router.replace("/login");
          }
        },
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [
    pathname,
    router,
  ]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (checking) {
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

  return <>{children}</>;
}