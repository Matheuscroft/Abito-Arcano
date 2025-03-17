import { updatePontuacao } from "../auth/firebasePontuacoes.js";
import {
  getListaAtividades,
  setListaAtividades,
} from "../auth/firebaseAtividades.js";
import { v4 as uuidv4 } from "uuid";

import { inserirDias } from "../auth/firebaseDiasHoras.js";
import {
  getListaTarefas,
  substituirTarefasGerais,
} from "../auth/firebaseTarefas.js";

export const buscarIdsAreaESubarea = (areas, areaNome, subareaNome) => {
  let areaId = null;
  let subareaId = null;

  const areaEncontrada = areas.find((area) => area.nome === areaNome);
  if (areaEncontrada) {
    areaId = areaEncontrada.id;

    const subareaEncontrada = areaEncontrada.subareas.find(
      (subarea) => subarea.nome === subareaNome
    );

    if (subareaEncontrada) {
      subareaId = subareaEncontrada.id;
    }
  }

  return { areaId, subareaId };
};

export const addItem = async (
  nome,
  tipo,
  setItems,
  items,
  userId,
  areas,
  setDias,
  dias,
  diaVisualizado
) => {
  if (nome.trim() === "") return;

  const { areaId, subareaId } = await buscarIdsAreaESubarea(
    areas,
    "SEM CATEGORIA",
    ""
  );

  console.log("ADD ITEM");
  const novoItem = {
    id: uuidv4(),
    nome,
    numero: 1,
    area: "SEM CATEGORIA",
    subarea: "",
    areaId,
    subareaId,
    finalizada: false,
    diasSemana: [1, 2, 3, 4, 5, 6, 7],
    tipo: "tarefa",
  };

  if (tipo === "atividade") {
    const atividadesData = await getListaAtividades(userId);
    const atividadesArray = atividadesData.atividades || [];
    atividadesArray.push(novoItem);

    console.log("Novasatividades");
    console.log(atividadesArray);

    await setListaAtividades(userId, atividadesArray);
    setItems(atividadesArray);
  } else if (tipo === "tarefa") {
    const tarefasAtualizadas = await atualizarTarefasGerais(
      novoItem,
      userId,
      "adicionar"
    );

    console.log("tarefasAtualizadas add item");
    console.log(tarefasAtualizadas);

    atualizarTarefasLocalmenteENoFirebase(userId, tarefasAtualizadas, setItems);

    const diasAtualizados = atualizarDias(
      dias,
      diaVisualizado,
      "adicionar",
      novoItem
    );

    console.log("diasAtualizados add item");
    console.log(diasAtualizados);

    await atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);
  }
};

export const updateItem = async (
  id,
  nome,
  numero,
  area,
  subarea,
  areaId,
  subareaId,
  tipo,
  setItems,
  items,
  userId,
  setDias,
  dias,
  diasSemana,
  diaVisualizado,
  tarefa
) => {

  console.log("teste");
  console.log(id);
  if (tipo === "atividade") {
    console.log("else, sou atividade");

    const atividadesAtualizadas = items.map((atividade) =>
      atividade.id === id
        ? { ...atividade, nome, numero, area, subarea, areaId, subareaId, tipo }
        : atividade
    );

    console.log("atividadesAtualizadas");
    console.log(atividadesAtualizadas);

    await setListaAtividades(userId, atividadesAtualizadas);

    setItems(atividadesAtualizadas);
  } else {
    let itemAtualizado = {
      id,
      nome,
      numero,
      area,
      subarea,
      areaId,
      subareaId,
      diasSemana,
      tipo,
    };

    console.log("tarefa recebida");
    console.log(tarefa);

    if (tarefa) {
      itemAtualizado = { ...tarefa };
    }

    console.log("itemAtualizado");
    console.log(itemAtualizado);

    const tarefasAtualizadas = await atualizarTarefasGerais(
      itemAtualizado,
      userId,
      "atualizar"
    );
    atualizarTarefasLocalmenteENoFirebase(userId, tarefasAtualizadas, setItems);

    const diasAtualizados = atualizarDias(
      dias,
      diaVisualizado,
      "atualizar",
      itemAtualizado
    );

    console.log("diasAtualizados nosaaa");
    console.log(diasAtualizados);

    await atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);
  }
};

export const deleteItem = async (
  item,
  tipo,
  setItems,
  items,
  userId,
  setDias,
  dias,
  diaVisualizado
) => {
  if (tipo === "tarefa") {
    const tarefasAtualizadas = await atualizarTarefasGerais(
      item,
      userId,
      "excluir"
    );
    console.log("tarefasAtualizadas");
    console.log(tarefasAtualizadas);
    atualizarTarefasLocalmenteENoFirebase(userId, tarefasAtualizadas, setItems);

    const diasAtualizados = atualizarDias(
      dias,
      diaVisualizado,
      "excluir",
      item
    );

    await atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);
  } else if (tipo === "atividade") {
    const atividadesAtualizadas = items.filter(
      (atividade) => atividade.id !== item.id
    );
    setItems(atividadesAtualizadas);
    await setListaAtividades(userId, atividadesAtualizadas);
  }
};

export const atualizarDias = (dias, diaVisualizado, operacao, item, direction = null) => {

  const [diaVisStr, mesVisStr, anoVisStr] = diaVisualizado.split("/");
  const dataVisualizada = new Date(anoVisStr, mesVisStr - 1, diaVisStr);
  dataVisualizada.setHours(0, 0, 0, 0);

  const diasSemanaSet = new Set(item?.diasSemana);

  return dias.map((dia) => {
    const [diaStr, mesStr, anoStr] = dia.data.split("/");
    const dataDia = new Date(anoStr, mesStr - 1, diaStr);
    dataDia.setHours(0, 0, 0, 0);

    if (dataDia >= dataVisualizada) {
      switch (operacao) {
        case "adicionar":
          return {
            ...dia,
            tarefas: [...dia.tarefas, item],
          };

        case "atualizar": {
          const diaSemana = dataDia.getDay() + 1;

          console.log("dataDia DO DIA");
          console.log(dataDia);

          const tarefasAtualizadas = dia.tarefas
            .filter(
              (tarefa) => tarefa.id !== item.id || diasSemanaSet.has(diaSemana)
            )
            .map((tarefa) => (tarefa.id === item.id ? item : tarefa));

          if (
            diasSemanaSet.has(diaSemana) &&
            !tarefasAtualizadas.some((tarefa) => tarefa.id === item.id)
          ) {
            tarefasAtualizadas.push(item);
          }

          const tarefasComHierarquiaAtualizada = findAndUpdateItemInHierarchy(tarefasAtualizadas, item.id, item);

          console.log("tarefasComHierarquiaAtualizada")
          console.log(tarefasComHierarquiaAtualizada)
          return {
            ...dia,
            tarefas: tarefasComHierarquiaAtualizada,
          };
        }

        case "mover": {
          if (!direction) return dia; // Direção deve ser fornecida para mover
          const tarefasNaoFinalizadas = dia.tarefas.filter(
            (tarefa) => !tarefa.finalizada
          );

          const index = tarefasNaoFinalizadas.findIndex(
            (tarefa) => tarefa.id === item.id
          );

          console.log("index da nova");
          console.log(index);

          if (index < 0) return dia; // Item não encontrado

          const newIndex = index + direction;

          if (newIndex >= 0 && newIndex < tarefasNaoFinalizadas.length) {
            // Troca os itens de posição
            const temp = tarefasNaoFinalizadas[index];
            tarefasNaoFinalizadas[index] = tarefasNaoFinalizadas[newIndex];
            tarefasNaoFinalizadas[newIndex] = temp;

            console.log("mover - Tarefas reordenadas:", tarefasNaoFinalizadas);

            // Atualiza as tarefas no dia
            let tarefaNaoFinalizadaIndex = 0;
            const tarefasAtualizadas = dia.tarefas.map((tarefa) => {
              if (tarefa.finalizada) {
                return tarefa;
              }
              const tarefaAtualizada =
                tarefasNaoFinalizadas[tarefaNaoFinalizadaIndex];
              tarefaNaoFinalizadaIndex++;
              return tarefaAtualizada;
            });

            return {
              ...dia,
              tarefas: tarefasAtualizadas,
            };
          }
          return dia;
        }

        case "excluir":
          return {
            ...dia,
            tarefas: dia.tarefas.filter((tarefa) => tarefa.id !== item.id),
          };

        default:
          return dia;
      }
    }
    return dia;
  });
};

const findAndUpdateItemAninhado = (itens, targetId, updatedItem) => {
  return itens.map((item) => {
    if (item.id === targetId) {
      return {
        ...item,
        ...updatedItem,
        itens: item.itens ? findAndUpdateItemAninhado(item.itens, null, updatedItem) : item.itens,
      };
    } else if (item.itens) {
      const updatedSubItems = findAndUpdateItemAninhado(item.itens, targetId, updatedItem);
      return {
        ...item,
        itens: updatedSubItems,
      };
    }
    return item;
  });
};

