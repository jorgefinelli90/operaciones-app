export type UserRole =
  | "DEPOT"
  | "CUSTOMER_SERVICE"
  | "ADMINISTRATION"
  | "ADMIN";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  active: boolean;
  permissions: string[];
}