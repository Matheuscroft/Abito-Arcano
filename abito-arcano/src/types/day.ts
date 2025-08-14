import type { TarefaResponseDTO, CompletedTaskResponseDTO } from "./task";

export interface DayDetailResponseDTO {
  id: string;
  date: string; // ou Date se você converter do backend
  dayOfWeek: number;
  current: boolean;
  tarefasPrevistas: TarefaResponseDTO[];
  completedTasks: CompletedTaskResponseDTO[];
}

export interface DayResponseDTO {
  id: string;
  date: string; // ou Date se converter
  dayOfWeek: number;
  current: boolean;
}

export interface DayDTO {
  date: string; // ou Date se preferir
}