import {
  updatePontuacao
} from '../auth/firebasePontuacoes';
import {
  addAtividade,
  updateAtividade,
  deleteAtividade
} from '../auth/firebaseAtividades';

import {
  updateTarefa,
  deleteTarefa
} from '../auth/firebaseTarefas';
import { inserirDias } from '../auth/firebaseDiasHoras';
import { getListaTarefas, substituirTarefasGerais } from '../auth/firebaseTarefas';

const buscarIdsAreaESubarea = (areas, areaNome, subareaNome) => {
  let areaId = null;
  let subareaId = null;

  console.log("areas")
  console.log(areas)
  console.log("areaNome")
  console.log(areaNome)
  console.log("subareaNome")
  console.log(subareaNome)

  const areaEncontrada = areas.find(area => area.nome === areaNome);
  if (areaEncontrada) {
    areaId = areaEncontrada.id;

    console.log("areaEncontrada")
    console.log(areaEncontrada)
    console.log("areaId")
    console.log(areaId)

    const subareaEncontrada = areaEncontrada.subareas.find(subarea => subarea.nome === subareaNome);
    console.log("subareaEncontrada")
    console.log(subareaEncontrada)
    if (subareaEncontrada) {
      console.log(" if (subareaEncontrada)")
      subareaId = subareaEncontrada.id;
      console.log("subareaId")
      console.log(subareaId)
    }
  }

  return { areaId, subareaId };
};


export const addItem = async (nome, tipo, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia, areas) => {
  if (nome.trim() === '') return;

  const novoItem = { nome, numero: 0, area: 'Sem Categoria', subarea: '', finalizada: false };
  const novoItemComId = { ...novoItem, id: items.length > 0 ? items[items.length - 1].id + 1 : 1 };

  if (tipo === 'atividade') {
    await addAtividade(novoItem);
  }

  setItems([...items, novoItemComId]);

  if (tipo === 'tarefa') {
    const { areaId, subareaId } = buscarIdsAreaESubarea(areas, novoItem.area, novoItem.subarea);
    const novoItemComIds = { ...novoItemComId, areaId, subareaId };

    await atualizarTarefasEDias(novoItemComIds, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia, false);
  }
};


export const updateItem = async (id, nome, numero, area, subarea, areaId, subareaId, tipo, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia, areas) => {
  if (tipo === 'tarefa') {
    const itemAtualizado = { id, nome, numero, area, subarea, areaId, subareaId };
    console.log("itemAtualizado")
    console.log(itemAtualizado)
    await atualizarTarefasEDias(itemAtualizado, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia, true);
  } else {
    const itemAtualizado = { id, nome, numero, area, subarea };
    const itensAtualizados = items.map(item => item.id === id ? { ...item, nome, numero, area, subarea } : item);
    setItems(itensAtualizados);
    await updateAtividade(id, { nome, numero, area, subarea });
  }
};



const atualizarTarefasEDias = async (item, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia, isUpdate = false) => {
  
  console.log("item")
  console.log(item)
  

  let novasTarefas;
  if (isUpdate) {
    console.log("if")
    const tarefasGerais = await getListaTarefas(userId);
    novasTarefas = tarefasGerais.map(tarefa =>
      tarefa.id === item.id 
        ? { ...tarefa, nome: item.nome, numero: item.numero, area: item.area, subarea: item.subarea, areaId: item.areaId, subareaId: item.subareaId } 
        : tarefa
    );
  } else {
    console.log("else")
    novasTarefas = [...items, item];
  }
  console.log("novasTarefas do atualizar dias e tarefas")
  console.log(novasTarefas)
  await substituirTarefasGerais(userId, novasTarefas);

  const tarefasPorDiaAtualizadas = {};
  dias.forEach(dia => {
    if (isUpdate) {
      tarefasPorDiaAtualizadas[dia.data] = (tarefasPorDia[dia.data] || []).map(tarefa =>
        tarefa.id === item.id 
          ? { ...tarefa, nome: item.nome, numero: item.numero, area: item.area, subarea: item.subarea, areaId: item.areaId, subareaId: item.subareaId } 
          : tarefa
      );
    } else {
      tarefasPorDiaAtualizadas[dia.data] = [...(tarefasPorDia[dia.data] || []), item];
    }
  });
  setTarefasPorDia(tarefasPorDiaAtualizadas);

  const diaAtual = dias.find(dia => dia.dataAtual);
  const dataAtual = new Date(diaAtual.data.split('/').reverse().join('-')).toISOString().split('T')[0];

  const diasAtualizados = dias.map(dia => {
    const diaData = new Date(dia.data.split('/').reverse().join('-')).toISOString().split('T')[0];
    if (diaData >= dataAtual) {
      const tarefasAtualizadasDia = isUpdate
        ? dia.tarefas.map(tarefa => 
          tarefa.id === item.id 
            ? { ...tarefa, nome: item.nome, numero: item.numero, area: item.area, subarea: item.subarea, areaId: item.areaId, subareaId: item.subareaId } 
            : tarefa
        )
        : [...dia.tarefas, item];
      return { ...dia, tarefas: tarefasAtualizadasDia };
    }
    return dia;
  });

  await inserirDias({ userId, dias: diasAtualizados });
  setDias(diasAtualizados);

  console.log("Dias atualizados localmente e no Firebase");
  console.log(diasAtualizados);

  const itensAtualizados = isUpdate
    ? items.map(itemAtual => itemAtual.id === item.id ? { ...itemAtual, nome: item.nome, numero: item.numero, area: item.area, subarea: item.subarea } : itemAtual)
    : [...items, item];
  setItems(itensAtualizados);
};










