import React, { useState, useEffect } from "react";
import { setarCorAreaETexto } from "./utils";
import FormBotoesEditarEDelete from "./componentes/forms/FormBotoesEditarEDelete/FormBotoesEditarEDelete";
import { Badge, Box, Flex, Text } from "@chakra-ui/react";
import { Checkbox } from "./ui/checkbox";

function Atividade({ atividade, onEdit, onDelete, onToggle, areas }) {
  const [corArea, setCorArea] = useState("#000");
  const [corTexto, setCorTexto] = useState("#fff");

  useEffect(() => {
    if (Array.isArray(areas) && atividade.areaId) {
      setarCorAreaETexto(atividade, areas, setCorArea, setCorTexto);
      //console.log("SETOU COR atv");
    } else {
      console.log("ATV areas não é um array ou tarefa não possui areaId");
    }
  }, [atividade.areaId, areas]);

  useEffect(() => {
    
    //console.log("entrou no atividade, atv:");
   // console.log(atividade);
  }, [atividade.areaId, areas]);

  return (
    <Flex align="center" justify="space-between" width="100%">
      <Flex align="center" gap={3} flex="1">
        <Checkbox
          checked={atividade.finalizada}
          onCheckedChange={onToggle}
        ></Checkbox>

        <Text
          as="button"
          fontWeight="bold"
          fontSize="md"
          color="blue.200"
          _hover={{ textDecoration: "underline", cursor: "pointer" }}
        >
          {atividade.nome}
        </Text>

        <Badge
          bg={corArea}
          color={corTexto}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="sm"
        >
          +{atividade.numero}
        </Badge>

        {atividade.subarea && (
          <Box>
            <Text fontSize="sm" color="gray.500" mr={5}>
              {atividade.subarea}
            </Text>
          </Box>
        )}
      </Flex>
    </Flex>
  );
}

export default Atividade;
