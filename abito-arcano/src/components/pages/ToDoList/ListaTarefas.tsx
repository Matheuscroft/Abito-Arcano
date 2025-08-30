import React, {
  useState,
  useEffect,
  type SetStateAction,
  type Dispatch,
} from "react";
import EditorItem from "../../EditorItem";
import {
  atualizarDiasLocalmenteENoFirebase,
  atualizarDias,
} from "../../todoUtils.js";
import {
  getListaTarefas,
  substituirTarefasGerais,
} from "../../../auth/firebaseTarefas.js";
import { getDias } from "../../../auth/firebaseDiasHoras.js";
import ItemLista from "../../Listas/ItemLista";
import { Box, Button, Heading, HStack, Input, Text } from "@chakra-ui/react";
import {
  addTarefa,
  deleteTarefa,
  updateTarefa,
} from "../../../services/tasksService";
import {
  checkTarefa,
  uncheckTarefa,
} from "../../../services/completedTaskService";
import EmptyStateTasks from "../../emptystates/EmptyStateTasks.jsx";
import type { CompletedTaskResponseDTO } from "@/types/task.js";
import type { DayResponseDTO } from "@/types/day.js";
import {
  ItemType,
  type ItemCreateDTO,
  type ItemResponse,
  type TaskItem,
} from "../../../types/item";
import type { AreaResponseDTO } from "@/types/area.js";
import type { UserResponseDTO } from "@/types/user.js";
import type { ScoreResponseDTO } from "@/types/score.js";

const hStackProps = {
  spacing: 4,
  align: "center",
  mb: 4,
} as const;

interface ListaTarefasProps {
  user: UserResponseDTO;
  tarefas: ItemResponse[];
  setTarefasDoDia: Dispatch<SetStateAction<ItemResponse[]>>;
  completedTasks: CompletedTaskResponseDTO[];
  setCompletedTasks: Dispatch<SetStateAction<CompletedTaskResponseDTO[]>>;
  setPontuacoes: Dispatch<SetStateAction<ScoreResponseDTO[]>>;
  dias: DayResponseDTO[];
  setDias: Dispatch<SetStateAction<DayResponseDTO[]>>;
  areas: AreaResponseDTO[];
  diaVisualizado: DayResponseDTO | null;
}

