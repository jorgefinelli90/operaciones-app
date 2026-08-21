"use client";

import {
  Bell,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useAuth } from "@/lib/auth/AuthContext";

export function TopBar() {
  /*
   * ============================================================
   * AUTH
   * ============================================================
   *
   * El usuario ya viene del AuthContext.
   *
   * NO hacemos getCurrentUser() acá.
   * NO hacemos otra consulta a Supabase.
   */

  const {
    user,
    loading,
    signOut,
  } = useAuth();

  /*
   * ============================================================
   * MENU
   * ============================================================
   */

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  /*
   * ============================================================
   * CERRAR MENU AL HACER CLICK AFUERA
   * ============================================================
   */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node,
        )
      ) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener(
        "mousedown",
        handleClickOutside,
      );
    }

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [menuOpen]);

  /*
   * ============================================================
   * ESC PARA CERRAR
   * ============================================================
   */

  useEffect(() => {
    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener(
        "keydown",
        handleKeyDown,
      );
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [menuOpen]);

  /*
   * ============================================================
   * LOGOUT
   * ============================================================
   */

  async function handleSignOut() {
    if (loggingOut) {
      return;
    }

    try {
      setLoggingOut(true);
      setMenuOpen(false);

      await signOut();
    } catch (error) {
      console.error(
        "Error cerrando sesión:",
        error,
      );

      setLoggingOut(false);
    }
  }

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <header className="fixed top-0 right-0 left-64 z-40 border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex w-full items-center justify-end px-6 py-3">
          <div className="h-10 w-32 animate-pulse rounded-lg bg-secondary" />
        </div>
      </header>
    );
  }

  /*
   * ============================================================
   * DATOS DEL USUARIO
   * ============================================================
   */

  const displayName =
    user?.name ||
    user?.email ||
    "Usuario";

  const email =
    user?.email || "";

  /*
   * ============================================================
   * INICIALES
   * ============================================================
   */

  const initials =
    user?.name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) =>
        part.charAt(0).toUpperCase(),
      )
      .join("") ||
    user?.email
      ?.charAt(0)
      .toUpperCase() ||
    "U";

  /*
   * ============================================================
   * LABEL DEL ROL
   * ============================================================
   */

  const roleLabel =
    user?.role === "ADMIN"
      ? "Administrador"
      : user?.role === "DEPOT"
        ? "Depósito"
        : user?.role ===
            "CUSTOMER_SERVICE"
          ? "Atención al cliente"
          : user?.role ===
              "ADMINISTRATION"
            ? "Administración"
            : "Usuario";

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <header className="fixed top-0 right-0 left-64 z-40 border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="flex w-full items-center justify-end px-6 py-3">
        <div className="flex items-center gap-3">
          {/* ==================================================
              NOTIFICACIONES
              ================================================== */}

          <button
            type="button"
            aria-label="Notificaciones"
            className="relative rounded-lg p-2 transition-colors hover:bg-secondary"
          >
            <Bell className="h-5 w-5 text-foreground" />

            {/* Badge temporal.
                Después lo conectamos con notifications. */}

            <span
              aria-hidden="true"
              className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"
            />
          </button>

          {/* ==================================================
              USER MENU
              ================================================== */}

          <div
            ref={menuRef}
            className="relative"
          >
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() =>
                setMenuOpen(
                  (open) => !open,
                )
              }
              className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 transition-colors hover:bg-secondary"
            >
              {/* AVATAR */}

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </div>

              {/* USER INFO */}

              <div className="hidden text-left sm:block">
                <div className="max-w-40 truncate text-sm font-medium text-foreground">
                  {displayName}
                </div>

                <div className="text-[11px] text-muted-foreground">
                  {roleLabel}
                </div>
              </div>

              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform ${
                  menuOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* ==================================================
                DROPDOWN
                ================================================== */}

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
              >
                {/* USER HEADER */}

                <div className="border-b border-border px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* AVATAR GRANDE */}

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {initials}
                    </div>

                    {/* DATOS */}

                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {displayName}
                      </div>

                      <div className="truncate text-xs text-muted-foreground">
                        {email}
                      </div>

                      <div className="mt-0.5 text-xs text-muted-foreground">
                        {roleLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="p-1">
                  {/* PERFIL */}

                  <button
                    type="button"
                    role="menuitem"
                    disabled
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-muted-foreground opacity-60"
                  >
                    <User className="h-4 w-4" />

                    <span>
                      Mi perfil
                    </span>

                    <span className="ml-auto text-[10px]">
                      Próximamente
                    </span>
                  </button>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    role="menuitem"
                    onClick={
                      handleSignOut
                    }
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LogOut className="h-4 w-4" />

                    <span>
                      {loggingOut
                        ? "Cerrando sesión..."
                        : "Cerrar sesión"}
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}