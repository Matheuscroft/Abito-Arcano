import type { TarefaResponseDTO, CompletedTaskResponseDTO } from "./task";

export interface DayDetailResponseDTO {
  id: string;
  date: string; 
  dayOfWeek: number;
  current: boolean;
  tarefasPrevistas: TarefaResponseDTO[];
  completedTasks: CompletedTaskResponseDTO[];
}

export interface DayResponseDTO {
  id: string;
  date: string;
  dayOfWeek: number;
  current: boolean;
}

export interface DayDTO {
  date: string;
}