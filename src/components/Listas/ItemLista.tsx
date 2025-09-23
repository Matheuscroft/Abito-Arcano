import React, { type Dispatch, type SetStateAction } from "react";
import FormItemLista from "../componentes/forms/FormItemLista/FormItemLista";
import ListaAninhada from "./ListaAninhada";
import Tarefa from "../pages/ToDoList/Tarefa";
import type { CompletedTaskResponseDTO, TarefaResponseDTO } from "@/types/task";
import type { AreaResponseDTO } from "@/types/area";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import type { DayResponseDTO } from "@/types/day";
import CheckboxItemLista from "./CheckboxItemLista";
import ParagrafoItemLista from "./ParagrafoItemLista";
import Atividade from "../Atividade";
import type { ActivityItem, ChecklistItem, ItemResponse, ListItem, TextItem } from "@/types/item";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDragIndicator } from "react-icons/md";


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
  enableDrag?: boolean;
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
    enableDrag = false,
  } = props;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    disabled: !enableDrag 
  });

  const dragStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const newPath = [...path, index];

  console.log("enableDrag:", enableDrag);

  return (
    <Flex
      ref={setNodeRef}
      style={dragStyle}
      justify="space-between"
      align="center"
      width="100%"
      boxSizing="border-box"
      bg={isDragging ? "blue.50" : "transparent"}
      borderRadius="md"
      p={2}
      border={isDragging ? "2px dashed" : "2px solid transparent"}
      borderColor={isDragging ? "blue.200" : "transparent"}
    >
      {item && index !== undefined && (
        <>
          <Flex flex="1" minWidth="50%" align="center" gap={2}>
            {enableDrag && (
              <IconButton
                {...attributes}
                {...listeners}
                size="xs"
                variant="ghost"
                aria-label="Arrastar item"
                cursor="grab"
                _active={{ cursor: "grabbing", bg: "gray.200" }}
                _hover={{ bg: "gray.100" }}
                flexShrink={0}
                minW="auto"
                h="auto"
                p={2}
                color="gray.500"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                _focus={{ outline: "none", bg: "gray.200" }}
                touchAction="none"
                style={{
                  touchAction: 'none',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  MozUserSelect: 'none',
                  msUserSelect: 'none'
                }}
              >
                <MdDragIndicator />
              </IconButton>
            )}

            <Box flex="1">
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
            </Box>
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
