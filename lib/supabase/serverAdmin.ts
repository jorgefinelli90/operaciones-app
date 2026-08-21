import {
  createClient,
} from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Falta NEXT_PUBLIC_SUPABASE_URL.",
  );
}

if (!serviceRoleKey) {
  throw new Error(
    "Falta SUPABASE_SERVICE_ROLE_KEY.",
  );
}

/*
 * ============================================================
 * ADMIN CLIENT
 * ============================================================
 *
 * IMPORTANTE:
 *
 * Este cliente usa service_role.
 *
 * NUNCA debe importarse desde:
 * - componentes Client
 * - hooks
 * - navegador
 * - código con "use client"
 *
 * Solo Server/API.
 */

export const supabaseAdmin =
  createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );