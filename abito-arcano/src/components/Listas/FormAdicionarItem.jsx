import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import InputAdicionarNome from "../componentes/inputs/InputAdicionarNome/InputAdicionarNome";
import { buscarIdsAreaESubarea, updateItem } from "../todoUtils";
import {
  Button,
  NativeSelectField,
  NativeSelectRoot,
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  HStack,
} from "@chakra-ui/react";

const FormAdicionarItem = ({
  user,
  listas,
  lista,
  setListasLocal,
  updateListas,
  listaAninhada = null,
  isTarefas = false, // Flag para determinar o ambiente
  tarefa,
  setItems,
  dias,
  setDias,
  diaVisualizado,
  areas,
}) => {
  const [nomeNovoItem, setNomeNovoItem] = useState("");
  const [tipoItem, setTipoItem] = useState("checklist");

  const addNestedItemToTask = (tarefa, targetId, novoItem) => {
    if (tarefa.id === targetId) {
      return {
        ...tarefa,
        itens: [...(tarefa.itens || []), novoItem],
      };
    }

    if (tarefa.itens && tarefa.itens.length > 0) {
      const itensAtualizados = tarefa.itens.map((subItem) =>
        addNestedItemToTask(subItem, targetId, novoItem)
      );

      return {
        ...tarefa,
        itens: itensAtualizados,
      };
    }

    return tarefa;
  };

  const addItemToList = (lista, targetId, novoItem) => {
    if (lista.id === targetId) {
      return {
        ...lista,
        itens: [...(lista.itens || []), novoItem],
      };
    }

    if (lista.itens && lista.itens.length > 0) {
      return {
        ...lista,
        itens: lista.itens.map((subItem) =>
          addItemToList(subItem, targetId, novoItem)
        ),
      };
    }

    return lista;
  };

  const handleAddItem = async () => {
    if (nomeNovoItem.trim()) {
      const { areaId, subareaId } = await buscarIdsAreaESubarea(
        areas,
        "SEM CATEGORIA",
        ""
      );

      const novoChecklistItem = {
        id: uuidv4(),
        nome: nomeNovoItem,
        numero: 1,
        area: "SEM CATEGORIA",
        subarea: "",
        areaId,
        subareaId,
        diasSemana: [1, 2, 3, 4, 5, 6, 7],
        finalizada: tipoItem === "checklist" || "tarefa" ? false : undefined,
        tipo: isTarefas ? "tarefa" : tipoItem,
        itens: tipoItem === "lista" ? [] : null,
      };

      const novoItem = {
        //
      };

      if (isTarefas) {
        console.log("lista daqui");
        console.log(lista);

        console.log("tarefa");
        console.log(tarefa);
        const tarefaAtualizada = addNestedItemToTask(
          tarefa,
          tarefa.id,
          novoChecklistItem
        );

        console.log("tarefaAtualizada");
        console.log(tarefaAtualizada);
        await updateItem(
          tarefaAtualizada.id,
          tarefaAtualizada.nome,
          tarefaAtualizada.numero,
          tarefaAtualizada.area,
          tarefaAtualizada.subarea,
          tarefaAtualizada.areaId,
          tarefaAtualizada.subareaId,
          tarefaAtualizada.tipo,
          setItems,
          lista,
          user.uid,
          setDias,
          dias,
          tarefaAtualizada.diasSemana,
          diaVisualizado,
          tarefaAtualizada
        );
      } else if (listas) {
        let listaAtualizada;

        if (listaAninhada) {
          listaAtualizada = addItemToList(
            lista,
            listaAninhada.id,
            novoChecklistItem
          );
        } else {
          listaAtualizada = addItemToList(lista, lista.id, novoChecklistItem);
        }

        console.log("Lista Principal Atualizada:", listaAtualizada);

        updateListas(user.uid, lista, listas, setListasLocal, listaAtualizada);
      }

      setNomeNovoItem("");
    }
  };

  return (
    <HStack spacing={3} align="stretch" width="100%" alignItems="center">
      <InputAdicionarNome
        placeholder="Adicionar item"
        nomeNovo={nomeNovoItem}
        setNomeNovo={setNomeNovoItem}
        handleAddItem={handleAddItem}
      />

      <NativeSelectRoot size="sm" width="140px">
        <NativeSelectField onChange={(e) => setTipoItem(e.target.value)}>
          <option value="tarefa">Tarefa</option>
          <option value="checklist">Checklist</option>
          <option value="paragrafo">Parágrafo</option>
          <option value="lista">Lista</option>
        </NativeSelectField>
      </NativeSelectRoot>

      <Button onClick={handleAddItem} size="xs">
        Adicionar Item
      </Button>
    </HStack>
  );
};

export default FormAdicionarItem;
