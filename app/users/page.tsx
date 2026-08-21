"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  Sidebar,
} from "@/components/sidebar";

import {
  TopBar,
} from "@/components/topbar";

import {
  useAuth,
} from "@/lib/auth/AuthContext";

import {
  getUsers,
} from "@/lib/users/repository";

import type {
  UserProfile,
} from "@/lib/users/types";

export default function UsersPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
    can,
  } = useAuth();

  const [
    users,
    setUsers,
  ] = useState<UserProfile[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null,
  );

  /*
   * ============================================================
   * LOAD USERS
   * ============================================================
   */

  const loadUsers =
    useCallback(async () => {
      if (!can("users.manage")) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data =
          await getUsers();

        setUsers(data);
      } catch (error) {
        console.error(
          "Error cargando usuarios:",
          error,
        );

        setError(
          error instanceof Error
            ? error.message
            : "No se pudieron cargar los usuarios.",
        );
      } finally {
        setLoading(false);
      }
    }, [can]);

  /*
   * ============================================================
   * PROTECCIÓN
   * ============================================================
   */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (
      !user ||
      !user.active
    ) {
      router.replace("/login");
      return;
    }

    if (
      !can("users.manage")
    ) {
      router.replace(
        "/dashboard",
      );

      return;
    }

    void loadUsers();
  }, [
    authLoading,
    user,
    can,
    router,
    loadUsers,
  ]);

  /*
   * ============================================================
   * AUTH LOADING
   * ============================================================
   */

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />

          <span className="text-sm text-muted-foreground">
            Verificando permisos...
          </span>
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * ACCESS DENIED
   * ============================================================
   */

  if (
    !user ||
    !user.active ||
    !can("users.manage")
  ) {
    return null;
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <TopBar />

      <main className="ml-64 mt-16 p-6">
        {/* ==================================================
            HEADER
            ================================================== */}

        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Usuarios
            </h1>

            <p className="mt-1 text-muted-foreground">
              Administración de usuarios y permisos.
            </p>
          </div>

          <button
            type="button"
            disabled
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50"
          >
            + Nuevo usuario
          </button>
        </div>

        {/* ==================================================
            ERROR
            ================================================== */}

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* ==================================================
            TABLE
            ================================================== */}

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />

                Cargando usuarios...
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="text-center">
                <p className="font-medium text-foreground">
                  No hay usuarios
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  No se encontraron usuarios registrados.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Usuario
                    </th>

                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Email
                    </th>

                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Rol
                    </th>

                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Estado
                    </th>

                    <th className="px-5 py-3 text-left font-medium text-muted-foreground">
                      Alta
                    </th>

                    <th className="px-5 py-3 text-right font-medium text-muted-foreground">
                      Acción
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {users.map(
                    (item) => {
                      const initials =
                        item.name
                          .trim()
                          .split(
                            /\s+/,
                          )
                          .slice(
                            0,
                            2,
                          )
                          .map(
                            (
                              part,
                            ) =>
                              part
                                .charAt(
                                  0,
                                )
                                .toUpperCase(),
                          )
                          .join("");

                      const createdAt =
                        new Date(
                          item.created_at,
                        ).toLocaleDateString(
                          "es-AR",
                        );

                      return (
                        <tr
                          key={
                            item.id
                          }
                          className="border-b border-border last:border-0 hover:bg-muted/20"
                        >
                          {/* USUARIO */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                {
                                  initials
                                }
                              </div>

                              <span className="font-medium text-foreground">
                                {
                                  item.name
                                }
                              </span>
                            </div>
                          </td>

                          {/* EMAIL */}

                          <td className="px-5 py-4 text-muted-foreground">
                            {
                              item.email
                            }
                          </td>

                          {/* ROL */}

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                              {
                                item
                                  .role
                                  .name
                              }
                            </span>
                          </td>

                          {/* ESTADO */}

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-2 text-xs font-medium ${
                                item.active
                                  ? "text-emerald-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  item.active
                                    ? "bg-emerald-500"
                                    : "bg-muted-foreground"
                                }`}
                              />

                              {item.active
                                ? "Activo"
                                : "Inactivo"}
                            </span>
                          </td>

                          {/* FECHA */}

                          <td className="px-5 py-4 text-muted-foreground">
                            {
                              createdAt
                            }
                          </td>

                          {/* ACCIÓN */}

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              disabled
                              className="text-sm font-medium text-muted-foreground opacity-50"
                            >
                              Editar
                            </button>
                          </td>
                        </tr>
                      );
                    },
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ==================================================
            FOOTER
            ================================================== */}

        {!loading &&
          users.length > 0 && (
            <div className="mt-3 text-xs text-muted-foreground">
              {users.length}{" "}
              {users.length === 1
                ? "usuario"
                : "usuarios"}
            </div>
          )}
      </main>
    </div>
  );
}