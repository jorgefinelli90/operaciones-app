"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import type { CurrentUser } from "@/lib/auth/types";

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
  can: (permission: string) => boolean;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<CurrentUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  /*
   * ============================================================
   * CARGAR USUARIO
   * ============================================================
   */

  const refreshUser =
    useCallback(async () => {
      const currentUser =
        await getCurrentUser();

      setUser(currentUser);
    }, []);

  /*
   * ============================================================
   * INICIALIZAR AUTH
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const currentUser =
          await getCurrentUser();

        if (!mounted) {
          return;
        }

        setUser(currentUser);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    /*
     * ========================================================
     * ESCUCHAR CAMBIOS DE SESIÓN
     * ========================================================
     */

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        async (event) => {
          if (!mounted) {
            return;
          }

          if (
            event === "SIGNED_OUT"
          ) {
            setUser(null);
            return;
          }

          if (
            event === "SIGNED_IN" ||
            event ===
              "TOKEN_REFRESHED"
          ) {
            /*
             * Esperamos a que Supabase
             * termine de actualizar la sesión
             * antes de consultar el profile.
             */

            await refreshUser();
          }
        },
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  /*
   * ============================================================
   * PERMISOS
   * ============================================================
   */

  const can = useCallback(
    (permission: string) => {
      if (!user || !user.active) {
        return false;
      }

      /*
       * ADMIN = acceso total
       */

      if (user.role === "ADMIN") {
        return true;
      }

      return user.permissions.includes(
        permission,
      );
    },
    [user],
  );

  /*
   * ============================================================
   * SIGN OUT
   * ============================================================
   */

  const handleSignOut =
    useCallback(async () => {
      const {
        error,
      } =
        await supabase.auth.signOut();

      if (error) {
        console.error(
          "Error cerrando sesión:",
          error,
        );

        throw error;
      }

      setUser(null);

      window.location.href =
        "/login";
    }, []);

  /*
   * ============================================================
   * CONTEXT VALUE
   * ============================================================
   */

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,
        loading,
        can,
        refreshUser,
        signOut: handleSignOut,
      }),
      [
        user,
        loading,
        can,
        refreshUser,
        handleSignOut,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

/*
 * ==============================================================
 * HOOK
 * ==============================================================
 */

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider.",
    );
  }

  return context;
}