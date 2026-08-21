"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  X,
  Plus,
  Loader2,
  UserPlus,
  Pencil,
  KeyRound,
} from "lucide-react";

import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/topbar";

import { useAuth } from "@/lib/auth/AuthContext";

import { getUsers } from "@/lib/users/repository";

import { supabase } from "@/lib/supabase/client";

import type {
  UserProfile,
  UserRole,
} from "@/lib/users/types";

export default function UsersPage() {
  const router = useRouter();

  const {
    user,
    loading: authLoading,
    can,
  } = useAuth();

  const [users, setUsers] =
    useState<UserProfile[]>([]);

  const [roles, setRoles] =
    useState<UserRole[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ============================================================
   * CREATE
   * ============================================================
   */

  const [createOpen, setCreateOpen] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  const [createError, setCreateError] =
    useState<string | null>(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [roleId, setRoleId] =
    useState("");

  const [password, setPassword] =
    useState("");

  /*
   * ============================================================
   * EDIT
   * ============================================================
   */

  const [editOpen, setEditOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState<UserProfile | null>(null);

  const [editing, setEditing] =
    useState(false);

  const [editError, setEditError] =
    useState<string | null>(null);

  const [editName, setEditName] =
    useState("");

  const [editRoleId, setEditRoleId] =
    useState("");

  const [editActive, setEditActive] =
    useState(true);

  const [editPassword, setEditPassword] =
    useState("");

  const [passwordMode, setPasswordMode] =
    useState(false);

  /*
   * ============================================================
   * CURRENT USER / SELF CHECK
   * ============================================================
   *
   * IMPORTANTE:
   *
   * La comparación se hace contra el UUID.
   *
   * No usamos email ni nombre.
   *
   * ============================================================
   */

  const isEditingSelf =
    Boolean(
      editingUser &&
        user &&
        editingUser.id === user.id,
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

        const uniqueRoles =
          Array.from(
            new Map(
              data.map((item) => [
                item.role.id,
                item.role,
              ]),
            ).values(),
          );

        setRoles(
          uniqueRoles.sort(
            (a, b) =>
              a.id - b.id,
          ),
        );
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
   * ROUTE PROTECTION
   * ============================================================
   */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user || !user.active) {
      router.replace("/login");
      return;
    }

    if (!can("users.manage")) {
      router.replace("/dashboard");
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
   * CREATE MODAL
   * ============================================================
   */

  function openCreateModal() {
    if (!can("users.manage")) {
      return;
    }

    setCreateError(null);
    setName("");
    setEmail("");
    setRoleId("");
    setPassword("");
    setCreateOpen(true);
  }

  function closeCreateModal() {
    if (creating) {
      return;
    }

    setCreateOpen(false);
    setCreateError(null);
  }

  /*
   * ============================================================
   * EDIT MODAL
   * ============================================================
   */

  function openEditModal(
    item: UserProfile,
  ) {
    setEditingUser(item);

    setEditName(item.name);

    setEditRoleId(
      String(item.role_id),
    );

    setEditActive(item.active);

    setEditPassword("");

    setPasswordMode(false);

    setEditError(null);

    setEditOpen(true);
  }

  function closeEditModal() {
    if (editing) {
      return;
    }

    setEditOpen(false);

    setEditingUser(null);

    setEditError(null);

    setEditPassword("");

    setPasswordMode(false);
  }

  /*
   * ============================================================
   * GET SESSION TOKEN
   * ============================================================
   */

  async function getAccessToken() {
    const {
      data: { session },
      error: sessionError,
    } =
      await supabase.auth.getSession();

    if (
      sessionError ||
      !session?.access_token
    ) {
      throw new Error(
        "La sesión expiró. Volvé a iniciar sesión.",
      );
    }

    return session.access_token;
  }

  /*
   * ============================================================
   * CREATE USER
   * ============================================================
   */

  async function handleCreateUser(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (creating) {
      return;
    }

    if (!can("users.manage")) {
      setCreateError(
        "No tenés permisos para crear usuarios.",
      );

      return;
    }

    const normalizedName =
      name.trim();

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    if (!normalizedName) {
      setCreateError(
        "El nombre es obligatorio.",
      );
      return;
    }

    if (!normalizedEmail) {
      setCreateError(
        "El email es obligatorio.",
      );
      return;
    }

    if (!roleId) {
      setCreateError(
        "Seleccioná un rol.",
      );
      return;
    }

    if (
      !password ||
      password.length < 8
    ) {
      setCreateError(
        "La contraseña debe tener al menos 8 caracteres.",
      );
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);

      const token =
        await getAccessToken();

      const response =
        await fetch(
          "/api/users",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              name:
                normalizedName,

              email:
                normalizedEmail,

              roleId:
                Number(roleId),

              password,
            }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "No se pudo crear el usuario.",
        );
      }

      await loadUsers();

      closeCreateModal();
    } catch (error) {
      console.error(
        "Error creando usuario:",
        error,
      );

      setCreateError(
        error instanceof Error
          ? error.message
          : "No se pudo crear el usuario.",
      );
    } finally {
      setCreating(false);
    }
  }

  /*
   * ============================================================
   * EDIT USER
   * ============================================================
   */

  async function handleEditUser(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      editing ||
      !editingUser
    ) {
      return;
    }

    if (!can("users.manage")) {
      setEditError(
        "No tenés permisos para editar usuarios.",
      );

      return;
    }

    const normalizedName =
      editName.trim();

    if (!normalizedName) {
      setEditError(
        "El nombre es obligatorio.",
      );
      return;
    }

    if (
      passwordMode &&
      editPassword.length < 8
    ) {
      setEditError(
        "La nueva contraseña debe tener al menos 8 caracteres.",
      );
      return;
    }

    /*
     * ========================================================
     * SELF
     * ========================================================
     *
     * Si estamos editando nuestro propio usuario:
     *
     * - Nombre: permitido
     * - Contraseña: permitida
     * - Rol: NO se envía
     * - Active: NO se envía
     *
     * El backend también vuelve a validar esto.
     * ========================================================
     */

    const self =
      Boolean(
        user &&
          editingUser.id === user.id,
      );

    /*
     * ========================================================
     * BODY
     * ========================================================
     */

    const body: {
      name: string;
      roleId?: number;
      active?: boolean;
      password?: string;
    } = {
      name:
        normalizedName,
    };

    /*
     * Si NO es nuestro propio usuario,
     * mandamos rol y estado.
     */

    if (!self) {
      body.roleId =
        Number(editRoleId);

      body.active =
        editActive;
    }

    /*
     * Password
     */

    if (
      passwordMode &&
      editPassword
    ) {
      body.password =
        editPassword;
    }

    try {
      setEditing(true);
      setEditError(null);

      const token =
        await getAccessToken();

      const response =
        await fetch(
          `/api/users/${editingUser.id}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify(
              body,
            ),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "No se pudo actualizar el usuario.",
        );
      }

      await loadUsers();

      closeEditModal();
    } catch (error) {
      console.error(
        "Error editando usuario:",
        error,
      );

      setEditError(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el usuario.",
      );
    } finally {
      setEditing(false);
    }
  }

  /*
   * ============================================================
   * LOADING
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
            onClick={
              openCreateModal
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />

            Nuevo usuario
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          {loading ? (
            <div className="flex min-h-64 items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />

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
                            (part) =>
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

                          <td className="px-5 py-4 text-muted-foreground">
                            {
                              item.email
                            }
                          </td>

                          <td className="px-5 py-4">
                            <span className="inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                              {
                                item
                                  .role
                                  .name
                              }
                            </span>
                          </td>

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

                          <td className="px-5 py-4 text-muted-foreground">
                            {
                              createdAt
                            }
                          </td>

                          <td className="px-5 py-4 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  item,
                                )
                              }
                              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                            >
                              <Pencil className="h-4 w-4" />

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

      {/* ======================================================
          CREATE MODAL
          ====================================================== */}

      {createOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeCreateModal();
            }
          }}
        >
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <UserPlus className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <h2 className="font-semibold text-foreground">
                    Nuevo usuario
                  </h2>

                  <p className="text-xs text-muted-foreground">
                    Crear una nueva cuenta de acceso.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  closeCreateModal
                }
                disabled={creating}
                className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={
                handleCreateUser
              }
              className="space-y-5 p-6"
            >
              {createError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {createError}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="user-name"
                  className="text-sm font-medium"
                >
                  Nombre
                </label>

                <input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(
                    event,
                  ) =>
                    setName(
                      event.target
                        .value,
                    )
                  }
                  disabled={creating}
                  autoComplete="name"
                  placeholder="Ej. Néstor"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="user-email"
                  className="text-sm font-medium"
                >
                  Email
                </label>

                <input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(
                    event,
                  ) =>
                    setEmail(
                      event.target
                        .value,
                    )
                  }
                  disabled={creating}
                  autoComplete="email"
                  placeholder="usuario@elburgues.com"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="user-role"
                  className="text-sm font-medium"
                >
                  Rol
                </label>

                <select
                  id="user-role"
                  value={roleId}
                  onChange={(
                    event,
                  ) =>
                    setRoleId(
                      event.target
                        .value,
                    )
                  }
                  disabled={creating}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="">
                    Seleccionar rol...
                  </option>

                  {roles.map(
                    (role) => (
                      <option
                        key={
                          role.id
                        }
                        value={
                          role.id
                        }
                      >
                        {
                          role.name
                        }
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="user-password"
                  className="text-sm font-medium"
                >
                  Contraseña inicial
                </label>

                <input
                  id="user-password"
                  type="password"
                  value={password}
                  onChange={(
                    event,
                  ) =>
                    setPassword(
                      event.target
                        .value,
                    )
                  }
                  disabled={creating}
                  autoComplete="new-password"
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={
                    closeCreateModal
                  }
                  disabled={creating}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={
                    creating
                  }
                  className="inline-flex min-w-32 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      Creando...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />

                      Crear usuario
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          EDIT MODAL
          ====================================================== */}

      {editOpen &&
        editingUser && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(
              event,
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeEditModal();
              }
            }}
          >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Pencil className="h-5 w-5 text-primary" />
                  </div>

                  <div>
                    <h2 className="font-semibold text-foreground">
                      Editar usuario
                    </h2>

                    <p className="text-xs text-muted-foreground">
                      {isEditingSelf
                        ? "Editar tu perfil."
                        : "Actualizar datos y permisos."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  disabled={editing}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-50"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* FORM */}

              <form
                onSubmit={
                  handleEditUser
                }
                className="space-y-5 p-6"
              >
                {editError && (
                  <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {editError}
                  </div>
                )}

                {/* NOMBRE */}

                <div className="space-y-2">
                  <label
                    htmlFor="edit-name"
                    className="text-sm font-medium"
                  >
                    Nombre
                  </label>

                  <input
                    id="edit-name"
                    type="text"
                    value={
                      editName
                    }
                    onChange={(
                      event,
                    ) =>
                      setEditName(
                        event.target
                          .value,
                      )
                    }
                    disabled={
                      editing
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                {/* EMAIL */}

                <div className="space-y-2">
                  <label
                    htmlFor="edit-email"
                    className="text-sm font-medium"
                  >
                    Email
                  </label>

                  <input
                    id="edit-email"
                    type="email"
                    value={
                      editingUser.email
                    }
                    disabled
                    className="w-full cursor-not-allowed rounded-lg border border-border bg-muted px-3 py-2.5 text-sm text-muted-foreground"
                  />

                  <p className="text-xs text-muted-foreground">
                    El email no se puede modificar desde esta pantalla.
                  </p>
                </div>

                {/* ROL */}

                {isEditingSelf ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Rol
                    </label>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-3 py-2.5">
                      <span className="text-sm text-muted-foreground">
                        {editingUser.role.name}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        🔒 Bloqueado
                      </span>
                    </div>

                    <p className="text-xs text-amber-600">
                      Tu rol de Administrador no puede modificarse.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="edit-role"
                      className="text-sm font-medium"
                    >
                      Rol
                    </label>

                    <select
                      id="edit-role"
                      value={
                        editRoleId
                      }
                      onChange={(
                        event,
                      ) =>
                        setEditRoleId(
                          event.target
                            .value,
                        )
                      }
                      disabled={
                        editing
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary disabled:cursor-not-allowed disabled:bg-muted"
                    >
                      {roles.map(
                        (role) => (
                          <option
                            key={
                              role.id
                            }
                            value={
                              role.id
                            }
                          >
                            {
                              role.name
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                )}

                {/* ESTADO */}

                {isEditingSelf ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Estado
                    </label>

                    <div className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                        <span className="text-sm">
                          Activo
                        </span>
                      </div>

                      <span className="text-xs text-muted-foreground">
                        🔒 Bloqueado
                      </span>
                    </div>

                    <p className="text-xs text-amber-600">
                      Tu propia cuenta no puede desactivarse.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Estado
                    </label>

                    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border px-4 py-3">
                      <input
                        id="edit-active"
                        type="checkbox"
                        checked={
                          editActive
                        }
                        onChange={(
                          event,
                        ) =>
                          setEditActive(
                            event
                              .target
                              .checked,
                          )
                        }
                        disabled={
                          editing
                        }
                        className="h-4 w-4"
                      />

                      <span className="text-sm">
                        Usuario activo
                      </span>
                    </label>
                  </div>
                )}

                {/* PASSWORD */}

                <div className="rounded-lg border border-border">
                  <button
                    type="button"
                    onClick={() =>
                      setPasswordMode(
                        (
                          current,
                        ) =>
                          !current,
                      )
                    }
                    disabled={
                      editing
                    }
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium hover:bg-secondary"
                  >
                    <KeyRound className="h-4 w-4" />

                    Cambiar contraseña

                    <span className="ml-auto text-xs text-muted-foreground">
                      {passwordMode
                        ? "Ocultar"
                        : "Mostrar"}
                    </span>
                  </button>

                  {passwordMode && (
                    <div className="border-t border-border p-4">
                      <input
                        type="password"
                        value={
                          editPassword
                        }
                        onChange={(
                          event,
                        ) =>
                          setEditPassword(
                            event.target
                              .value,
                          )
                        }
                        disabled={
                          editing
                        }
                        autoComplete="new-password"
                        minLength={8}
                        placeholder="Nueva contraseña, mínimo 8 caracteres"
                        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
                      />
                    </div>
                  )}
                </div>

                {/* ACTIONS */}

                <div className="flex justify-end gap-3 border-t border-border pt-5">
                  <button
                    type="button"
                    onClick={
                      closeEditModal
                    }
                    disabled={
                      editing
                    }
                    className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-secondary disabled:opacity-50"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={
                      editing
                    }
                    className="inline-flex min-w-32 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
                  >
                    {editing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Guardando...
                      </>
                    ) : (
                      "Guardar cambios"
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}
    </div>
  );
}