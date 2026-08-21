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
import { can as checkPermission } from "@/lib/auth/permissions";

import type { CurrentUser } from "@/lib/auth/types";

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;

  /**
   * Comprueba si el usuario puede ejecutar
   * una determinada acción.
   *
   * ADMIN siempre devuelve true.
   */
  can: (permission: string) => boolean;

  /**
   * Recarga el usuario y sus permisos
   * desde Supabase.
   */
  refreshUser: () => Promise<void>;

  /**
   * Cierra la sesión actual.
   */
  signOut: () => Promise<void>;
}

const AuthContext =
  createContext<
    AuthContextValue | undefined
  >(undefined);

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
   * CARGAR / RECARGAR USUARIO
   * ============================================================
   */

  const refreshUser =
    useCallback(async () => {
      try {
        const currentUser =
          await getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        console.error(
          "Error cargando usuario:",
          error,
        );

        setUser(null);
      }
    }, []);

  /*
   * ============================================================
   * INICIALIZACIÓN
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
      } catch (error) {
        console.error(
          "Error inicializando autenticación:",
          error,
        );

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    initialize();

    /*
     * ========================================================
     * ESCUCHAR CAMBIOS DE AUTH
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

          /*
           * LOGOUT
           */

          if (
            event ===
            "SIGNED_OUT"
          ) {
            setUser(null);
            setLoading(false);
            return;
          }

          /*
           * LOGIN
           */

          if (
            event ===
            "SIGNED_IN"
          ) {
            setLoading(true);

            await refreshUser();

            if (mounted) {
              setLoading(false);
            }

            return;
          }

          /*
           * REFRESH DEL TOKEN
           *
           * No necesitamos volver a consultar
           * constantemente el profile.
           *
           * El usuario actual sigue siendo válido.
           */

          if (
            event ===
            "TOKEN_REFRESHED"
          ) {
            return;
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

  const can =
    useCallback(
      (permission: string) => {
        return checkPermission(
          user,
          permission,
        );
      },
      [user],
    );

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  const signOut =
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
        signOut,
      }),
      [
        user,
        loading,
        can,
        refreshUser,
        signOut,
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
 * useAuth
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