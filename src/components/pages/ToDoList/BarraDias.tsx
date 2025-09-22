import React, { useEffect } from "react";
import BotaoDia from "./BotaoDia";
import { Box, Button, ButtonGroup, Heading, Stack } from "@chakra-ui/react";
import type { UserResponseDTO } from "@/types/user.js";
import type { DayResponseDTO } from "@/types/day.js";
import type { ItemResponse } from "@/types/item.js";

const stackProps = {
  spacing: 4,
  direction: "row",
  flexWrap: "nowrap"
} as const;
    

interface BarraDiasProps {
  user: UserResponseDTO;
  dias: DayResponseDTO[];
  setDias: React.Dispatch<React.SetStateAction<DayResponseDTO[]>>;
  diaVisualizado: DayResponseDTO | null;
  setDiaVisualizado: React.Dispatch<React.SetStateAction<DayResponseDTO | null>>;
  tarefasGerais: ItemResponse[];
  setTarefasDoDia: React.Dispatch<React.SetStateAction<ItemResponse[]>>;
  resetarListaDeDias: () => Promise<void>;
}

const BarraDias: React.FC<BarraDiasProps> = ({
  user,
  dias,
  setDias,
  diaVisualizado,
  setDiaVisualizado,
  tarefasGerais,
  setTarefasDoDia,
  resetarListaDeDias,
}) => {

  const resetarTarefasFuturas = async () => {
    /*try {
      const tarefasGeraisLimpa = tarefasGerais.map((tarefa) => ({
        ...tarefa,
        finalizada: false,
      }));

      console.log("tarefasGeraisLimpa");
      console.log(tarefasGeraisLimpa);
      console.log("dias");
      console.log(dias);

      const diasAtualizados = dias.map((dia) => {
        const data = new Date(
          dia.data.split("/").reverse().join("-") + "T00:00:00"
        ).toLocaleDateString("pt-BR");
        if (data > dataAtual) {
          return { ...dia, tarefas: tarefasGeraisLimpa };
        }
        return dia;
      });

      console.log("diasAtualizados");
      console.log(diasAtualizados);

      atualizarDiasLocalmenteENoFirebase(user.uid, diasAtualizados, setDias);

      diasAtualizados.forEach((dia) => {
        setTarefasDoDia((prev) => ({ ...prev, [dia.data]: dia.tarefas }));
      });
    } catch (error) {
      console.error("Erro ao resetar tarefas futuras:", error);
    }*/
  };

  const resetarDiaAtual = async () => {
   /* try {
      const hoje = new Date().toLocaleDateString("pt-BR");
      const diasSalvos = dias.map((dia) =>
        dia.data === hoje
          ? { ...dia, dataAtual: true }
          : { ...dia, dataAtual: false }
      );

      await inserirDias(user.uid, diasSalvos);
      setDataAtual(hoje);
      setDiaVisualizado(hoje);
    } catch (error) {
      console.error("Erro ao resetar o dia atual:", error);
    }*/
  };

  useEffect(() => {
    setDias(dias);
    console.log("dias do barra dias");
    console.log(dias);
  }, [dias, setDias]);

  return (
    <div>
      <Heading>Dias</Heading>
      <ButtonGroup size="sm" variant="outline">
        <Button size="xs" colorPalette="red" onClick={resetarListaDeDias}>
          Resetar Lista de Dias
        </Button>
        <Button size="xs" colorPalette="red" onClick={resetarTarefasFuturas}>
          Resetar Tarefas Futuras
        </Button>
        <Button size="xs" colorPalette="red" onClick={resetarDiaAtual}>
          Resetar Dia Atual
        </Button>
      </ButtonGroup>

      <div>
        <Box
          maxW="700px"
          overflowX="auto"
          scrollBehavior="smooth"
          mt="10px"
          mb="10px"
        >
          <Stack {...stackProps}>
            {dias.map((dia) => (
              <BotaoDia
                key={dia.date}
                date={dia.date}
                dayOfWeek={dia.dayOfWeek}
                isSelected={diaVisualizado?.id === dia.id}
                onClick={() => setDiaVisualizado(dia)}
              />
            ))}
          </Stack>
        </Box>
      </div>
    </div>
  );
};

export default BarraDias;
