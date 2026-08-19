import { supabase } from "@/lib/supabase/client";
import type { CurrentUser, UserRole } from "./types";

export async function getCurrentUser(): Promise<CurrentUser | null> {
  // 1. Obtener usuario autenticado
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error(
      "Error obteniendo usuario autenticado:",
      authError,
    );

    return null;
  }

  if (!user) {
    return null;
  }

  // 2. Obtener perfil + rol
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
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error(
      "Error obteniendo perfil:",
      profileError,
    );

    return null;
  }

  if (!profile) {
    console.error(
      "El usuario autenticado no tiene un perfil.",
    );

    return null;
  }

  // 3. Obtener código del rol
  const roleData = Array.isArray(profile.roles)
    ? profile.roles[0]
    : profile.roles;

  const role = roleData?.code as UserRole | undefined;

  if (!role) {
    console.error(
      "El perfil no tiene un rol válido.",
    );

    return null;
  }

  // 4. Usuario desactivado
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

  // 5. Obtener permisos del rol
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
    .eq("role_id", profile.role_id);

  if (permissionsError) {
    console.error(
      "Error obteniendo permisos:",
      permissionsError,
    );

    return null;
  }

  // 6. Convertir permisos a string[]
  const permissions =
    rolePermissions
      ?.map((item) => {
        const permission = Array.isArray(
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

  // 7. ADMIN tiene todos los permisos
  if (role === "ADMIN") {
    const {
      data: allPermissions,
      error: allPermissionsError,
    } = await supabase
      .from("permissions")
      .select("code");

    if (allPermissionsError) {
      console.error(
        "Error obteniendo permisos de ADMIN:",
        allPermissionsError,
      );

      return null;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role,
      active: true,
      permissions:
        allPermissions?.map(
          (permission) => permission.code,
        ) ?? [],
    };
  }

  // 8. Usuario normal
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    role,
    active: true,
    permissions,
  };
}