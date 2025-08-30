import React, { useState, useEffect } from "react";
import { getPontuacoes, updatePontuacoes } from "../auth/firebasePontuacoes.js";
import { Box, Button, ButtonGroup, Card, Flex, Text } from "@chakra-ui/react";
import type { ScoreResponseDTO } from "@/types/score.js";
import type { AreaResponseDTO } from "@/types/area.js";
import type { UserResponseDTO } from "@/types/user.js";

interface BarraPontuacoesProps {
  pontuacoes: ScoreResponseDTO[];
  setPontuacoes: React.Dispatch<React.SetStateAction<ScoreResponseDTO[]>>;
  areas: AreaResponseDTO[];
  setAreas: React.Dispatch<React.SetStateAction<AreaResponseDTO[]>>;
  user: UserResponseDTO;
}

const BarraPontuacoes: React.FC<BarraPontuacoesProps> = ({
  pontuacoes,
  setPontuacoes,
  areas,
  setAreas,
  user,
}) => {
  const [mostrarSubareas, setMostrarSubareas] = useState(false);

  useEffect(() => {
    console.log("Estado atual - areas:", areas);
  }, [areas]);

  useEffect(() => {
    console.log("Pontuacoes received: ", pontuacoes);
  }, [pontuacoes]);

  const calcularPontuacaoTotal = (
    pontuacoes: ScoreResponseDTO[],
    areaId: string,
    subareaId?: string | null
  ) => {
    if (!Array.isArray(pontuacoes)) return 0;

    return pontuacoes
      .filter(
        (p) =>
          p.areaId === areaId && (subareaId ? p.subareaId === subareaId : true)
      )
      .reduce((acc, p) => acc + p.score, 0);
  };

  const resetPontuacaoAreas = async () => {
    let currentPontuacoes = await getPontuacoes(user.id);

    const updatedPontuacoes = currentPontuacoes.map((pontuacao) => ({
      ...pontuacao,
      areas: pontuacao.areas.map((area) => ({
        ...area,
        pontos: 0,
      })),
    }));

    await updatePontuacoes(user.id, updatedPontuacoes);
    setPontuacoes(updatedPontuacoes);
  };

  const resetPontuacaoSubareas = async () => {
    let currentPontuacoes = await getPontuacoes(user.id);

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

    await updatePontuacoes(user.id, updatedPontuacoes);
    setPontuacoes(updatedPontuacoes);
  };

  return (
    <Box>
      <ButtonGroup size="sm" variant="outline" mb={4}>
        <Button size="xs" onClick={resetPontuacaoAreas}>
          Resetar Pontuação das Áreas
        </Button>
        <Button size="xs" onClick={resetPontuacaoSubareas}>
          Resetar Pontuação das Subáreas
        </Button>
      </ButtonGroup>

      <Flex wrap="wrap" gap="10px" mb="20px">
        {areas && Array.isArray(areas) && areas.length > 0 ? (
          areas.map((area) => (
            <Card.Root
              key={area.id}
              bg={area.color}
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
                  {area.name.toUpperCase()}
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

      <Button
        onClick={() => setMostrarSubareas(!mostrarSubareas)}
        mt={4}
        mb={4}
      >
        {mostrarSubareas ? "Esconder Subáreas" : "Mostrar Subáreas"}
      </Button>

      {mostrarSubareas && (
        <Flex direction="row" wrap="wrap" gap="10px" mt={4}>
          {areas && Array.isArray(areas) && areas.length > 0 ? (
            areas.map((area) =>
              area.subareas.map((subarea) => (
                <Card.Root
                  key={subarea.id}
                  bg={area.color}
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
                    <Text fontWeight="bold" fontSize="xs" truncate>
                      {subarea.name}
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
};

export default BarraPontuacoes;