function ListaTarefas({
  user,
  tarefas,
  setTarefasDoDia,
  completedTasks,
  setCompletedTasks,
  setPontuacoes,
  setDias,
  dias,
  areas,
  diaVisualizado,
}: ListaTarefasProps) {
  const [nomeNovaTarefa, setNomeNovaTarefa] = useState<string>("");
  const [itemEditando, setItemEditando] = useState<
    ItemResponse | CompletedTaskResponseDTO | null
  >(null);

  useEffect(() => {
    console.log("tarefas:");
    console.log(tarefas);
  }, [tarefas]);

  useEffect(() => {
    console.log("completedtasks:");
    console.log(completedTasks);
  }, [completedTasks]);

  const resetarListaDeTarefasGerais = async (userId) => {
    try {
      const tarefasVazias = [];
      await substituirTarefasGerais(userId, tarefasVazias);

      const dias = await getDias(userId);

      const diasAtualizados = dias.map((dia) => ({
        ...dia,
        tarefas: [],
      }));

      console.log(
        "Lista de tarefas gerais e tarefas de todos os dias resetadas com sucesso."
      );
      console.log("diasAtualizados");
      console.log(diasAtualizados);

      atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);

      return { tarefas: tarefasVazias, dias: diasAtualizados };
    } catch (error) {
      console.error("Erro ao resetar lista de tarefas gerais:", error);
      throw error;
    }
  };

  const handleAddItem = async () => {
    const token = localStorage.getItem("token");
    if (nomeNovaTarefa.trim() === "") return;

    const tarefaDTO: ItemCreateDTO = {
      title: nomeNovaTarefa,
      score: 1,
      type: ItemType.TASK,
      daysOfTheWeek: [1, 2, 3, 4, 5, 6, 7],
      areaId: null,
      subareaId: null,
    };

    const tarefaTemporaria: TaskItem & { isTemporary: true } = {
      ...tarefaDTO,
      type: ItemType.TASK,
      id: `temp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      originalItemId: null,
      isLatestVersion: true,
      isTemporary: true,
    };

    setTarefasDoDia((prev) => [...prev, tarefaTemporaria]);

    setNomeNovaTarefa("");

    try {
      const novaTarefa: ItemResponse = await addTarefa(
        tarefaDTO,
        diaVisualizado?.id,
        token
      );

      setTarefasDoDia((prev) =>
        prev.map((t) => (t.id === tarefaTemporaria.id ? novaTarefa : t))
      );
    } catch (err) {
      console.error("Erro ao adicionar tarefa:", err);
    }
  };

  const handleDeleteItem = async (tarefa) => {
    const token = localStorage.getItem("token");
    console.log("[handleDeleteItem] Iniciando a exclusão da tarefa:", tarefa);

    const tarefaId = tarefa.tarefaId || tarefa.id;
    console.log("[handleDeleteItem] tarefaId:", tarefaId);
    console.log("[handleDeleteItem] diaVisualizado:", diaVisualizado);

    if (!token || !tarefaId || !diaVisualizado?.id) {
      console.error("Token, tarefaId ou dia.id ausente");
      return;
    }

    if (tarefa.tarefaId) {
      setCompletedTasks((prev) => prev.filter((t) => t.tarefaId !== tarefaId));
      setTarefasDoDia((prev) => prev.filter((t) => t.id !== tarefaId));
    } else {
      setTarefasDoDia((prev) => prev.filter((t) => t.id !== tarefaId));
    }

    try {
      console.log("[handleDeleteItem] Deletando tarefa:", tarefa);
      await deleteTarefa(tarefaId, diaVisualizado.id, token);
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const moveItem = async (
    item,
    direction,
    userId,
    tarefas,
    setDias,
    dias,
    diaVisualizado
  ) => {
    //Tarefas
    const tarefasGerais = await getListaTarefas(userId);

    const indexGeral = tarefasGerais.findIndex(
      (tarefa) => tarefa.id === item.id
    );
    if (indexGeral < 0) return;

    const newIndexGeral = indexGeral + direction;
    if (newIndexGeral >= 0 && newIndexGeral < tarefasGerais.length) {
      const tempGeral = tarefasGerais[indexGeral];
      tarefasGerais[indexGeral] = tarefasGerais[newIndexGeral];
      tarefasGerais[newIndexGeral] = tempGeral;

      await substituirTarefasGerais(userId, tarefasGerais);
    }

    //Dias
    const diasAtualizados = atualizarDias(
      dias,
      diaVisualizado,
      "mover",
      item,
      direction
    );

    atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);
  };

  const handleToggleCheckTarefa = async (tarefa) => {
    const token = localStorage.getItem("token");
    console.log("[handleToggleCheckTarefa] Iniciando:", tarefa);

    const isCompleted = !!tarefa.tarefaId;

    const tarefaId = tarefa.tarefaId || tarefa.id;
    const dayId = diaVisualizado?.id;

    if (!token || !tarefaId || !dayId) {
      console.error(
        "[handleToggleCheckTarefa] Token, tarefaId ou dayId ausente"
      );
      return;
    }

    const dto = { tarefaId, dayId };

    if (isCompleted) {
      // === Desmarcar tarefa ===
      console.log("[handleToggleCheckTarefa] Desmarcando tarefa concluída");

      setCompletedTasks((prev) => prev.filter((t) => t.id !== tarefa.id));

      try {
        const { score } = await uncheckTarefa(dto, token);
        setPontuacoes((prev) =>
          atualizarPontuacoesLocais(prev, score, tarefa, isCompleted)
        );

        console.log("[handleToggleCheckTarefa] Tarefa desmarcada com sucesso");
      } catch (err) {
        console.error("[handleToggleCheckTarefa] Erro ao desmarcar:", err);
      }
    } else {
      // === Marcar tarefa como concluída ===
      console.log("[handleToggleCheckTarefa] Marcando tarefa como concluída");

      try {
        const completedTaskResponse = await checkTarefa(dto, token);
        const { completedTask, score } = completedTaskResponse;

        setCompletedTasks((prev) => [...prev, completedTask]);

        setPontuacoes((prev) =>
          atualizarPontuacoesLocais(prev, score, tarefa, isCompleted)
        );

        console.log(
          "[handleToggleCheckTarefa] Tarefa marcada com sucesso:",
          completedTaskResponse
        );
      } catch (err) {
        console.error("[handleToggleCheckTarefa] Erro ao marcar:", err);
      }
    }
  };

  const atualizarPontuacoesLocais = (
    prevPontuacoes,
    score,
    tarefa,
    isCompleted
  ) => {
    if (!score) {
      return prevPontuacoes.filter(
        (s) =>
          !(
            s.areaId === tarefa.areaId &&
            s.subareaId === tarefa.subareaId &&
            s.date === tarefa.date
          )
      );
    }

    const existente = prevPontuacoes.find(
      (s) =>
        s.areaId === score.areaId &&
        s.subareaId === score.subareaId &&
        s.date === score.date
    );

    if (existente) {
      return prevPontuacoes.map((s) =>
        s.scoreId === score.scoreId ? { ...s, score: score.score } : s
      );
    } else {
      return [...prevPontuacoes, score];
    }
  };

  const handleSave = async (item: ItemResponse | CompletedTaskResponseDTO) => {
    const token = localStorage.getItem("token");
    const id = item.id;

    const pertenceAoDia =
      "daysOfTheWeek" in item && diaVisualizado
        ? item.daysOfTheWeek.includes(diaVisualizado.dayOfWeek)
        : true;

    let novasTarefasLocais;

    if (pertenceAoDia) {
      novasTarefasLocais = tarefas.map((t) =>
        t.id === id ? { ...t, ...item } : t
      );
    } else {
      novasTarefasLocais = tarefas.filter((t) => t.id !== id);
    }

    setTarefasDoDia(novasTarefasLocais);

    try {
      const resposta = await updateTarefa(id, item, diaVisualizado?.id, token);
      console.log("Tarefa atualizada com sucesso:", resposta);
    } catch (err) {
      console.error("Erro ao atualizar tarefa:", err);
    }
  };

  const tarefasNaoConcluidas = tarefas.filter(
    (tarefa) => !completedTasks.some((ct) => ct.tarefaId === tarefa.id)
  );

  return (
    <Box pb={20}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Tarefas
      </Text>
      <HStack {...hStackProps}>
        <Button
          size="xs"
          variant="outline"
          onClick={() => resetarListaDeTarefasGerais(user.id)}
          colorPalette="red"
        >
          Resetar Lista de Tarefas Gerais
        </Button>
        <Input
          type="text"
          value={nomeNovaTarefa}
          onChange={(e) => setNomeNovaTarefa(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddItem();
            }
          }}
          placeholder="Digite o nome da tarefa"
          width="200px"
        />
        <Button size="xs" onClick={handleAddItem}>
          Adicionar Tarefa
        </Button>
      </HStack>
      {tarefasNaoConcluidas.length === 0 ? (
        <EmptyStateTasks
          tipo={tarefas.length === 0 ? "nenhumaCriada" : "todasConcluidas"}
        />
      ) : (
        <ul>
          {tarefasNaoConcluidas.map((tarefa, index) => (
            <li key={tarefa.id}>
              {tarefa && (
                <ItemLista<ItemResponse>
                  listas={[]}
                  user={user}
                  item={tarefa}
                  index={index}
                  lista={tarefas}
                  onEdit={() => setItemEditando(tarefa)}
                  onDelete={() => handleDeleteItem(tarefa)}
                  onToggle={() => handleToggleCheckTarefa(tarefa)}
                  onMove={(item, direction) =>
                    moveItem(
                      item,
                      direction,
                      user.id,
                      tarefas,
                      setDias,
                      dias,
                      diaVisualizado
                    )
                  }
                  onSave={handleSave}
                  areas={areas}
                  isTarefas={true}
                  setItems={setTarefasDoDia}
                  dias={dias}
                  setDias={setDias}
                  diaVisualizado={diaVisualizado}
                  setPontuacoes={setPontuacoes}
                />
              )}

              {itemEditando && itemEditando === tarefa && (
                <EditorItem
                  item={itemEditando}
                  setItemEditando={setItemEditando}
                  onSave={handleSave}
                  areas={areas}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      <Heading mt="6" mb="3">
        Finalizadas
      </Heading>
      {completedTasks.length === 0 ? (
        <EmptyStateTasks tipo="nenhumaFinalizada" />
      ) : (
        <ul>
          {completedTasks.map((tarefa, index) => (
            <li key={tarefa.id}>
              <ItemLista<CompletedTaskResponseDTO>
                listas={[]}
                user={user}
                item={tarefa}
                index={index}
                lista={completedTasks}
                onEdit={() => setItemEditando(tarefa)}
                onDelete={() => handleDeleteItem(tarefa)}
                onToggle={() => handleToggleCheckTarefa(tarefa)}
                onMove={(item, direction) =>
                  moveItem(
                    item,
                    direction,
                    user.id,
                    tarefas,
                    setDias,
                    dias,
                    diaVisualizado
                  )
                }
                onSave={handleSave}
                areas={areas}
                isTarefas={true}
                setItems={
                  setCompletedTasks as Dispatch<
                    SetStateAction<(CompletedTaskResponseDTO)[]>
                  >
                }
                dias={dias}
                setDias={setDias}
                diaVisualizado={diaVisualizado}
                setPontuacoes={setPontuacoes}
              />

              {itemEditando && itemEditando === tarefa && (
                <EditorItem
                  item={itemEditando}
                  setItemEditando={setItemEditando}
                  onSave={handleSave}
                  areas={areas}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
}

export default ListaTarefas;
