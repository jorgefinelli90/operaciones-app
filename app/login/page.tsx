"use client";

import {
  FormEvent,
  useState,
} from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
} from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export default function LoginPage() {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    const cleanEmail =
      email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        "Ingresá tu email y contraseña.",
      );

      return;
    }

    try {
      setLoading(true);

      /*
       * ========================================================
       * 1. LOGIN SUPABASE AUTH
       * ========================================================
       */

      const {
        error: loginError,
      } = await supabase.auth.signInWithPassword(
        {
          email: cleanEmail,
          password,
        },
      );

      if (loginError) {
        console.error(
          "Error de login:",
          loginError,
        );

        setError(
          "Email o contraseña incorrectos.",
        );

        return;
      }

      /*
       * ========================================================
       * 2. OBTENER PERFIL BURGUES
       * ========================================================
       */

      const user =
        await getCurrentUser();

      /*
       * Auth existe pero no hay profile.
       */

      if (!user) {
        await supabase.auth.signOut();

        setError(
          "Tu usuario no está configurado correctamente. Contactá al administrador.",
        );

        return;
      }

      /*
       * ========================================================
       * 3. USUARIO DESACTIVADO
       * ========================================================
       */

      if (!user.active) {
        await supabase.auth.signOut();

        setError(
          "Tu usuario está desactivado. Contactá al administrador.",
        );

        return;
      }

      /*
       * ========================================================
       * 4. LOGIN CORRECTO
       * ========================================================
       */

      window.location.href =
        "/dashboard";
    } catch (error) {
      console.error(
        "Error inesperado durante el login:",
        error,
      );

      setError(
        "Ocurrió un error al iniciar sesión. Intentá nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        {/* LOGO / MARCA */}

        <div className="mb-8 text-center">
          <div className="mb-3 text-3xl font-semibold tracking-[0.25em] text-foreground">
            BURGUES
          </div>

          <p className="text-sm text-muted-foreground">
            Operaciones
          </p>
        </div>

        {/* CARD */}

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-foreground">
              Iniciar sesión
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Ingresá con tu cuenta de BURGUES.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* EMAIL */}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                disabled={loading}
                placeholder="nombre@elburgues.com"
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* PASSWORD */}

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Contraseña
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value,
                    )
                  }
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-input px-3 py-2.5 pr-11 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (value) =>
                        !value,
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Ocultar contraseña"
                      : "Mostrar contraseña"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            {/* BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Ingresar
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          BURGUES · Sistema de Operaciones
        </p>
      </div>
    </main>
  );
}