import React, { useState, useEffect } from "react";
import "./listas.css";
import SelectTipoItem from "./selects/select-tipo-item/SelectTipoItem";
import { Box, Button, Heading, HStack, Input } from "@chakra-ui/react";
import type {
  ActivityItem,
  ChecklistItem,
  ItemResponse,
  ItemType,
  ListItem,
  TaskItem,
  TextItem,
} from "@/types/item";
import type { CompletedTaskResponseDTO } from "@/types/task";

interface EditorItemListaProps {
  item: ItemResponse | CompletedTaskResponseDTO;
  onSave: (item: ItemResponse | CompletedTaskResponseDTO) => void;
  setItemEditando: React.Dispatch<
    React.SetStateAction<ItemResponse | CompletedTaskResponseDTO | null>
  >;
}

const EditorItemLista: React.FC<EditorItemListaProps> = ({
  item,
  onSave,
  setItemEditando,
}) => {
  const [title, setTitle] = useState<string>(item.title);
  const [type, setType] = useState<ItemType>(item.type);

  const handleSave = () => {
    if (!item) return;

    switch (item.type) {
      case "TASK": {
        const updatedItem: TaskItem = {
          ...item,
          title,
          type: item.type,
          score: item.score ?? 0,
          areaId: item.areaId ?? null,
          subareaId: item.subareaId ?? null,
          createdAt: item.createdAt ?? new Date().toISOString(),
          originalItemId:
            "originalItemId" in item
              ? item.originalItemId ?? item.id
              : item.originalTaskId ?? item.id,
          isLatestVersion: item.isLatestVersion ?? true,
          daysOfTheWeek: item.daysOfTheWeek ?? [],
        };
        setItemEditando(null);
        onSave(updatedItem);
        break;
      }

      case "ACTIVITY": {
        const updatedItem: ActivityItem = {
          ...item,
          title,
          type: item.type,
          score: item.score ?? 0,
          areaId: item.areaId ?? null,
          subareaId: item.subareaId ?? null,
          createdAt: item.createdAt ?? new Date().toISOString(),
          originalItemId:
            "originalItemId" in item
              ? item.originalItemId ?? item.id
              : item.originalTaskId ?? item.id,
          isLatestVersion: item.isLatestVersion ?? true,
        };
        setItemEditando(null);
        onSave(updatedItem);
        break;
      }

      case "LIST": {
        const updatedItem: ListItem = {
          ...item,
          title,
          type: item.type,
          score: item.score ?? 0,
          areaId: item.areaId ?? null,
          subareaId: item.subareaId ?? null,
          createdAt: item.createdAt ?? new Date().toISOString(),
          originalItemId:
            "originalItemId" in item
              ? item.originalItemId ?? item.id
              : item.originalTaskId ?? item.id,
          isLatestVersion: item.isLatestVersion ?? true,
          daysOfTheWeek: item.daysOfTheWeek ?? [],
          items: "items" in item && Array.isArray(item.items) ? item.items : [],
        };
        setItemEditando(null);
        onSave(updatedItem);
        break;
      }

      case "TEXT": {
        const updatedItem: TextItem = {
          ...item,
          title,
          type: item.type,
          createdAt: item.createdAt ?? new Date().toISOString(),
          daysOfTheWeek: item.daysOfTheWeek ?? [],
          originalItemId:
            "originalItemId" in item
              ? item.originalItemId ?? item.id
              : item.originalTaskId ?? item.id,
          isLatestVersion: item.isLatestVersion ?? true,
        };
        setItemEditando(null);
        onSave(updatedItem);
        break;
      }

      case "CHECKLIST": {
        const updatedItem: ChecklistItem = {
          ...item,
          title,
          type: item.type,
          createdAt: item.createdAt ?? new Date().toISOString(),
          daysOfTheWeek: item.daysOfTheWeek ?? [],
          originalItemId:
            "originalItemId" in item
              ? item.originalItemId ?? item.id
              : item.originalTaskId ?? item.id,
          isLatestVersion: item.isLatestVersion ?? true,
        };
        setItemEditando(null);
        onSave(updatedItem);
        break;
      }

      default:
        throw new Error("Tipo de item desconhecido");
    }
  };

  useEffect(() => {
    console.log("Estado atualizadOOOOOO - item do editoritemlista:");
    console.log(item);
  }, [item]);

  return (
    <Box p="6">
      <Heading>Editar Item</Heading>
      <HStack>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Digite o nome do item`}
          width="150px"
          size="xs"
        />

        <SelectTipoItem type={type} setType={setType} />

        <Button size="xs" onClick={handleSave}>
          Salvar
        </Button>
        <Button
          size="xs"
          onClick={() => setItemEditando(false || null)}
          variant="outline"
          colorScheme="red"
        >
          Cancelar
        </Button>
      </HStack>
    </Box>
  );
};

export default EditorItemLista;
