import React, { useEffect } from "react";
import { inserirDias } from "../../../auth/firebaseDiasHoras.js";
import { atualizarDiasLocalmenteENoFirebase } from "../../todoUtils.js";
import BotaoDia from "./BotaoDia.jsx";
import { Box, Button, ButtonGroup, Heading, Stack } from "@chakra-ui/react";

const BarraDias = ({
  user,
  dias,
  setDias,
  diaVisualizado,
  setDiaVisualizado,
  tarefasGerais,
  setTarefasPorDia,
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
        setTarefasPorDia((prev) => ({ ...prev, [dia.data]: dia.tarefas }));
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
  }, [dias]);

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
          <Stack direction="row" spacing={4} flexWrap="nowrap">
            {dias.map((dia) => (
              <BotaoDia
                key={dia.date}
                data={dia.date}
                diaSemana={dia.dayOfWeek}
                isSelecionado={diaVisualizado.id === dia.id}
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
