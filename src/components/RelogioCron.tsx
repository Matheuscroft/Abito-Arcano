import React, { useState, useEffect } from "react";
import {
  setHoraTrocaFirebase,
  getHoraTrocaFirebase,
} from "../auth/firebaseDiasHoras.js";
import { Box, Button, ButtonGroup, Flex, Input, Text } from "@chakra-ui/react";
import type { UserResponseDTO } from "@/types/user.js";

interface RelogioCronProps {
  user: UserResponseDTO;
  trocarDia: () => void;
}

const RelogioCron: React.FC<RelogioCronProps> = ({ user, trocarDia }) => {
  const [horaTroca, setHoraTroca] = useState<string>("00:00:00");
  const [horaAtual, setHoraAtual] = useState<string>(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchHoraTroca = async () => {
      if (user?.id) {
        const horaSalva = await getHoraTrocaFirebase(user.id);
        if (horaSalva) {
          setHoraTroca(horaSalva);
        }
      }
    };
    fetchHoraTroca();
  }, [user]);

  useEffect(() => {
    /*console.log("Estado atualizado - horaTroca:");
        console.log(horaTroca)*/
    if (user) {
      console.log("user.id");
      console.log(user.id);
    }
  }, [horaTroca, user]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const [horas, minutos, segundos] = horaTroca
        ? horaTroca.split(":").map(Number)
        : [0, 0, 0];

      if (
        (now.getHours() === 0 &&
          now.getMinutes() === 0 &&
          now.getSeconds() === 0) ||
        (now.getHours() === horas &&
          now.getMinutes() === minutos &&
          now.getSeconds() === 0)
      ) {
        console.log("Hora de trocar o dia");
        trocarDia();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [horaTroca, trocarDia]);

  useEffect(() => {
    const interval = setInterval(() => {
      setHoraAtual(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleHoraTrocaChange = async (e) => {
    const novaHoraMinutos = e.target.value.slice(0, 5);
    const novaHoraTroca = `${novaHoraMinutos}:00`;
    setHoraTroca(novaHoraTroca);
    await setHoraTrocaFirebase(user.id, novaHoraTroca);
  };

  const resetHoraTroca = async () => {
    const defaultHoraTroca = "00:00:00";
    setHoraTroca(defaultHoraTroca);
    await setHoraTrocaFirebase(user.id, defaultHoraTroca);
  };

  return (
    <Box>
      <Flex alignItems="center" mb={4}>
      <Text mr={2}>Hora Atual: {horaAtual}</Text>
      <Input
        type="time"
        value={horaTroca.slice(0, 5)}
        onChange={handleHoraTrocaChange}
        step="60"
        size="xs"
        width="auto"
      />
    </Flex>

      <ButtonGroup size="sm" variant="outline" mb={4}>
        <Button size="xs" colorPalette="red" onClick={resetHoraTroca}>
          Resetar Hora de Troca
        </Button>
        <Button size="xs"  colorPalette="yellow" onClick={trocarDia}>
          Trocar Dia
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default RelogioCron;
