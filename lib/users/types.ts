export interface UserRole {
  id: number;
  code:
    | "DEPOT"
    | "CUSTOMER_SERVICE"
    | "ADMINISTRATION"
    | "ADMIN";
  name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role_id: number;
  active: boolean;
  created_at: string;
  updated_at: string;

  role: UserRole;
}