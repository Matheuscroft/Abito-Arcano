import React, { type Dispatch, type SetStateAction } from "react";
import FormItemLista from "../componentes/forms/FormItemLista/FormItemLista";
import ListaAninhada from "./ListaAninhada";
import Tarefa from "../pages/ToDoList/Tarefa";
import type { CompletedTaskResponseDTO, TarefaResponseDTO } from "@/types/task";
import type { AreaResponseDTO } from "@/types/area";
import { Box, Flex } from "@chakra-ui/react";
import type { DayResponseDTO } from "@/types/day";
import CheckboxItemLista from "./CheckboxItemLista";
import ParagrafoItemLista from "./ParagrafoItemLista";
import Atividade from "../Atividade";
import type { ActivityItem, ChecklistItem, ItemResponse, ListItem, TextItem } from "@/types/item";

interface ItemListaProps<T = ItemResponse | CompletedTaskResponseDTO> {
  listas: any[];
  user: any;
  item: T;
  lista: T[] | { itens?: T[] };
  onEdit: (path?: (number | string)[]) => void;
  onDelete: () => void;
  onToggle?: (item: T) => void;
  onSave?: (item: T) => void;
  onMove: (item: T, direction: number) => void;
  index: number;
  setListasLocal?: Dispatch<SetStateAction<any[]>>;
  updateListas?: (...args: any[]) => void;
  path?: (number | string)[];
  areas: AreaResponseDTO[];
  isTarefas?: boolean | null;
  setItems?: Dispatch<SetStateAction<T[]>>;
  dias?: DayResponseDTO[] | null;
  setDias?: Dispatch<SetStateAction<DayResponseDTO[]>>;
  diaVisualizado?: any;
  setPontuacoes?: (...args: any[]) => void;
  isAninhado?: boolean;
}

const ItemLista = <T extends ItemResponse | CompletedTaskResponseDTO>(
  props: ItemListaProps<T>
) => {
  const {
    listas,
    user,
    item,
    onEdit,
    lista,
    onDelete,
    onToggle,
    onSave,
    onMove,
    index,
    setListasLocal,
    updateListas,
    path = [],
    areas,
    isTarefas = null,
    setItems = null,
    dias = null,
    setDias = null,
    diaVisualizado = null,
    setPontuacoes,
    isAninhado = false,
  } = props;

  const newPath = [...path, index];

  return (
    <Flex
      justify="space-between"
      align="center"
      width="100%"
      boxSizing="border-box"
    >
      {item && index !== undefined && (
        <>
          <Flex flex="1" minWidth="50%">
            {item.type === "CHECKLIST" && (
              <CheckboxItemLista
                item={item as ChecklistItem}
                lista={Array.isArray(lista) ? "default" : (lista as any).id}
                onToggle={(listaId, itemId) =>
                  onToggle?.({ ...item, id: itemId })
                }
              />
            )}
            {item.type === "TEXT" && <ParagrafoItemLista item={item as TextItem} />}
            {item.type === "LIST" && (
              <ListaAninhada
                listas={listas}
                user={user}
                index={index}
                item={item as ListItem}
                lista={lista}
                onToggle={(lista, itemId) =>
                  onToggle ? onToggle({ ...lista, id: itemId }) : undefined
                }
                setListasLocal={setListasLocal ?? (() => {})}
                updateListas={updateListas ?? (() => {})}
                onEdit={onEdit}
                onDelete={onDelete}
                onMove={onMove}
                path={newPath}
                onSave={onSave ?? (() => {})}
                areas={areas}
                isTarefas={!!isTarefas}
                setItems={setItems ?? (() => {})}
                dias={dias}
                setDias={setDias ?? (() => {})}
                diaVisualizado={diaVisualizado}
                setPontuacoes={setPontuacoes ?? (() => {})}
              />
            )}
            {("type" in item && item.type === "TASK") || "taskId" in item ? (
              <Tarefa
                tarefa={item as TarefaResponseDTO | CompletedTaskResponseDTO}
                areas={areas}
                onToggle={() => onToggle?.(item)}
                isAninhado={isAninhado}
              />
            ) : null}
            {item.type === "ACTIVITY" && (
              <Atividade
                atividade={item as ActivityItem}
                areas={areas}
                onToggle={(atividade) => onToggle?.(atividade as T)}
              />
            )}
          </Flex>

          <Box display="flex" justifyContent="flex-end">
            <FormItemLista
              item={item}
              onEdit={onEdit}
              lista={lista}
              onDelete={onDelete}
              onMove={onMove as (item: ItemResponse | CompletedTaskResponseDTO, direction: number) => void}
              index={index}
              path={newPath}
            />
          </Box>
        </>
      )}
    </Flex>
  );
};

export default ItemLista;
