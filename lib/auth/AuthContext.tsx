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

  can: (
    permission: string,
  ) => boolean;

  refreshUser: () => Promise<void>;

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
    useState<CurrentUser | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  /*
   * ============================================================
   * REFRESH USER
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
   * INITIALIZE
   * ============================================================
   */

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        /*
         * Primero comprobamos si existe
         * una sesión.
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
         * ------------------------------------------------------
         * NO HAY SESIÓN
         * ------------------------------------------------------
         */

        if (!session) {
          setUser(null);
          setLoading(false);

          return;
        }

        /*
         * ------------------------------------------------------
         * HAY SESIÓN
         * ------------------------------------------------------
         */

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
     * AUTH STATE CHANGE
     * ========================================================
     */

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth.onAuthStateChange(
        (event) => {
          /*
           * ----------------------------------------------------
           * SIGNED OUT
           * ----------------------------------------------------
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
           * ----------------------------------------------------
           * SIGNED IN
           *
           * No hacemos await directamente
           * dentro del callback de Supabase.
           * ----------------------------------------------------
           */

          if (
            event ===
            "SIGNED_IN"
          ) {
            setLoading(true);

            setTimeout(() => {
              void refreshUser().finally(
                () => {
                  setLoading(false);
                },
              );
            }, 0);

            return;
          }

          /*
           * ----------------------------------------------------
           * TOKEN REFRESHED
           *
           * No necesitamos volver a cargar profile.
           * ----------------------------------------------------
           */

          if (
            event ===
            "TOKEN_REFRESHED"
          ) {
            return;
          }
        },
      );

    /*
     * ========================================================
     * CLEANUP
     * ========================================================
     */

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, [refreshUser]);

  /*
   * ============================================================
   * PERMISSIONS
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
   * SIGN OUT
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