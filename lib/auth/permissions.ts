import type { CurrentUser } from "./types";

export function can(
  user: CurrentUser | null,
  permission: string,
): boolean {
  if (!user) {
    return false;
  }

  if (!user.active) {
    return false;
  }

  /*
   * ADMIN tiene acceso total.
   */

  if (user.role === "ADMIN") {
    return true;
  }

  return user.permissions.includes(
    permission,
  );
}