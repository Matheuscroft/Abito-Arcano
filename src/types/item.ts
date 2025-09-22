//item.ts

/*export interface ItemResponse {
  id: string;
  title: string;
  score: number;
  type: ItemType;
  daysOfTheWeek: number[];
  areaId: string | null;
  subareaId: string | null;
  items: ItemResponse[];
  createdAt: string;
  originalItemId: string | null;
  isLatestVersion: boolean;
}*/

//export type AtividadeType = Omit<ItemResponse, "daysOfTheWeek">;

export enum ItemType {
  TASK = "TASK",
  ACTIVITY = "ACTIVITY",
  TEXT = "TEXT",
  CHECKLIST = "CHECKLIST",
  LIST = "LIST"
}


export interface TaskItem {
  id: string;
  type: ItemType.TASK;
  title: string;
  score: number;
  areaId: string | null;
  subareaId: string | null;
  createdAt: string;
  daysOfTheWeek: number[];
  originalItemId: string | null;
  isLatestVersion: boolean;
}

export interface ActivityItem {
  id: string;
  type: ItemType.ACTIVITY;
  title: string;
  score: number;
  areaId: string | null;
  subareaId: string | null;
  createdAt: string;
  originalItemId: string | null;
  isLatestVersion: boolean;
}

export interface TextItem {
  id: string;
  type: ItemType.TEXT;
  title: string;
  createdAt: string;
  daysOfTheWeek: number[];
  originalItemId: string | null;
  isLatestVersion: boolean;
}

export interface ChecklistItem {
  id: string;
  type: ItemType.CHECKLIST;
  title: string;
  createdAt: string;
  daysOfTheWeek: number[];
  originalItemId: string | null;
  isLatestVersion: boolean;
}

export interface ListItem {
  id: string;
  type: ItemType.LIST;
  title: string;
  items: ItemResponse[];
  score: number;
  areaId: string | null;
  subareaId: string | null;
  createdAt: string;
  daysOfTheWeek: number[];
  originalItemId: string | null;
  isLatestVersion: boolean;
}

export type ItemResponse =
  | ActivityItem
  | TextItem
  | ChecklistItem
  | TaskItem
  | ListItem;

export interface ItemCreateDTO {
  title: string;
  score: number;
  type: ItemType;
  daysOfTheWeek: number[];
  areaId: string | null;
  subareaId: string | null;
}