export const toggleFinalizada = async (id, tipo, items, setItems, setPontuacoes, userId) => {
  const item = items.find(i => i.id === id);
  if (item) {
    const finalizada = !item.finalizada;
    const atualizacaoPontuacao = finalizada ? item.numero : -item.numero;
    const dataAtual = new Date().toLocaleDateString('pt-BR');

    if (tipo === 'tarefa') {
      await updateTarefa(id, { ...item, finalizada });
    } else {
      await updateAtividade(id, { ...item, finalizada });
    }

    console.log("item")
    console.log(item)
    console.log("userId")
    console.log(userId)
    /*console.log("dataAtual")
    console.log(dataAtual)
    console.log("item.areaId")
    console.log(item.areaId)
    console.log("item.subareaId")
    console.log(item.subareaId)
    console.log("atualizacaoPontuacao")
    console.log(atualizacaoPontuacao)*/

    //await updatePontuacao(item.areaId, atualizacaoPontuacao, dataAtual, item.subareaId);
    await updatePontuacao(userId, item.areaId, item.subareaId, atualizacaoPontuacao, dataAtual);

    const itensAtualizados = items.map(i => i.id === id ? { ...i, finalizada } : i);

    console.log("itensAtualizados")
    console.log(itensAtualizados)

    setItems(itensAtualizados);

    setPontuacoes(prev => {
      const novaPontuacao = {
        data: dataAtual,
        pontos: atualizacaoPontuacao,
        subareaId: item.subareaId,
      };

      const areaPontuacoes = prev[item.areaId] ? [...prev[item.areaId], novaPontuacao] : [novaPontuacao];

      const subareaPontuacoes = item.subareaId
        ? { [item.subareaId]: [...(prev[item.subareaId] || []), novaPontuacao] }
        : {};

      return {
        ...prev,
        [item.areaId]: areaPontuacoes,
        ...subareaPontuacoes,
      };
    });
  }
};


export const deleteItem = async (id, tipo, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia) => {
  if (tipo === 'tarefa') {
    const tarefasAtualizadas = items.filter(item => item.id !== id);
    setItems(tarefasAtualizadas);

    const tarefasPorDiaAtualizadas = {};
    dias.forEach(dia => {
      tarefasPorDiaAtualizadas[dia.data] = (tarefasPorDia[dia.data] || []).filter(tarefa => tarefa.id !== id);
    });
    setTarefasPorDia(tarefasPorDiaAtualizadas);

    const diasAtualizados = dias.map(dia => ({
      ...dia,
      tarefas: dia.tarefas.filter(tarefa => tarefa.id !== id)
    }));

    await substituirTarefasGerais(userId, tarefasAtualizadas);
    await inserirDias({ userId, dias: diasAtualizados });

    setDias(diasAtualizados);
  } else {
    await deleteAtividade(id);
    setItems(items.filter(item => item.id !== id));
  }
};

