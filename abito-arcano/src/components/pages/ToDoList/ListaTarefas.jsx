import React, { useState, useEffect } from "react";
import Tarefa from "./Tarefa.jsx";
import EditorItem from "../../EditorItem.jsx";
import {
  addItem,
  updateItem,
  toggleFinalizada,
  deleteItem,
  atualizarDiasLocalmenteENoFirebase,
  atualizarDias,
} from "../../todoUtils.js";
import {
  getListaTarefas,
  substituirTarefasGerais,
} from "../../../auth/firebaseTarefas.js";
import { getDias, inserirDias } from "../../../auth/firebaseDiasHoras.js";
import ItemLista from "../../Listas/ItemLista.jsx";
import { Button, Heading, HStack, Input, Text } from "@chakra-ui/react";

function ListaTarefas({
  user,
  tarefas,
  setPontuacoes,
  setDias,
  dias,
  areas,
  diaVisualizado,
}) {
  const [nomeNovaTarefa, setNomeNovaTarefa] = useState("");
  const [itemEditando, setItemEditando] = useState(null);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO lusta tarefas - dias:");
    console.log(dias);
    console.log("Estado atualizadOOOOOO lusta tarefas - tarefas:");
    console.log(tarefas);
  }, [tarefas]);

  const resetarListaDeTarefasGerais = async (userId) => {
    try {
      const tarefasVazias = [];
      await substituirTarefasGerais(userId, tarefasVazias);
////setTarefas(tarefasVazias)

      const dias = await getDias(userId);

      console.log("dias");
      console.log(dias);

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

      //setTarefasPorDia({});

      return { tarefas: tarefasVazias, dias: diasAtualizados };
    } catch (error) {
      console.error("Erro ao resetar lista de tarefas gerais:", error);
      throw error;
    }
  };

  const handleAdicionarItem = async () => {
    if (nomeNovaTarefa.trim() === "") return;

    addItem(
      nomeNovaTarefa,
      "tarefa",
      null,
      tarefas,
      user.uid,
      areas,
      setDias,
      dias,
      diaVisualizado
    );

    setNomeNovaTarefa("");
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

      await substituirTarefasGerais(userId, tarefasGerais);//Dias

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

  const encontrarItemEExecutar = async (
    item,
    items,
    setItems,
    setPontuacoes,
    userId,
    dataPontuacao,
    dias,
    setDias
  ) => {
    if (item.tipo === "tarefa") {
      await toggleFinalizada(
        item.id,
        item.tipo,
        items,
        setItems,
        setPontuacoes,
        userId,
        dataPontuacao,
        dias,
        setDias
      );
    }
  };

  const handleSave = async (
    id,
    nome,
    numero,
    area,
    subarea,
    areaId,
    subareaId,
    diasSemana,
    tipo
  ) => {
    await updateItem(
      id,
      nome,
      numero,
      area,
      subarea,
      areaId,
      subareaId,
      tipo,
      null,
      tarefas,
      user.uid,
      setDias,
      dias,
      diasSemana,
      diaVisualizado
    );
  };

  return (
    <div>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Tarefas
      </Text>
      <HStack spacing={4} align="center" mb={4}>
        <Button
          size="xs"
          variant="outline"
          onClick={() => resetarListaDeTarefasGerais(user.uid)}
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
              handleAdicionarItem();
            }
          }}
          placeholder="Digite o nome da tarefa"
          width="200px"
        />
        <Button size="xs" onClick={handleAdicionarItem}>
          Adicionar Tarefa
        </Button>
      </HStack>

      <ul>
        {tarefas
          .filter((tarefa) => !tarefa.finalizada)
          .map((tarefa, index) => (
            <li key={tarefa.id}>
              {tarefa && (
                <ItemLista
                  user={user}
                  item={tarefa}
                  index={index}
                  lista={tarefas}
                  onEdit={() => setItemEditando(tarefa)}
                  onDelete={() =>
                    deleteItem(
                      tarefa,
                      "tarefa",
                      null,
                      tarefas,
                      user.uid,
                      setDias,
                      dias,
                      diaVisualizado
                    )
                  }
                  onToggle={() =>
                    encontrarItemEExecutar(
                      tarefa,
                      tarefas,
                      null,
                      setPontuacoes,
                      user.uid,
                      diaVisualizado,
                      dias,
                      setDias
                    )
                  }
                  onMove={(item, direction) =>
                    moveItem(
                      item,
                      direction,
                      user.uid,
                      tarefas,
                      setDias,
                      dias,
                      diaVisualizado
                    )
                  }
                  areas={areas}
                  isTarefas={true}
                  tarefa={tarefa}
                  setItems={null}
                  dias={dias}
                  setDias={setDias}
                  diaVisualizado={diaVisualizado}
                  setPontuacoes={setPontuacoes}
                />
              )}

              {itemEditando && itemEditando === tarefa && (
                <EditorItem
                  item={itemEditando}
                  tipo={"tarefa"}
                  setItemEditando={setItemEditando}
                  onSave={(
                    nome,
                    numero,
                    area,
                    subarea,
                    areaId,
                    subareaId,
                    diasSemana,
                    tipo
                  ) =>
                    handleSave(
                      itemEditando.id,
                      nome,
                      numero,
                      area,
                      subarea,
                      areaId,
                      subareaId,
                      diasSemana,
                      tipo
                    )
                  }
                  areas={areas}
                />
              )}
            </li>
          ))}
      </ul>

      <Heading mt="6" mb="3">Finalizadas</Heading>
      <ul>
        {tarefas
          .filter((tarefa) => tarefa.finalizada)
          .map((tarefa, index) => (
            <li key={tarefa.id} style={{ textDecoration: "line-through" }}>
              <ItemLista
                  user={user}
                  item={tarefa}
                  index={index}
                  lista={tarefas}
                  onEdit={() => setItemEditando(tarefa)}
                  onDelete={() =>
                    deleteItem(
                      tarefa,
                      "tarefa",
                      null,
                      tarefas,
                      user.uid,
                      setDias,
                      dias,
                      diaVisualizado
                    )
                  }
                  onToggle={() =>
                    encontrarItemEExecutar(
                      tarefa,
                      tarefas,
                      null,
                      setPontuacoes,
                      user.uid,
                      diaVisualizado,
                      dias,
                      setDias
                    )
                  }
                  onMove={(item, direction) =>
                    moveItem(
                      item,
                      direction,
                      user.uid,
                      tarefas,
                      setDias,
                      dias,
                      diaVisualizado
                    )
                  }
                  onSave={(
                    nome,
                    numero,
                    area,
                    subarea,
                    areaId,
                    subareaId,
                    diasSemana
                  ) =>
                    handleSave(
                      itemEditando.id,
                      nome,
                      numero,
                      area,
                      subarea,
                      areaId,
                      subareaId,
                      diasSemana,
                      "tarefa"
                    )
                  }
                  areas={areas}
                  isTarefas={true}
                  tarefa={tarefa}
                  setItems={null}
                  dias={dias}
                  setDias={setDias}
                  diaVisualizado={diaVisualizado}
                  setPontuacoes={setPontuacoes}
                />

              {itemEditando && itemEditando === tarefa && (
                <EditorItem
                  item={itemEditando}
                  tipo={"tarefa"}
                  setItemEditando={setItemEditando}
                  onSave={(
                    nome,
                    numero,
                    area,
                    subarea,
                    areaId,
                    subareaId,
                    diasSemana
                  ) =>
                    handleSave(
                      itemEditando.id,
                      nome,
                      numero,
                      area,
                      subarea,
                      areaId,
                      subareaId,
                      diasSemana,
                      "tarefa"
                    )
                  }
                  areas={areas}
                />
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ListaTarefas;
