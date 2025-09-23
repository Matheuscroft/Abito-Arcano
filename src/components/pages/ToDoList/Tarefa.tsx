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

    //console.log("Tarefa atualizada:", tarefa);
  }, [tarefa, areas]);

  return (
    <Flex
      align="center"
      justify="space-between"
      width="100%"
      textDecoration={isCompleted ? "line-through" : "none"}
      direction={{ base: "column", md: "row" }}
      gap={{ base: 2, md: 0 }}
    >
      <Flex 
        align="center" 
        gap={{ base: 2, md: 3 }} 
        flex="1"
        width={{ base: "100%", md: "auto" }}
        justify={{ base: "space-between", md: "flex-start" }}
      >
        <Flex align="center" gap={{ base: 2, md: 3 }} flex="1">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => onToggle?.(tarefa)}
            ms={isAninhado ? "6" : "1"}
            variant={"subtle"}
          />

          <Text
            as="button"
            fontWeight="bold"
            fontSize={{ base: "sm", md: "md" }}
            color="blue.200"
            _hover={{ textDecoration: "underline", cursor: "pointer" }}
            flex="1"
            textAlign="left"
          >
            {tarefa.title}
          </Text>
        </Flex>

        <Badge
          bg={corArea}
          color={corTexto}
          px={{ base: 1, md: 2 }}
          py={1}
          borderRadius="md"
          fontSize={{ base: "xs", md: "sm" }}
          flexShrink={0}
        >
          +{tarefa.score} {/* Mostra só pontuação no mobile */}
          <Box as="span" display={{ base: "none", md: "inline" }}>
            {" "}{nomeArea.toUpperCase()}
          </Box>
        </Badge>
      </Flex>

      {nomeSubarea && (
        <Box display={{ base: "none", md: "block" }}>
          <Text fontSize="sm" color="gray.500" mr={5}>
            {nomeSubarea}
          </Text>
        </Box>
      )}
    </Flex>
  );
}

export default Tarefa;