const findAndUpdateItemInHierarchy = (itens, targetId, updatedItem) => {
  let found = false;

  console.log("targetId do find and update")
  console.log(targetId)

  const updatedItens = itens.map((item) => {
    if (item.id === targetId) {
      console.log("item.id === targetId")
      found = true;
      return updatedItem;
    } else if (item.itens) {
      console.log("else if (item.itens)")
      const updatedSubItems = findAndUpdateItemInHierarchy(item.itens, targetId, updatedItem);
      if (updatedSubItems !== item.itens) {
        found = true;
        return {
          ...item,
          itens: updatedSubItems,
        };
      }
    }
    return item;
  });
  console.log("updatedItens desse carai")
  console.log(updatedItens)
  console.log("itens desse carai")
  console.log(itens)
  return found ? updatedItens : itens;
};

export const atualizarTarefasGerais = async (item, userId, operacao) => {
  console.log("operacao");
  console.log(operacao);

  let tarefasGerais = await getListaTarefas(userId);

  console.log("tarefasGerais");
  console.log(tarefasGerais);

  switch (operacao) {
    case "adicionar":
      tarefasGerais = [...tarefasGerais, item];
      break;

    case "atualizar":
      tarefasGerais = findAndUpdateItemInHierarchy(tarefasGerais, item.id, item);
      break;

    case "excluir":
      tarefasGerais = tarefasGerais.filter((tarefa) => tarefa.id !== item.id);
      break;

    default:
      throw new Error("Operação inválida. Use 'adicionar', 'atualizar' ou 'excluir'.");
  }

  console.log(`Operação: ${operacao}`);
  console.log("Tarefas atualizadas:", tarefasGerais);

  return tarefasGerais;
};

export const atualizarTarefasLocalmenteENoFirebase = async (
  userId,
  tarefasAtualizadas,
  setTarefas
) => {
  //setTarefas(tarefasAtualizadas);
  await substituirTarefasGerais(userId, tarefasAtualizadas);
};

export const atualizarDiasLocalmenteENoFirebase = async (
  userId,
  diasAtualizados,
  setDias
) => {
  console.log(
    "atualizarDiasLocalmenteENoFirebase - Dias antes do setDias:",
    diasAtualizados
  );



   // Filtrar tarefas com ID válido (não undefined ou null)
   const diasFiltrados = diasAtualizados.map((dia) => ({
    ...dia,
    tarefas: dia.tarefas.filter((tarefa) => tarefa.id !== undefined && tarefa.id !== null),
  }));

  console.log(
    "atualizarDiasLocalmenteENoFirebase - Dias filtrados:",
    diasFiltrados
  );


  setDias(diasFiltrados);

 /* const diasSimplificados = diasFiltrados.map((dia) => ({
    ...dia,
    tarefas: dia.tarefas.map((tarefa) => ({
      id: tarefa.id,
      finalizada: tarefa.finalizada || false,
    })),
  }));*/

 const processarItensAninhados = (itens) => {
    return (itens || []).map((item) => ({
      id: item.id,
      finalizada: item.finalizada || false,
      itens: item.itens && item.itens.length > 0 ? processarItensAninhados(item.itens) : [],
    }));
  };

  // Função para processar tarefas corretamente, considerando listas aninhadas
  const processarTarefaParaFirebase = (tarefa) => {

    console.log("tarefa")
    if (tarefa.tipo === "lista") {
      return {
        id: tarefa.id,
        finalizada: tarefa.finalizada || false,
        itens: tarefa.itens && tarefa.itens.length > 0 ? processarItensAninhados(tarefa.itens) : [],
      };
    }
    return {
      id: tarefa.id,
      finalizada: tarefa.finalizada || false,
    };
  };

  // Transformando os dias para o formato correto antes de salvar no Firebase
  const diasSimplificados = diasFiltrados.map((dia) => ({
    ...dia,
    tarefas: dia.tarefas.map(processarTarefaParaFirebase),
  }));

  console.log(
    "atualizarDiasLocalmenteENoFirebase - Dias simplificados para o Firebase:",
    diasSimplificados
  );

  // Verificação final antes de enviar para o Firestore
  diasSimplificados.forEach((dia, diaIndex) => {
    dia.tarefas.forEach((tarefa, tarefaIndex) => {
      if (tarefa.id === undefined || tarefa.id === null) {
        console.error(`Tarefa com ID inválido encontrada no dia ${diaIndex}, tarefa ${tarefaIndex}: ${JSON.stringify(tarefa)}`);
      }
      if (tarefa.itens) {
        tarefa.itens.forEach((subItem, subItemIndex) => {
          if (subItem.id === undefined || subItem.id === null) {
            console.error(`SubItem com ID inválido encontrado no dia ${diaIndex}, tarefa ${tarefaIndex}, subItem ${subItemIndex}: ${JSON.stringify(subItem)}`);
          }
        });
      }
    });
  });

  await inserirDias(userId, diasSimplificados);
};

