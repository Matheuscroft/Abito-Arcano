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
  type: string;
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
  completedAt: string; // ou Date, dependendo de como você manipula datas
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
