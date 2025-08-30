import type { ItemType } from "./item";
import type { ScoreResponseDTO } from "./score";

export interface TarefaDTO {
  title: string;
  score: number;
  type: string;
  daysOfTheWeek: number[];
  areaId: string;
  subareaId?: string | null;
}

export interface TarefaResponseDTO {
  id: string;
  title: string;
  score: number;
  type: string;
  daysOfTheWeek: number[];
  areaId: string;
  subareaId?: string | null;
  createdAt: string;
  originalTaskId?: string | null;
  isLatestVersion: boolean;
}

export interface CompletedTaskResponseDTO {
  id: string;
  tarefaId: string;
  title: string;
  createdAt: string;
  completedAt: string;
  score: number;
  areaId: string;
  subareaId?: string | null;
  type: ItemType;
  daysOfTheWeek: number[];
  isLatestVersion: boolean;
  originalTaskId?: string | null;
}

export interface CheckTarefaResponseDTO {
  completedTask: CompletedTaskResponseDTO;
  score: ScoreResponseDTO;
}

export interface CompletedTaskWithScoreDTO {
  completedTaskId: string;
  tarefaId: string;
  completedAt: string;
  scoreId: string;
  areaId: string;
  areaName: string;
  subareaId?: string | null;
  subareaName?: string | null;
  date: string; // ou Date
  score: number;
}

export interface UncheckTarefaResponseDTO {
  previouslyCompletedTask: CompletedTaskResponseDTO;
  score: ScoreResponseDTO;
}

export enum TipoItem {
  Task = "task",
  Checklist = "checklist",
  Text = "text",
  List = "list",
  Activity = "activity",
}

export interface ChecklistItem {
  id: string;
  nome: string;
  finalizada: boolean;
  type: "checklist";
}

export interface TextItem {
  id: string;
  nome: string;
  type: "text";
}

export interface AtividadeTemp {
  id?: string;
  nome: string;
  finalizada: boolean;
  areaId?: string;
  subarea?: string;
  numero?: number;
  type: string;
}

export type GenericItem =
  | TarefaResponseDTO
  | CompletedTaskResponseDTO
  | ChecklistItem
  | TextItem
  | AtividadeTemp
  | {
      id: string;
      type: TipoItem;
      [key: string]: any;
    };

export interface ListItem {
  nome: string;
  tipo: TipoItem;
  id?: number;
  title?: string;
  type?: string;
}
