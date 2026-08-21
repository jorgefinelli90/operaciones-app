"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

import { getActiveUsersByRole } from "@/lib/users/repository";
import type {
  UserProfile,
  UserRole,
} from "@/lib/users/types";

interface AssigneeSelectProps {
  value: string;
  onChange: (userId: string) => void;
  role: UserRole["code"];
  loading?: boolean;
  required?: boolean;
  label?: string;
}

export function AssigneeSelect({
  value,
  onChange,
  role,
  loading = false,
  required = true,
  label = "Responsable",
}: AssigneeSelectProps) {
  const [users, setUsers] = useState<
    UserProfile[]
  >([]);

  const [loadingUsers, setLoadingUsers] =
    useState(true);

  const [open, setOpen] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoadingUsers(true);
      setError(null);

      try {
        const data =
          await getActiveUsersByRole(role);

        if (cancelled) {
          return;
        }

        setUsers(data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Error cargando responsables:",
          error,
        );

        setError(
          "No se pudieron cargar los responsables.",
        );
      } finally {
        if (!cancelled) {
          setLoadingUsers(false);
        }
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, [role]);

  const selectedUser =
    users.find(
      (user) => user.id === value,
    ) ?? null;

  const disabled =
    loading ||
    loadingUsers ||
    !!error;

  return (
    <div className="relative">
      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}

        {required && (
          <span className="ml-1 text-destructive">
            *
          </span>
        )}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() =>
          setOpen(
            (current) => !current,
          )
        }
        className="flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5 text-left text-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span
          className={
            selectedUser
              ? "text-foreground"
              : "text-muted-foreground"
          }
        >
          {loadingUsers
            ? "Cargando responsables..."
            : error
              ? "No disponibles"
              : selectedUser
                ? selectedUser.name
                : "Seleccionar responsable"}
        </span>

        <ChevronDown
          size={16}
          className={`transition-transform ${
            open
              ? "rotate-180"
              : ""
          }`}
        />
      </button>

      {open &&
        !disabled && (
          <div className="absolute left-0 right-0 top-full z-[100] mt-1 max-h-60 overflow-y-auto overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
            {users.length === 0 ? (
              <div className="px-3 py-3 text-sm text-muted-foreground">
                No hay usuarios disponibles.
              </div>
            ) : (
              users.map(
                (user) => {
                  const isSelected =
                    user.id === value;

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => {
                        onChange(
                          user.id,
                        );
                        setOpen(false);
                      }}
                      className={`block w-full px-3 py-2.5 text-left text-sm transition hover:bg-muted ${
                        isSelected
                          ? "bg-muted font-medium"
                          : ""
                      }`}
                    >
                      <div>
                        {user.name}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {user.email}
                      </div>
                    </button>
                  );
                },
              )
            )}
          </div>
        )}

      {error && (
        <p className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}