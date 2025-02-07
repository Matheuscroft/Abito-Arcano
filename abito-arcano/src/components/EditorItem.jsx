import React, { useState, useEffect } from "react";
import SelectTipoLista from "./Listas/SelectTipoLista";
import SelectAreaLista from "./Listas/SelectAreaLista";
import SelectTipoItem from "./Listas/selects/select-tipo-item/SelectTipoItem";
import {
  Box,
  Button,
  ButtonGroup,
  CheckboxGroup,
  Fieldset,
  Flex,
  Heading,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Stack,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import {
  NumberInputField,
  NumberInputRoot,
  NumberInputLabel,
} from "./ui/number-input";
import { Field } from "./ui/field";
import SelectArea from "./componentes/selects/SelectArea";
import SelectSubarea from "./componentes/selects/SelectSubarea";
import { Checkbox } from "./ui/checkbox";

function EditorItem({ item, onSave, tipo, setItemEditando, areas }) {
  const [nome, setNome] = useState(item.nome);
  const [numero, setNumero] = useState(item.numero);
  const [area, setArea] = useState(item.area);
  const [areaSelectState, setAreaSelectState] = useState([item.area]);
  const [subarea, setSubarea] = useState(item.subarea);
  const [subareaSelectState, setSubareaSelectState] = useState([item.subarea]);
  //const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [diasSemana, setDiasSemana] = useState(item.diasSemana || []);
  const [tipoNovo, setTipoNovo] = useState(item.tipo);

  const diasOpcoes = [1, 2, 3, 4, 5, 6, 7];

  const diasNomes = [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ];

  useEffect(() => {
    if (area) {
      console.log("area do editr item");
      console.log(area);
      const areaEncontrada = areas.find((a) => a.nome === area);
      setSubareas(areaEncontrada ? areaEncontrada.subareas : []);
    }
  }, [area, areas]);

  useEffect(() => {
    console.log("item");
    console.log(item);
    console.log("item.diasSemana");
    console.log(item.diasSemana);

    if (typeof item.diasSemana[0] === "string") {
      console.log("entrei aoer");
      setDiasSemana((prevDias) => {
        return prevDias.filter((d) => typeof d !== "string");
      });
    }
  }, []);

  const handleSave = () => {
    const areaNome = area === "" ? "SEM CATEGORIA" : area;
    const areaEncontrada = areas.find((a) => a.nome === areaNome);

    const subareaEncontrada = areaEncontrada?.subareas.find(
      (s) => s.nome === subarea
    );

    const nomeSubarea = subareaEncontrada ? subareaEncontrada.nome : "";

    const areaId = areaEncontrada ? areaEncontrada.id : null;
    const subareaId = subareaEncontrada ? subareaEncontrada.id : null;

    setItemEditando(false);
    if (tipo === "tarefa") {
      onSave(
        nome,
        numero,
        areaNome,
        nomeSubarea,
        areaId,
        subareaId,
        diasSemana,
        tipoNovo
      );
    } else {
      onSave(nome, numero, areaNome, nomeSubarea, areaId, subareaId);
    }
  };

  const handleDiaSemanaChange = (dia) => {
    setDiasSemana((prevDias) => {
      const filteredDias = prevDias.filter((d) => d !== 0);

      console.log("filteredDias");
      console.log(filteredDias);

      const updatedDias = filteredDias.includes(dia)
        ? filteredDias.filter((d) => d !== dia)
        : [...filteredDias, dia];

      return updatedDias.sort((a, b) => a - b);
    });
  };

  return (
    <Box padding={6}>
      <Heading>Editar {tipo === "tarefa" ? "Tarefa" : "Atividade"}</Heading>
      <Flex wrap="wrap" gap={2} align="center">
        <Field width="200px" label="Título">
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder={`Digite o nome da ${tipo}`}
            width="200px"
            size="xs"
          />
        </Field>
        <Field width="60px" label="Pontos">
          <NumberInputRoot
            value={numero}
            defaultValue="1"
            width="60px"
            min={0}
            onValueChange={(e) => setNumero(Number(e.value))}
            size="xs"
          >
            <NumberInputField />
          </NumberInputRoot>
        </Field>
        <SelectArea
          areas={areas}
          area={areaSelectState}
          setArea={(novaArea) => {
            setAreaSelectState(novaArea);
            setArea(novaArea[0]);
            setSubareaSelectState([]);
            setSubarea([]);
          }}
        />
        <SelectSubarea
          subarea={subareaSelectState}
          subareas={subareas}
          setSubarea={(novaSubarea) => {
            setSubareaSelectState(novaSubarea);
            setSubarea(novaSubarea[0]);
          }}
        />
        <Field width="200px" label="Tipo">
          <SelectTipoItem tipo={tipoNovo} setTipo={setTipoNovo} />
        </Field>
      </Flex>

      {tipo === "tarefa" && (
        <Fieldset.Root>
          <CheckboxGroup name="framework" value={diasSemana}>
            <Fieldset.Legend fontSize="sm" mb="2" mt="6">
              Selecione os dias da semana:
            </Fieldset.Legend>
            <Fieldset.Content>
              <Flex wrap="wrap" gap={2}>
                {diasOpcoes.map((dia) => (
                  <Checkbox
                    key={dia}
                    value={dia}
                    isChecked={diasSemana.includes(dia)}
                    onChange={() => handleDiaSemanaChange(dia)}
                    size="sm"
                  >
                    {diasNomes[dia - 1]}
                  </Checkbox>
                ))}
              </Flex>
            </Fieldset.Content>
          </CheckboxGroup>
        </Fieldset.Root>
      )}

      <ButtonGroup size="sm" variant="outline" mb={4} mt="6">
        <Button size="xs" onClick={() => setItemEditando(false)} colorPalette="red">
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
