import React, { useState, useEffect } from "react";
import { setarCorAreaETexto } from "../../utils";
import FormBotoesEditarEDelete from "../../componentes/forms/FormBotoesEditarEDelete/FormBotoesEditarEDelete";
import FormSetasOrdenar from "../../componentes/forms/FormSetasOrdenar/FormSetasOrdenar";
import FormItemLista from "../../componentes/forms/FormItemLista/FormItemLista";
import { Checkbox } from "../../ui/checkbox";
import { Badge, Box, Flex, HStack, Spacer, Text } from "@chakra-ui/react";

function Tarefa({
  tarefa,
  onEdit,
  onDelete,
  onToggle,
  areas,
  index,
  lista,
  onMove,
  path = [],
  isAninhado = false,
}) {
  const [corArea, setCorArea] = useState("#000");
  const [corTexto, setCorTexto] = useState("#fff");

  const newPath = [...path, index];

  useEffect(() => {
    if (Array.isArray(areas) && tarefa.areaId) {
      setarCorAreaETexto(tarefa, areas, setCorArea, setCorTexto);
    } else {
      console.log("areas não é um array ou tarefa não possui areaId");
    }
  }, [tarefa.areaId, areas]);

  return (
    <Flex align="center" justify="space-between" width="100%">
      <Flex align="center" gap={3} flex="1">
        <Checkbox
          checked={tarefa.finalizada}
          onCheckedChange={onToggle}
          ms={isAninhado ? "6" : "1"}
        ></Checkbox>

        <Text
          as="button"
          fontWeight="bold"
          fontSize="md"
          color="blue.200"
          _hover={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {tarefa.nome}
        </Text>

        <Badge
          bg={corArea}
          color={corTexto}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="sm"
        >
          +{tarefa.numero} {tarefa.area}
        </Badge>
      </Flex>

      {tarefa.subarea && (
        <Box >
          <Text fontSize="sm" color="gray.500" mr={5}>
            {tarefa.subarea}
          </Text>
        </Box>
      )}
    </Flex>
  );
}

export default Tarefa;
