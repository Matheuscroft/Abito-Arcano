export interface AreaDTO {
  name: string;
  color: string;
}

export interface SubareaDTO {
  name: string;
  areaId: string;
}

export interface SubareaSimpleResponseDTO {
  id: string;
  name: string;
}

export interface SubareaResponseDTO {
  id: string;
  name: string;
  areaId: string;
}

export interface AreaResponseDTO {
  id: string;
  name: string;
  color: string;
  subareas: SubareaSimpleResponseDTO[];
}
