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

function EditorItem({ item, onSave, setItemEditando, areas }) {
  const [title, setTitle] = useState(item.title);
  const [score, setScore] = useState(item.score);
  const [areaId, setAreaId] = useState(item.areaId);
  const [subareaId, setSubareaId] = useState(item.subareaId);
  const [subareas, setSubareas] = useState([]);

  const [area, setArea] = useState();
  const [daysOfTheWeek, setDaysOfTheWeek] = useState(item.daysOfTheWeek);
  const [type, setType] = useState(item.type);

  useEffect(() => {
    console.log("Recebido em EditorItem:", item);
  }, [item]);

  useEffect(() => {
    console.log("Recebido em EditorItem, subareas:", subareas);
  }, [subareas]);

  useEffect(() => {
    const areaSelecionada = areas.find((a) => a.id === areaId);
    setArea(areaSelecionada);

    if (areaSelecionada) {
      const novasSubareas = areaSelecionada.subareas || [];
      setSubareas(novasSubareas);

      const subareaAindaExiste = novasSubareas.some((s) => s.id === subareaId);

      console.log("subareaAindaExiste :", subareaAindaExiste);
      if (!subareaAindaExiste) {
        console.log("Subárea não existe mais, limpando subareaId");
        setSubareaId(null);
      }
    } else {
      setSubareas([]);
      setSubareaId(null);
    }

    console.log("Área selecionada:", areaSelecionada);
    console.log("Subáreas atualizadas:", areaSelecionada?.subareas || []);
    console.log("Subárea selecionada:", subareaId);
  }, [areaId, areas]);

  const handleSave = () => {
    setItemEditando(false);

    const tarefaDTO = {
      title,
      score,
      areaId,
      subareaId,
      type,
      daysOfTheWeek,
    };

    if (type === "task") {
      onSave(item.id, tarefaDTO);
    } else {
      onSave(title, score, areaId, subareaId, "atividade");
    }
  };

  return (
    <Box padding={6}>
      <Heading>Editar {type === "task" ? "Tarefa" : "Atividade"}</Heading>
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
            onValueChange={(e) => setScore(Number(e.value))}
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
          <SelectTipoItem tipo={type} setTipo={setType} />
        </Field>
      </Flex>

      {type === "task" && (
        <CheckboxDaysOfTheWeek
          diasSelecionados={daysOfTheWeek}
          setDiasSelecionados={setDaysOfTheWeek}
        />
      )}

      <ButtonGroup size="sm" variant="outline" mb={4} mt="6">
        <Button
          size="xs"
          onClick={() => setItemEditando(false)}
          colorPalette="red"
        >
          Cancelar
        </Button>
        <Button size="xs" onClick={handleSave}>
          Salvar
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export default EditorItem;
