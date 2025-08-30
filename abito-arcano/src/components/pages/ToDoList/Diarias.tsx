import React, {
  useState,
  useEffect,
  type SetStateAction,
  type Dispatch,
} from "react";
import ListaTarefas from "./ListaTarefas";

import RelogioCron from "../../RelogioCron";
import BarraDias from "./BarraDias";
import { Heading } from "@chakra-ui/react";
import { getDiaById } from "../../../services/diasService";
import type { UserResponseDTO } from "@/types/user.js";
import type { ScoreResponseDTO } from "@/types/score.js";
import type { AreaResponseDTO } from "@/types/area.js";
import type { DayResponseDTO } from "@/types/day.js";
import type { CompletedTaskResponseDTO } from "@/types/task.js";
import type { ItemResponse } from "@/types/item.js";

interface DiariasProps {
  user: UserResponseDTO;
  setPontuacoes: Dispatch<SetStateAction<ScoreResponseDTO[]>>;
  pontuacoes: ScoreResponseDTO[];
  areas: AreaResponseDTO[];
  diaVisualizado: DayResponseDTO | null;
  setDiaVisualizado: Dispatch<SetStateAction<DayResponseDTO | null>>;
  dias: DayResponseDTO[];
  setDias: Dispatch<SetStateAction<DayResponseDTO[]>>;
}

