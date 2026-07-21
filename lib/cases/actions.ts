import type { CaseAction } from "./types";

export interface ActionDefinition {
  id: CaseAction;
  title: string;
  description: string;
  icon: string;
  confirm: boolean;
  modal: string | null;
}