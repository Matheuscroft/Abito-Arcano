import React, { useState, useEffect } from "react";
import {
  resetPontuacao,
  getPontuacoes,
  updatePontuacoes,
} from "../auth/firebasePontuacoes.js";
import { Box, Button, ButtonGroup, Card, Flex, Text } from "@chakra-ui/react";

function BarraPontuacoes({
  pontuacoes,
  setPontuacoes,
  areas,
  setAreas,
  resetarListaPontuacoes,
  user,
  resetarListaAreas,
}) {
  const [mostrarSubareas, setMostrarSubareas] = useState(false);

  useEffect(() => {
    console.log("Estado atual - areas:", areas);
  }, [areas]);

  /*useEffect(() => {
    console.log("Areas received: ", areas);
    console.log("Pontuacoes received: ", pontuacoes);
  }, [areas, pontuacoes]);*/

  const calcularPontuacaoTotal = (pontuacoes, areaId, subareaId = null) => {
    if (!Array.isArray(pontuacoes)) {
      console.error("Pontuações inválidas:", pontuacoes);
      return 0;
    }

    let total = 0;

    pontuacoes.forEach((pontuacao) => {
      if (pontuacao && Array.isArray(pontuacao.areas)) {
        pontuacao.areas.forEach((area) => {
          if (area.areaId === areaId) {
            if (subareaId) {
              area.subareas.forEach((subarea) => {
                if (subarea.subareaId === subareaId) {
                  total += subarea.pontos;
                }
              });
            } else {
              total += area.pontos;
            }
          }
        });
      }
    });

    return total;
  };

  const resetPontuacaoAreas = async () => {
    let currentPontuacoes = await getPontuacoes(user.uid);

    const updatedPontuacoes = currentPontuacoes.map((pontuacao) => ({
      ...pontuacao,
      areas: pontuacao.areas.map((area) => ({
        ...area,
        pontos: 0,
      })),
    }));

    await updatePontuacoes(user.uid, updatedPontuacoes);
    setPontuacoes(updatedPontuacoes);
  };

  const resetPontuacaoSubareas = async () => {
    let currentPontuacoes = await getPontuacoes(user.uid);

    const updatedPontuacoes = currentPontuacoes.map((pontuacao) => ({
      ...pontuacao,
      areas: pontuacao.areas.map((area) => ({
        ...area,
        subareas: area.subareas.map((subarea) => ({
          ...subarea,
          pontos: 0,
        })),
      })),
    }));

    await updatePontuacoes(user.uid, updatedPontuacoes);
    setPontuacoes(updatedPontuacoes);
  };

  return (
    <Box>
      <ButtonGroup size="sm" variant="outline" mb={4}>
        <Button size="xs" onClick={resetarListaPontuacoes}>
          Resetar Lista de Pontuações
        </Button>
        <Button size="xs" onClick={resetPontuacaoAreas}>
          Resetar Pontuação das Áreas
        </Button>
        <Button size="xs" onClick={resetPontuacaoSubareas}>
          Resetar Pontuação das Subáreas
        </Button>
        <Button size="xs" onClick={resetarListaAreas}>
          Resetar Lista das Áreas
        </Button>
      </ButtonGroup>

      <Flex wrap="wrap" gap="10px" mb="20px">
        {areas && Array.isArray(areas) && areas.length > 0 ? (
          areas.map((area) => (
            <Card.Root
              key={area.id}
              bg={area.cor}
              color="white"
              flex="0 1 120px"
              height="100px"
            >
              {" "}
              <Card.Body
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
              >
                <Text fontWeight="bold" fontSize="sm">
                  {area.nome}
                </Text>
                <Text fontSize="sm">
                  {calcularPontuacaoTotal(pontuacoes, area.id)}
                </Text>
              </Card.Body>
            </Card.Root>
          ))
        ) : (
          <p>Carregando áreas...</p>
        )}
      </Flex>

      <Button onClick={() => setMostrarSubareas(!mostrarSubareas)} mt={4} mb={4}>
        {mostrarSubareas ? "Esconder Subáreas" : "Mostrar Subáreas"}
      </Button>

      {mostrarSubareas && (
        <Flex direction="row" wrap="wrap" gap="10px" mt={4}>
          {areas && Array.isArray(areas) && areas.length > 0 ? (
            areas.map((area) =>
              area.subareas.map((subarea) => (
                <Card.Root
                  key={subarea.id}
                  bg={area.cor}
                  color="white"
                  flex="0 1 120px"
                  height="100px"
                  overflow="hidden"
                >
                  <Card.Body
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="flex-start"
                    textAlign="center"
                    
                  >
                    <Text fontWeight="bold" fontSize="xs" isTruncated>
                      {subarea.nome}
                    </Text>
                    <Text fontSize="sm">
                      {calcularPontuacaoTotal(pontuacoes, area.id, subarea.id)}
                    </Text>
                  </Card.Body>
                </Card.Root>
              ))
            )
          ) : (
            <Text>Carregando subáreas...</Text>
          )}
        </Flex>
      )}
    </Box>
  );
}

export default BarraPontuacoes;