const Diarias: React.FC<DiariasProps> = ({
  user,
  setPontuacoes,
  pontuacoes,
  areas,
  diaVisualizado,
  setDiaVisualizado,
  dias,
  setDias,
}) => {
  const [tarefasGerais] = useState<ItemResponse[]>([]);
  const [tarefasDoDia, setTarefasDoDia] = useState<ItemResponse[]>([]);
  const [completedTasks, setCompletedTasks] = useState<
    CompletedTaskResponseDTO[]
  >([]);

  useEffect(() => {
    const fetchTarefasDoDia = async () => {
      const token = localStorage.getItem("token");
      console.log("diaVisualizado:");
      console.log(diaVisualizado);
      if (diaVisualizado) {
        const diaDetalhado = await getDiaById(diaVisualizado.id, token);
        console.log("Dia detalhado obtido:");
        console.log(diaDetalhado);
        if (diaDetalhado) {
          setTarefasDoDia(diaDetalhado.tarefasPrevistas);
          setCompletedTasks(diaDetalhado.completedTasks);
          console.log("Tarefas do dia visualizado:");
          console.log(diaDetalhado.tarefasPrevistas);
          console.log("Tarefas concluídas do dia visualizado:");
          console.log(diaDetalhado.completedTasks);
        }
      }
    };

    fetchTarefasDoDia();
  }, [diaVisualizado, dias, user]);

  /*useEffect(() => {
    const fetchData = async () => {
      if (user && user.uid) {
        let diasSalvos = await getDias(user.uid);
        const tarefasGerais = await getListaTarefas(user.uid);
        setTarefasGerais(tarefasGerais);

        console.log("tarefasGerais fetchdata");
        console.log(tarefasGerais);
        console.log("diasSalvos get dias do diarias");
        console.log(diasSalvos);

        const hoje = new Date().toLocaleDateString("pt-BR");
        const diaAtual =
          diasSalvos.length > 0
            ? diasSalvos.find((dia) => dia.dataAtual)?.data
            : hoje;

        if (diasSalvos.length === 0) {
          const novosDias = await resetarListaDeDias();
          setDataAtual(novosDias[0].data);
        } else {
          const diasExpandidos = expandirTarefasDosDias(
            diasSalvos,
            tarefasGerais
          );

          console.log("diasExpandidos get dias do diarias");
          console.log(diasExpandidos);

          setDataAtual(diaAtual);
        }

        setDiaVisualizado(diaAtual);
      }
    };

    fetchData();
  }, []);*/

  const resetarListaDeDias = async () => {
    try {
      /*const novosDias: DayResponseDTO[] = [];
      const options: Intl.DateTimeFormatOptions = { weekday: "long", timeZone: "UTC" };
      for (let i = 0; i <= 6; i++) {
        const data = new Date();
        data.setDate(data.getDate() + i);
        const dataStr = data.toLocaleDateString("pt-BR");
        const diaSemana = data.toLocaleDateString("pt-BR", options);

        const dia: DayResponseDTO = {
        date: dataStr,
        dataAtual: i === 0,
        dayOfWeek: diaSemana,
        tarefas: tarefasGerais.map((tarefa) => ({
          ...tarefa,
          finalizada: false,
        })),
      };

      novosDias.push(dia);
      }

      console.log("novosDias");
      console.log(novosDias);
*/
      //atualizarDiasLocalmenteENoFirebase(user.uid, novosDias, setDias);
      //setDataAtual(novosDias[0].data);
      /*const novasPontuacoes = pontuacoes.filter(pontuacao =>
                novosDias.some(dia => dia.data === pontuacao.data)
            );

            console.log("novasPontuacoes");
            console.log(novasPontuacoes);

            await updatePontuacoes(user.uid, novasPontuacoes);*/
      // return novosDias;
    } catch (error) {
      console.error("Erro ao resetar a lista de dias:", error);
      throw error;
    }
  };

  /* const converterParaDate = (dataStr: string): Date => {
    const [diaStr, mesStr, anoStr] = dataStr.split("/");

    const dia = Number(diaStr);
    const mes = Number(mesStr);
    const ano = Number(anoStr);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
      throw new Error(`Data inválida: ${dataStr}`);
    }

    return new Date(ano, mes - 1, dia);
  };*/

  const trocarDia = async () => {
    try {
      /*console.log("Trocar dia");

      const dataAtualDate = converterParaDate(diaVisualizado.date);
      dataAtualDate.setDate(dataAtualDate.getDate() + 1);
      const novaDataStr = dataAtualDate.toLocaleDateString("pt-BR");

      let diasSalvos = await getDias(user.uid);
      console.log("diasSalvos após troca", diasSalvos);

      diasSalvos = diasSalvos.map((dia) => {
        if (dia.data === diaVisualizado.date) {
          return { ...dia, dataAtual: false };
        } else if (dia.data === novaDataStr) {
          return { ...dia, dataAtual: true };
        }
        return dia;
      });

      const ultimoDia = diasSalvos[diasSalvos.length - 1];
      const ultimoDiaDate = converterParaDate(ultimoDia.data);
      ultimoDiaDate.setDate(ultimoDiaDate.getDate() + 1);
      const novoUltimoDiaStr = ultimoDiaDate.toLocaleDateString("pt-BR");
*/
      //const options = { weekday: "long", timeZone: "UTC" };
      /*const diaSemana = ultimoDiaDate.toLocaleDateString("pt-BR", options);

      const novoDia = {
        data: novoUltimoDiaStr,
        dataAtual: false,
        diaSemana: diaSemana,
        tarefas: tarefasGerais.map((tarefa) => ({
          ...tarefa,
          finalizada: false,
        })),
      };

      diasSalvos.push(novoDia);*/
      /*
      await inserirDias(user.uid, diasSalvos);

      setDiaVisualizado(novaDataStr);

      const novaPontuacao = {
        data: novoUltimoDiaStr,
        areas: pontuacoes[0].areas.map((area) => ({
          areaId: area.areaId,
          pontos: 0,
          subareas: area.subareas.map((subarea) => ({
            subareaId: subarea.subareaId,
            pontos: 0,
          })),
        })),
      };
      const novasPontuacoes = [...pontuacoes, novaPontuacao];
      setPontuacoes(novasPontuacoes);
      await updatePontuacoes(user.uid, novasPontuacoes);
*/
      console.log("Dia trocado com sucesso");
    } catch (error) {
      console.error("Erro ao trocar dia:", error);
    }
  };

  /* useEffect(() => {
         console.log("Estado atualizado - dataAtual:");
         console.log(dataAtual)
     }, [dataAtual]);
 
     useEffect(() => {
         console.log("Estado atualizado - diaVisualizado:");
         console.log(diaVisualizado)
     }, [diaVisualizado]);
 
  useEffect(() => {
    console.log("Dias da diarias:");
    console.log(dias);
  }, [dias]);
*/

  return (
    <div>
      <Heading>Tarefas Diárias</Heading>
      <div>
        <RelogioCron trocarDia={trocarDia} user={user} />
        <BarraDias
          user={user}
          tarefasGerais={tarefasGerais}
          diaVisualizado={diaVisualizado}
          setDiaVisualizado={setDiaVisualizado}
          dias={dias}
          setDias={setDias}
          resetarListaDeDias={resetarListaDeDias}
          setTarefasDoDia={setTarefasDoDia}
        />
      </div>
      <ListaTarefas
        user={user}
        tarefas={tarefasDoDia}
        setTarefasDoDia={setTarefasDoDia}
        completedTasks={completedTasks}
        setCompletedTasks={setCompletedTasks}
        setPontuacoes={setPontuacoes}
        dias={dias}
        setDias={setDias}
        areas={areas}
        diaVisualizado={diaVisualizado}
      />
    </div>
  );
};

export default Diarias;
