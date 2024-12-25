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

  const { areaId, subareaId } = await buscarIdsAreaESubarea(areas, "SEM CATEGORIA", "");

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
    diasSemana: [0, 1, 2, 3, 4, 5, 6],
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

    const tarefasAtualizadas = await atualizarTarefasGerais(novoItem, items, userId, "adicionar")
    atualizarTarefasLocalmenteENoFirebase(userId, tarefasAtualizadas, setItems);

    const diasAtualizados = atualizarDias(
      dias,
      diaVisualizado,
      'adicionar',
      novoItem
    )

    await atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias)

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
  diaVisualizado
) => {
  if (tipo === "tarefa") {
    const itemAtualizado = {
      id,
      nome,
      numero,
      area,
      subarea,
      areaId,
      subareaId,
      diasSemana,
    };

    console.log("itemAtualizado");
    console.log(itemAtualizado);

    const tarefasAtualizadas = await atualizarTarefasGerais(itemAtualizado, items, userId, "atualizar")
    //atualizarTarefasLocalmenteENoFirebase(userId, tarefasAtualizadas, setItems);

    const diasAtualizados = atualizarDias(
      dias,
      diaVisualizado,
      'atualizar',
      itemAtualizado
    )

    console.log("diasAtualizados nosaaa");
    console.log(diasAtualizados);

    //await atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias)

   
  } else if (tipo === "atividade") {
    console.log("else, sou atividade");

    const atividadesAtualizadas = items.map((atividade) =>
      atividade.id === id
        ? { ...atividade, nome, numero, area, subarea, areaId, subareaId }
        : atividade
    );

    console.log("atividadesAtualizadas");
    console.log(atividadesAtualizadas);

    await setListaAtividades(userId, atividadesAtualizadas);

    setItems(atividadesAtualizadas);
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
   
    const tarefasAtualizadas = await atualizarTarefasGerais(item, items, userId, "excluir")
    console.log("tarefasAtualizadas")
    console.log(tarefasAtualizadas)
    atualizarTarefasLocalmenteENoFirebase(userId, tarefasAtualizadas, setItems);

    const diasAtualizados = atualizarDias(
      dias,
      diaVisualizado,
      "excluir",
      item
    )

    await atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias)

  } else if (tipo === "atividade") {
    const atividadesAtualizadas = items.filter((atividade) => atividade.id !== item.id);
    setItems(atividadesAtualizadas);
    await setListaAtividades(userId, atividadesAtualizadas);
  }
};

const atualizarDias = (dias, diaVisualizado, operacao, item) => {
  const [diaVisStr, mesVisStr, anoVisStr] = diaVisualizado.split("/");
  const dataVisualizada = new Date(`${anoVisStr}-${mesVisStr}-${diaVisStr}`);
  dataVisualizada.setHours(0, 0, 0, 0); 

  //const diasSemanaSet = new Set(item.diasSemana.map((dia) => dia.toLowerCase()));
  const diasSemanaSet = new Set(item.diasSemana);

  console.log("diasSemanaSet")
  console.log(diasSemanaSet)

  return dias.map((dia) => {
    const [diaStr, mesStr, anoStr] = dia.data.split("/");
    const dataDia = new Date(`${anoStr}-${mesStr}-${diaStr}`);
    dataDia.setHours(0, 0, 0, 0);

    if (dataDia >= dataVisualizada) {
      if (operacao === "adicionar") {
        return {
          ...dia,
          tarefas: [...dia.tarefas, item],
        };
      } else if (operacao === "atualizar") {
        // Obter o dia da semana como string (em português)
        //const diaSemana = dataDia.toLocaleString("pt-BR", { weekday: "long" }).toLowerCase();
        const diaSemana = dataDia.getDay(); // Obtém o número do dia da semana (0 a 6)

        console.log("diaSemana DO DIA")
  console.log(diaSemana)

        // Atualizar tarefas, filtrando e adicionando conforme o array diasSemana
        const tarefasAtualizadas = dia.tarefas
          .filter(
            (tarefa) =>
              tarefa.id !== item.id || diasSemanaSet.has(diaSemana) // Manter apenas tarefas do dia ou aquelas que pertencem ao dia da semana
          )
          .map((tarefa) => (tarefa.id === item.id ? item : tarefa)); // Atualizar a tarefa se ela já existir

        // Adicionar a tarefa se ela não está presente e pertence ao dia da semana
        if (diasSemanaSet.has(diaSemana) && !tarefasAtualizadas.some((tarefa) => tarefa.id === item.id)) {
          tarefasAtualizadas.push(item);
        }

        return {
          ...dia,
          tarefas: tarefasAtualizadas,
        };
      } else if (operacao === "excluir") {
        return {
          ...dia,
          tarefas: dia.tarefas.filter((tarefa) => tarefa.id !== item.id),
        };
      }
    }
    return dia;
  });
};


const atualizarTarefasGerais = async (item, items, userId, operacao) => {

  console.log("operacao")
  console.log(operacao)

  let tarefasGerais = await getListaTarefas(userId);

    console.log("tarefasGerais");
    console.log(tarefasGerais);

  switch (operacao) {
    case "adicionar":
      tarefasGerais = [...items, item];
      break;

    case "atualizar":
      tarefasGerais = items.map((tarefa) =>
        tarefa.id === item.id ? item : tarefa
      );
      break;

    case "excluir":
      tarefasGerais = items.filter((tarefa) => tarefa.id !== item.id);
      break;

    default:
      throw new Error("Operação inválida. Use 'add', 'update' ou 'delete'.");
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

  setDias(diasAtualizados);

  const diasSimplificados = diasAtualizados.map((dia) => ({
    ...dia,
    tarefas: dia.tarefas.map((tarefa) => ({
      id: tarefa.id,
      finalizada: tarefa.finalizada || false,
    })),
  }));

  console.log(
    "atualizarDiasLocalmenteENoFirebase - Dias simplificados para o Firebase:",
    diasSimplificados
  );

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
  setDias
) => {
  console.log("togglou");
  const item = items.find((i) => i.id === id);
  if (item) {
    console.log("togglefinalizada");
    const finalizada = !item.finalizada;
    const atualizacaoPontuacao = finalizada ? item.numero : -item.numero;
    //const diaVisualizado = new Date().toLocaleDateString('pt-BR');
    console.log("dataPontuacao");
    console.log(dataPontuacao);

    console.log("id");
    console.log(id);
    console.log("item");
    console.log(item);

    console.log("id");
    console.log(id);

    if (tipo === "tarefa") {
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
    } else if (tipo === "atividade") {
      const atividadesAtualizadas = items.map((i) =>
        i.id === id ? { ...i, finalizada } : i
      );
      setItems(atividadesAtualizadas);

      console.log("atividade else");
      console.log("atividadesAtualizadas");
      console.log(atividadesAtualizadas);

      await setListaAtividades(userId, atividadesAtualizadas);
    }

    console.log("item.areaId");

    console.log(item.areaId);

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
  }
};
