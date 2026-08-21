export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "COMPLETED"
  | "CANCELLED";

export type TaskPriority =
  | "URGENT"
  | "HIGH"
  | "NORMAL"
  | "LOW";

export type TaskType =
  | "REQUEST_STOCK"
  | "RESERVE_PRODUCT"
  | "SHIP_PRODUCT"
  | "OFFER_ALTERNATIVE"
  | "LOAD_INVOICE"
  | "LOAD_CREDIT_NOTE";

export interface Task {
  id: number;

  case_id: number;

  type: TaskType;

  title: string;

  description: string | null;

  status: TaskStatus;

  priority: TaskPriority;

  assigned_to: string | null;

  created_by: string | null;

  source_event_id: number | null;

  due_at: string | null;

  completed_at: string | null;

  cancelled_at: string | null;

  created_at: string;

  updated_at: string;
}

export interface CreateTaskInput {
  caseId: number;

  type: TaskType;

  title: string;

  description?: string | null;

  priority?: TaskPriority;

  assignedTo?: string | null;

  sourceEventId?: number | null;

  dueAt?: string | null;
}

export interface UpdateTaskStatusInput {
  taskId: number;

  status: TaskStatus;
}

export interface AssignTaskInput {
  taskId: number;

  assignedTo: string | null;
}