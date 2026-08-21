import { supabase } from "@/lib/supabase/client";

import type {
  AssignTaskInput,
  CreateTaskInput,
  Task,
  TaskStatus,
  UpdateTaskStatusInput,
} from "./types";

/*
 * ============================================================
 * CREATE TASK
 * ============================================================
 */

export async function createTask(
  input: CreateTaskInput,
): Promise<Task> {
  const {
    data: {
      user,
    },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error(
      "No hay un usuario autenticado.",
    );
  }

  const {
    data,
    error,
  } = await supabase
    .from("order_case_tasks")
    .insert({
      case_id: input.caseId,

      type: input.type,

      title: input.title,

      description:
        input.description ??
        null,

      priority:
        input.priority ??
        "NORMAL",

      assigned_to:
        input.assignedTo ??
        null,

      created_by:
        user.id,

      source_event_id:
        input.sourceEventId ??
        null,

      due_at:
        input.dueAt ??
        null,
    })
    .select("*")
    .single();

  if (error) {
    console.error(
      "Error creando tarea:",
      error,
    );

    throw new Error(
      error.message ||
        "No se pudo crear la tarea.",
    );
  }

  return data as Task;
}

/*
 * ============================================================
 * GET TASK
 * ============================================================
 */

export async function getTask(
  taskId: number,
): Promise<Task> {
  const {
    data,
    error,
  } = await supabase
    .from("order_case_tasks")
    .select("*")
    .eq("id", taskId)
    .single();

  if (error || !data) {
    throw new Error(
      error?.message ||
        "No se encontró la tarea.",
    );
  }

  return data as Task;
}

/*
 * ============================================================
 * GET TASKS BY CASE
 * ============================================================
 */

export async function getTasksByCase(
  caseId: number,
): Promise<Task[]> {
  const {
    data,
    error,
  } = await supabase
    .from("order_case_tasks")
    .select("*")
    .eq("case_id", caseId)
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Error obteniendo tareas del caso:",
      error,
    );

    throw new Error(
      error.message ||
        "No se pudieron obtener las tareas.",
    );
  }

  return (data ?? []) as Task[];
}

/*
 * ============================================================
 * GET TASKS BY USER
 * ============================================================
 */

export async function getTasksByUser(
  userId: string,
  options?: {
    status?: TaskStatus;
  },
): Promise<Task[]> {
  let query = supabase
    .from("order_case_tasks")
    .select("*")
    .eq("assigned_to", userId)
    .order("created_at", {
      ascending: false,
    });

  if (options?.status) {
    query = query.eq(
      "status",
      options.status,
    );
  }

  const {
    data,
    error,
  } = await query;

  if (error) {
    console.error(
      "Error obteniendo tareas del usuario:",
      error,
    );

    throw new Error(
      error.message ||
        "No se pudieron obtener las tareas.",
    );
  }

  return (data ?? []) as Task[];
}

/*
 * ============================================================
 * GET PENDING TASKS
 * ============================================================
 */

export async function getPendingTasks(
  userId: string,
): Promise<Task[]> {
  return getTasksByUser(
    userId,
    {
      status: "PENDING",
    },
  );
}

/*
 * ============================================================
 * UPDATE TASK STATUS
 * ============================================================
 *
 * Las transiciones válidas se controlan acá.
 *
 * PENDING
 *   → IN_PROGRESS
 *   → BLOCKED
 *   → CANCELLED
 *
 * IN_PROGRESS
 *   → COMPLETED
 *   → BLOCKED
 *   → CANCELLED
 *
 * BLOCKED
 *   → IN_PROGRESS
 *   → CANCELLED
 *
 * COMPLETED
 *   → ninguna
 *
 * CANCELLED
 *   → ninguna
 *
 * ============================================================
 */

function canTransitionTask(
  from: TaskStatus,
  to: TaskStatus,
): boolean {
  if (from === to) {
    return true;
  }

  switch (from) {
    case "PENDING":
      return (
        to === "IN_PROGRESS" ||
        to === "BLOCKED" ||
        to === "CANCELLED"
      );

    case "IN_PROGRESS":
      return (
        to === "COMPLETED" ||
        to === "BLOCKED" ||
        to === "CANCELLED"
      );

    case "BLOCKED":
      return (
        to === "IN_PROGRESS" ||
        to === "CANCELLED"
      );

    case "COMPLETED":
      return false;

    case "CANCELLED":
      return false;

    default:
      return false;
  }
}

export async function updateTaskStatus({
  taskId,
  status,
}: UpdateTaskStatusInput): Promise<Task> {
  const current =
    await getTask(taskId);

  if (
    !canTransitionTask(
      current.status,
      status,
    )
  ) {
    throw new Error(
      `No se puede cambiar una tarea de ${current.status} a ${status}.`,
    );
  }

  const update: {
    status: TaskStatus;
    completed_at?: string | null;
    cancelled_at?: string | null;
  } = {
    status,
  };

  if (status === "COMPLETED") {
    update.completed_at =
      new Date().toISOString();
  } else if (
    current.status === "COMPLETED"
  ) {
    update.completed_at = null;
  }

  if (status === "CANCELLED") {
    update.cancelled_at =
      new Date().toISOString();
  } else if (
    current.status === "CANCELLED"
  ) {
    update.cancelled_at = null;
  }

  const {
    data,
    error,
  } = await supabase
    .from("order_case_tasks")
    .update(update)
    .eq("id", taskId)
    .select("*")
    .single();

  if (error || !data) {
    console.error(
      "Error actualizando estado de tarea:",
      error,
    );

    throw new Error(
      error?.message ||
        "No se pudo actualizar la tarea.",
    );
  }

  return data as Task;
}

/*
 * ============================================================
 * ASSIGN TASK
 * ============================================================
 */

export async function assignTask({
  taskId,
  assignedTo,
}: AssignTaskInput): Promise<Task> {
  const {
    data,
    error,
  } = await supabase
    .from("order_case_tasks")
    .update({
      assigned_to:
        assignedTo,
    })
    .eq("id", taskId)
    .select("*")
    .single();

  if (error || !data) {
    console.error(
      "Error asignando tarea:",
      error,
    );

    throw new Error(
      error?.message ||
        "No se pudo asignar la tarea.",
    );
  }

  return data as Task;
}