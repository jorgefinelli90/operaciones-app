import { supabase } from "@/lib/supabase/client";
import type {
  CurrentUser,
  UserRole,
} from "./types";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  /*
   * ============================================================
   * 1. OBTENER SESIÓN
   *
   * Si no existe sesión:
   *
   * session === null
   *
   * Esto es un estado normal, no un error.
   * ============================================================
   */

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    console.error(
      "Error obteniendo sesión:",
      sessionError,
    );

    return null;
  }

  if (!session?.user) {
    return null;
  }

  const authUser =
    session.user;

  /*
   * ============================================================
   * 2. OBTENER PERFIL + ROL
   * ============================================================
   */

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from("profiles")
    .select(
      `
        id,
        email,
        name,
        active,
        role_id,
        roles (
          code
        )
      `,
    )
    .eq("id", authUser.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Error obteniendo perfil:",
      profileError,
    );

    return null;
  }

  /*
   * Auth existe pero no existe profile.
   */

  if (!profile) {
    console.error(
      `El usuario ${authUser.email ?? authUser.id} no tiene un perfil en profiles.`,
    );

    return null;
  }

  /*
   * ============================================================
   * 3. OBTENER ROL
   * ============================================================
   */

  const roleData =
    Array.isArray(profile.roles)
      ? profile.roles[0]
      : profile.roles;

  const role =
    roleData?.code as
      | UserRole
      | undefined;

  if (!role) {
    console.error(
      `El usuario ${profile.email} no tiene un rol válido.`,
    );

    return null;
  }

  /*
   * ============================================================
   * 4. USUARIO DESACTIVADO
   * ============================================================
   */

  if (!profile.active) {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role,
      active: false,
      permissions: [],
    };
  }

  /*
   * ============================================================
   * 5. ADMIN
   *
   * ADMIN tiene bypass total.
   *
   * No necesitamos consultar permissions.
   * ============================================================
   */

  if (role === "ADMIN") {
    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role,
      active: true,
      permissions: [],
    };
  }

  /*
   * ============================================================
   * 6. PERMISOS DEL ROL
   * ============================================================
   */

  const {
    data: rolePermissions,
    error: permissionsError,
  } = await supabase
    .from("role_permissions")
    .select(
      `
        permissions (
          code
        )
      `,
    )
    .eq(
      "role_id",
      profile.role_id,
    );

  if (permissionsError) {
    console.error(
      "Error obteniendo permisos:",
      permissionsError,
    );

    return null;
  }

  /*
   * ============================================================
   * 7. NORMALIZAR PERMISOS
   * ============================================================
   */

  const permissions =
    rolePermissions
      ?.map((item) => {
        const permission =
          Array.isArray(
            item.permissions,
          )
            ? item.permissions[0]
            : item.permissions;

        return permission?.code ?? null;
      })
      .filter(
        (
          permission,
        ): permission is string =>
          permission !== null,
      ) ?? [];

  /*
   * ============================================================
   * 8. RESULTADO
   * ============================================================
   */

  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role,
    active: true,
    permissions,
  };
}