export const toggleFinalizada = async (
  id,
  tipo,
  items,
  setItems,
  setPontuacoes,
  userId,
  dataPontuacao = "",
  dias,
  setDias,
  listaId = null
) => {
  console.log("togglou");

  console.log("items");
  console.log(items);
  const item = items.find((i) => i.id === id);

  console.log("item");
  console.log(item);
  if (item) {
    console.log("togglefinalizada");
    const finalizada = !item.finalizada;

    //const diaVisualizado = new Date().toLocaleDateString('pt-BR');
    if (tipo === "tarefa" || tipo === "checklist") {
      const diaReferido = dias.find((dia) => dia.data === dataPontuacao);
      if (diaReferido) {
        const tarefasAtualizadas = diaReferido.tarefas.map((tarefa) =>
          tarefa.id === id ? { ...tarefa, finalizada } : tarefa
        );

        const diasAtualizados = dias.map((dia) =>
          dia.data === dataPontuacao
            ? { ...dia, tarefas: tarefasAtualizadas }
            : dia
        );

        atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);
      }
    } else if (tipo === "lista") {
      console.log("tipo === lista");
      const diaReferido = dias.find((dia) => dia.data === dataPontuacao);
      if (diaReferido) {
        const listasAtualizadas = diaReferido.tarefas.map((lista) =>
          lista.id === listaId
            ? { ...lista, itens: findAndToggleItemAninhado(lista.itens, id) }
            : lista
        );

        console.log("listasAtualizadas");
        console.log(listasAtualizadas);

        const diasAtualizados = dias.map((dia) =>
          dia.data === dataPontuacao ? { ...dia, tarefas: listasAtualizadas } : dia
        );

        console.log("diasAtualizados");
        console.log(diasAtualizados);

        atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);
      }
    }
    
    else if (tipo === "atividade") {
      const atividadesAtualizadas = items.map((i) =>
        i.id === id ? { ...i, finalizada } : i
      );
      setItems(atividadesAtualizadas);

      console.log("atividade else");
      console.log("atividadesAtualizadas");
      console.log(atividadesAtualizadas);

      await setListaAtividades(userId, atividadesAtualizadas);
    }

    if (tipo !== "checklist") {
      await atualizarPontuacao(
        userId,
        item,
        finalizada,
        dataPontuacao,
        setPontuacoes
      );
    
    }
  }
};

const atualizarPontuacao = async (
  userId,
  item,
  finalizada,
  dataPontuacao,
  setPontuacoes
) => {
  const atualizacaoPontuacao = finalizada ? item.numero : -item.numero;

  await updatePontuacao(
    userId,
    item.areaId,
    item.subareaId,
    atualizacaoPontuacao,
    dataPontuacao
  );

  setPontuacoes((prev) => {
    const novaPontuacao = {
      data: dataPontuacao,
      pontos: atualizacaoPontuacao,
      subareaId: item.subareaId,
    };

    const dataExistente = prev.find((p) => p.data === dataPontuacao);

    if (dataExistente) {
      const areaExistente = dataExistente.areas.find(
        (a) => a.areaId === item.areaId
      );

      if (areaExistente) {
        const subareaExistente = areaExistente.subareas.find(
          (sa) => sa.subareaId === item.subareaId
        );

        if (subareaExistente) {
          subareaExistente.pontos += atualizacaoPontuacao;
        } else {
          areaExistente.subareas.push({
            subareaId: item.subareaId,
            pontos: atualizacaoPontuacao,
          });
        }

        areaExistente.pontos += atualizacaoPontuacao;
      } else {
        dataExistente.areas.push({
          areaId: item.areaId,
          pontos: atualizacaoPontuacao,
          subareas: [
            {
              subareaId: item.subareaId,
              pontos: atualizacaoPontuacao,
            },
          ],
        });
      }
    } else {
      prev.push({
        data: dataPontuacao,
        areas: [
          {
            areaId: item.areaId,
            pontos: atualizacaoPontuacao,
            subareas: [
              {
                subareaId: item.subareaId,
                pontos: atualizacaoPontuacao,
              },
            ],
          },
        ],
      });
    }

    return [...prev];
  });
};

const findAndToggleItemAninhado = (itens, targetId, toggleState) => {
  return itens.map((item) => {
    if (item.id === targetId) {
      const newFinalizadaState = toggleState !== undefined ? toggleState : !item.finalizada;
      return {
        ...item,
        finalizada: newFinalizadaState,
        itens: item.itens ? findAndToggleItemAninhado(item.itens, null, newFinalizadaState) : item.itens,
      };
    } else if (item.itens) {
      const updatedSubItems = findAndToggleItemAninhado(item.itens, targetId, toggleState);
      const allSubItemsFinalizada = updatedSubItems.every((subItem) => subItem.finalizada);
      return {
        ...item,
        finalizada: allSubItemsFinalizada,
        itens: updatedSubItems,
      };
    }
    return item;
  });
};

