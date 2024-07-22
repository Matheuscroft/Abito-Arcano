import {
  updatePontuacao
} from '../auth/firebasePontuacoes';
import {
  addAtividade,
  updateAtividade,
  deleteAtividade
} from '../auth/firebaseAtividades';

import {
  addTarefa,
  updateTarefa,
  deleteTarefa
} from '../auth/firebaseTarefas';
import { inserirDias } from '../auth/firebaseDiasHoras';
import { getListaTarefas, substituirTarefasGerais } from '../auth/firebaseTarefas';


export const addItem = async (nome, tipo, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia) => {
  if (nome.trim() === '') return;
  const novoItem = { nome, numero: 0, area: 'Sem Categoria', subarea: '', finalizada: false };
  const itemAdicionado = tipo === 'tarefa'
    ? await addTarefa(novoItem, userId)
    : await addAtividade(novoItem);

  setItems([...items, itemAdicionado]);

  if (tipo === 'tarefa') {
    const diaAtual = dias.find(dia => dia.dataAtual);
    if (!diaAtual) {
      console.error("Dia atual não encontrado");
      return;
    }
    const dataAtual = new Date(diaAtual.data.split('/').reverse().join('-')).toISOString().split('T')[0];

    const tarefasPorDiaAtualizadas = {};
    dias.forEach(dia => {
        tarefasPorDiaAtualizadas[dia.data] = [...(tarefasPorDia[dia.data] || []), novoItem];
    });
    setTarefasPorDia(tarefasPorDiaAtualizadas);

    const diasAtualizados = dias.map(dia => {
      console.log("dia");
      console.log(dia);
      const diaData = new Date(dia.data.split('/').reverse().join('-')).toISOString().split('T')[0];;
      console.log("diaData");
      console.log(diaData);
      if (diaData >= dataAtual) {
        return { ...dia, tarefas: [...dia.tarefas, itemAdicionado] };
      }
      return dia;
    });

    await inserirDias({ userId, dias: diasAtualizados });
    setDias(diasAtualizados);

    console.log("Dias atualizados localmente e no Firebase");
    console.log(diasAtualizados);
  }
};


export const updateItem = async (id, nome, numero, area, subarea, tipo, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia) => {

  console.log("id")
  console.log(id)

  console.log("items")
  console.log(items)
  console.log("userId")
  console.log(userId)
  console.log("dias")
  console.log(dias)

  /*const itemAtualizado = tipo === 'tarefa'
      ? await updateTarefa(id, { nome, numero, area, subarea }, userId, dias)
      : await updateAtividade(id, { nome, numero, area, subarea });

  const itensAtualizados = items.map(item => item.id === id ? itemAtualizado : item);*/



  if (tipo === 'tarefa') {
    // 1. Obter a lista de tarefas geral do Firebase.
    const tarefasGerais = await getListaTarefas(userId);
    console.log("dias")
  console.log(dias)

    // 2. Encontrar e substituir a tarefa modificada na lista geral.
    const tarefasAtualizadas = tarefasGerais.map(tarefa => tarefa.id === id ? { ...tarefa, nome, numero, area, subarea } : tarefa);
    console.log("dias")
  console.log(dias)

    // 3. Atualizar a lista geral no Firebase.
    await substituirTarefasGerais(userId, tarefasAtualizadas);

    const diaAtual = dias.find(dia => dia.dataAtual);
  
    const dataAtual = new Date(diaAtual.data.split('/').reverse().join('-')).toISOString().split('T')[0];

    const tarefasPorDiaAtualizadas = {};
    dias.forEach(dia => {
        tarefasPorDiaAtualizadas[dia.data] = (tarefasPorDia[dia.data] || []).map(tarefa =>
            tarefa.id === id ? { ...tarefa, nome, numero, area, subarea } : tarefa
        );
    });
    setTarefasPorDia(tarefasPorDiaAtualizadas);

    const diasAtualizados = dias.map(dia => {
      const diaData = new Date(dia.data.split('/').reverse().join('-')).toISOString().split('T')[0];
      if (diaData >= dataAtual) {
        const tarefasAtualizadasDia = dia.tarefas.map(tarefa => tarefa.id === id ? { ...tarefa, nome, numero, area, subarea } : tarefa);
        return { ...dia, tarefas: tarefasAtualizadasDia };
      }
      return dia;
    });

    await inserirDias({ userId, dias: diasAtualizados });
    setDias(diasAtualizados);
  }

  const itensAtualizados = items.map(item => item.id === id ? { ...item, nome, numero, area, subarea } : item);
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


export const deleteItem = async (id, tipo, setItems, items) => {
  if (tipo === 'tarefa') {
    await deleteTarefa(id);
  } else {
    await deleteAtividade(id);
  }
  setItems(items.filter(item => item.id !== id));
};

