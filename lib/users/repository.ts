import { supabase } from "@/lib/supabase/client";

import type {
  UserProfile,
} from "./types";

/*
 * ============================================================
 * GET USERS
 * ============================================================
 */

export async function getUsers(): Promise<
  UserProfile[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("profiles")
    .select(
      `
        id,
        email,
        name,
        role_id,
        active,
        created_at,
        updated_at,
        role:roles (
          id,
          code,
          name
        )
      `,
    )
    .order(
      "name",
      {
        ascending: true,
      },
    );

  if (error) {
    console.error(
      "Error obteniendo usuarios:",
      error,
    );

    throw new Error(
      "No se pudieron obtener los usuarios.",
    );
  }

  if (!data) {
    return [];
  }

  return data.map(
    (user) => ({
      ...user,

      role: Array.isArray(
        user.role,
      )
        ? user.role[0]
        : user.role,
    }),
  ) as UserProfile[];
}