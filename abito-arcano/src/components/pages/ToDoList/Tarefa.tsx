import React, { useState, useEffect } from "react";
import { setarCorAreaETexto } from "../../utils";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { Checkbox } from "../../ui/checkbox";
import type {
  CompletedTaskResponseDTO,
  TarefaResponseDTO,
} from "../../../types/task";
import type { AreaResponseDTO } from "../../../types/area";

interface Props {
  tarefa: TarefaResponseDTO | CompletedTaskResponseDTO;
  onToggle?: (item: TarefaResponseDTO | CompletedTaskResponseDTO) => void;
  areas: AreaResponseDTO[];
  isAninhado?: boolean;
}

function Tarefa({ tarefa, onToggle, areas, isAninhado = false }: Props) {
  const isCompleted = "tarefaId" in tarefa;

  const [corArea, setCorArea] = useState("#000");
  const [corTexto, setCorTexto] = useState("#fff");
  const [nomeArea, setNomeArea] = useState("Sem Categoria");
  const [nomeSubarea, setNomeSubarea] = useState("");

  useEffect(() => {
    if (Array.isArray(areas) && tarefa.areaId) {
      setarCorAreaETexto(
        tarefa,
        areas,
        setCorArea,
        setCorTexto,
        setNomeArea,
        setNomeSubarea
      );
    }

    console.log("Tarefa atualizada:", tarefa);
  }, [tarefa, areas]);

  return (
    <Flex
      align="center"
      justify="space-between"
      width="100%"
      textDecoration={isCompleted ? "line-through" : "none"}
    >
      <Flex align="center" gap={3} flex="1">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => onToggle?.(tarefa)}
          ms={isAninhado ? "6" : "1"}
          variant={"subtle"}
        ></Checkbox>

        <Text
          as="button"
          fontWeight="bold"
          fontSize="md"
          color="blue.200"
          _hover={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {tarefa.title}
        </Text>

        <Badge
          bg={corArea}
          color={corTexto}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="sm"
        >
          +{tarefa.score} {nomeArea.toUpperCase()}
        </Badge>
      </Flex>

      {nomeSubarea && (
        <Box>
          <Text fontSize="sm" color="gray.500" mr={5}>
            {nomeSubarea}
          </Text>
        </Box>
      )}
    </Flex>
  );
}

export default Tarefa;
