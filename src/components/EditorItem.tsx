import React, { useState, useEffect } from "react";
import SelectTipoItem from "./Listas/selects/select-tipo-item/SelectTipoItem";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Input,
} from "@chakra-ui/react";
import { NumberInputField, NumberInputRoot } from "./ui/number-input";
import { Field } from "./ui/field";
import SelectArea from "./selects/SelectArea";
import SelectSubarea from "./selects/SelectSubarea";
import CheckboxDaysOfTheWeek from "./checkboxes/CheckboxDaysOfTheWeek";
import type { AreaResponseDTO, SubareaSimpleResponseDTO } from "@/types/area";
import type { ItemResponse, ItemType } from "@/types/item";
import type { CompletedTaskResponseDTO } from "@/types/task";

interface EditorItemProps {
  item: ItemResponse | CompletedTaskResponseDTO;
  onSave: (item: ItemResponse | CompletedTaskResponseDTO) => void;
  setItemEditando: React.Dispatch<
    React.SetStateAction<ItemResponse | CompletedTaskResponseDTO | null>
  >;
  areas: AreaResponseDTO[];
}

const EditorItem: React.FC<EditorItemProps> = ({
  item,
  onSave,
  setItemEditando,
  areas,
}) => {
  const [title, setTitle] = useState<string>(item.title);
  const [score, setScore] = useState<number>("score" in item ? item.score : 0);
  const [areaId, setAreaId] = useState<string>(
    "areaId" in item && item.areaId ? item.areaId : ""
  );
  const [subareaId, setSubareaId] = useState<string>(
    "subareaId" in item && item.subareaId ? item.subareaId : ""
  );

  const [subareas, setSubareas] = useState<SubareaSimpleResponseDTO[]>([]);
  const [area, setArea] = useState<AreaResponseDTO | undefined>();
  const [daysOfTheWeek, setDaysOfTheWeek] = useState<number[]>(
    "daysOfTheWeek" in item ? item.daysOfTheWeek : []
  );
  const [type, setType] = useState<ItemType>(item.type);

  useEffect(() => {
    const areaSelecionada = areas.find((a) => a.id === areaId);
    setArea(areaSelecionada);

    if (areaSelecionada) {
      const novasSubareas = areaSelecionada.subareas || [];
      setSubareas(novasSubareas);

      const subareaAindaExiste = novasSubareas.some((s) => s.id === subareaId);

      if (!subareaAindaExiste) {
        setSubareaId("");
      }
    } else {
      setSubareas([]);
      setSubareaId("");
    }
  }, [areaId, areas, subareaId]);

  const handleSave = () => {
    if (!item) return;

    let updatedItem: ItemResponse;

    switch (item.type) {
      case "TASK":
        updatedItem = {
          ...item,
          title,
          type: item.type,
          score: score ?? 0,
          areaId: areaId ?? null,
          subareaId: subareaId ?? null,
          createdAt: item.createdAt ?? new Date().toISOString(),
          originalItemId:
            "originalItemId" in item
              ? item.originalItemId ?? item.id
              : item.originalTaskId ?? item.id,
          isLatestVersion: item.isLatestVersion ?? true,
          daysOfTheWeek: daysOfTheWeek ?? [],
        };
        break;

      case "ACTIVITY":
        updatedItem = {
          ...item,
          title,
          type: item.type,
          score: score ?? 0,
          areaId: areaId ?? null,
          subareaId: subareaId ?? null,
          createdAt: item.createdAt ?? new Date().toISOString(),
          originalItemId:
            "originalItemId" in item
              ? item.originalItemId ?? item.id
              : item.originalTaskId ?? item.id,
          isLatestVersion: item.isLatestVersion ?? true,
        };
        break;

      case "TEXT":
      case "CHECKLIST":
        updatedItem = {
          ...item,
          title,
          type: item.type,
          createdAt: item.createdAt ?? new Date().toISOString(),
          daysOfTheWeek: daysOfTheWeek ?? [],
          originalItemId:
            "originalItemId" in item
              ? item.originalItemId ?? item.id
              : item.originalTaskId ?? item.id,
          isLatestVersion: item.isLatestVersion ?? true,
        };
        break;

      case "LIST":
        updatedItem = {
          ...item,
          title,
          type: item.type,
          score: score ?? 0,
          areaId: areaId ?? null,
          subareaId: subareaId ?? null,
          createdAt: item.createdAt ?? new Date().toISOString(),
          originalItemId:
            "originalItemId" in item
              ? item.originalItemId ?? item.id
              : item.originalTaskId ?? item.id,
          isLatestVersion: item.isLatestVersion ?? true,
          daysOfTheWeek: daysOfTheWeek ?? [],
          items: "items" in item ? item.items : [],
        };
        break;

      default:
        throw new Error("Tipo de item desconhecido");
    }

    setItemEditando(null);
    onSave(updatedItem);
  };

  return (
    <Box padding={6}>
      <Heading>Editar {type === "TASK" ? "Tarefa" : "Atividade"}</Heading>
      <Flex wrap="wrap" gap={2} align="center">
        <Field width="200px" label="Título">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={`Digite o título da ${type}`}
            width="200px"
            size="xs"
          />
        </Field>

        <Field width="60px" label="Pontos">
          <NumberInputRoot
            value={score}
            defaultValue="1"
            width="60px"
            min={0}
            onValueChange={setScore}
            size="xs"
          >
            <NumberInputField />
          </NumberInputRoot>
        </Field>

        <SelectArea areas={areas} areaId={areaId} setAreaId={setAreaId} />

        {area?.name.toUpperCase() !== "SEM CATEGORIA" && (
          <SelectSubarea
            subareaId={subareaId}
            subareas={subareas}
            setSubareaId={setSubareaId}
          />
        )}

        <Field width="200px" label="Tipo">
          <SelectTipoItem type={type} setType={setType} />
        </Field>
      </Flex>

      {type === "TASK" && (
        <CheckboxDaysOfTheWeek
          diasSelecionados={daysOfTheWeek}
          setDiasSelecionados={setDaysOfTheWeek}
        />
      )}

      <ButtonGroup size="sm" variant="outline" mb={4} mt="6">
        <Button
          size="xs"
          onClick={() => setItemEditando(null)}
          colorScheme="red"
        >
          Cancelar
        </Button>
        <Button size="xs" onClick={handleSave}>
          Salvar
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default EditorItem;
