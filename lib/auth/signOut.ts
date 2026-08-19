import { supabase } from "@/lib/supabase/client";

export async function signOut() {
  const {
    error,
  } = await supabase.auth.signOut();

  if (error) {
    console.error(
      "Error cerrando sesión:",
      error,
    );

    throw error;
  }

  window.location.href =
    "/login";
}