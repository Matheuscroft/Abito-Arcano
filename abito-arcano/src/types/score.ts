export interface ScoreResponseDTO {
  scoreId: string;
  areaId: string;
  areaName: string;
  subareaId?: string | null;
  subareaName?: string | null;
  date: string; // ou Date se você converter ao receber do backend
  score: number;
}

export interface ScoreDTO {
  tarefaId: string;
  dayId: string;
}
