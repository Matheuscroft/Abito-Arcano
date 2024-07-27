import {
  updatePontuacao
} from '../auth/firebasePontuacoes';
import {
  getListaAtividades,
  updateAtividade,
  setListaAtividades
} from '../auth/firebaseAtividades';
import { v4 as uuidv4 } from 'uuid';

import {
  updateTarefa,

} from '../auth/firebaseTarefas';
import { inserirDias } from '../auth/firebaseDiasHoras';
import { getListaTarefas, substituirTarefasGerais } from '../auth/firebaseTarefas';

export const buscarIdsAreaESubarea = (areas, areaNome, subareaNome) => {
  let areaId = null;
  let subareaId = null;


  const areaEncontrada = areas.find(area => area.nome === areaNome);
  if (areaEncontrada) {
    areaId = areaEncontrada.id;

    const subareaEncontrada = areaEncontrada.subareas.find(subarea => subarea.nome === subareaNome);

    if (subareaEncontrada) {

      subareaId = subareaEncontrada.id;

    }
  }

  return { areaId, subareaId };
};


export const addItem = async (nome, tipo, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia, areas) => {
  if (nome.trim() === '') return;

  console.log("ADD ITEM")
  const novoItem = { nome, numero: 0, area: 'Sem Categoria', subarea: '', finalizada: false };
  //const novoItemComId = { ...novoItem, id: items.length > 0 ? items[items.length - 1].id + 1 : 1 };
  const novoItemComId = { ...novoItem, id: uuidv4() };

  console.log("items")
  console.log(items)

  console.log("novoItem")
  console.log(novoItem)
  console.log("novoItemComId")
  console.log(novoItemComId)

  if (tipo === 'atividade') {
    const atividadesData = await getListaAtividades(userId);
    const atividadesArray = atividadesData.atividades || [];
    atividadesArray.push(novoItemComId)
    const atividadesObjeto = {
      userId: items.userId,
      atividades: atividadesArray
    }
    //const novaAtividade = { ...novoItemComId };
    //const atividadesAtualizadas = [...atividades, novaAtividade];
    //novasAtividades = [...items, item];
    console.log("Novasatividades")
  console.log(atividadesArray)
    await setListaAtividades(userId, atividadesArray);
    setItems(atividadesArray);
  } else if (tipo === 'tarefa') {
    const { areaId, subareaId } = buscarIdsAreaESubarea(areas, novoItem.area, novoItem.subarea);
    const novoItemComIds = { ...novoItemComId, areaId, subareaId };

    await atualizarTarefasEDias(novoItemComIds, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia, false);
  }
};




export const updateItem = async (id, nome, numero, area, subarea, areaId, subareaId, tipo, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia, areas) => {
  if (tipo === 'tarefa') {
    const itemAtualizado = { id, nome, numero, area, subarea, areaId, subareaId };
    await atualizarTarefasEDias(itemAtualizado, setItems, items, userId, setDias, dias, tarefasPorDia, setTarefasPorDia, true);
  } else if (tipo === 'atividade') {
    console.log("else, sou atividade")

    console.log("items")
    console.log(items)
    
    const itemAtualizado = { id, nome, numero, area, subarea, areaId, subareaId };
    console.log("itemAtualizado")
    console.log(itemAtualizado)

    const atividadesAtualizadas = items.map(item =>
      item.id === id ? itemAtualizado : item
    );

    console.log("atividadesAtualizadas")
    console.log(atividadesAtualizadas)

    await setListaAtividades(userId, atividadesAtualizadas);

    
    setItems(atividadesAtualizadas);
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

  await inserirDias(userId, diasAtualizados);
  setDias(diasAtualizados);

  console.log("Dias atualizados localmente e no Firebase");
  console.log(diasAtualizados);

  const itensAtualizados = isUpdate
    ? items.map(itemAtual => itemAtual.id === item.id ? { ...itemAtual, nome: item.nome, numero: item.numero, area: item.area, subarea: item.subarea } : itemAtual)
    : [...items, item];
  setItems(itensAtualizados);
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
    await inserirDias(userId, diasAtualizados);

    setDias(diasAtualizados);
  } else if (tipo === 'atividade') {
    const atividadesAtualizadas = items.filter(item => item.id !== id);
    setItems(atividadesAtualizadas);
    await setListaAtividades(userId, atividadesAtualizadas);
  }
};






export const toggleFinalizada = async (id, tipo, items, setItems, setPontuacoes, userId, dataPontuacao = "", dias, setDias, tarefasGerais, setTarefasPorDia) => {
  const item = items.find(i => i.id === id);
  if (item) {
    console.log("togglefinalizada")
    const finalizada = !item.finalizada;
    const atualizacaoPontuacao = finalizada ? item.numero : -item.numero;
    //const diaVisualizado = new Date().toLocaleDateString('pt-BR');
    console.log("dataPontuacao")
    console.log(dataPontuacao)

    console.log("id")
    console.log(id)
    console.log("items")
    console.log(items)

    if (tipo === 'tarefa') {
      const diaReferido = dias.find(dia => dia.data === dataPontuacao);
      if (diaReferido) {
        const tarefasAtualizadas = diaReferido.tarefas.map(tarefa =>
          tarefa.id === id ? { ...tarefa, finalizada } : tarefa
        );

        const diasAtualizados = dias.map(dia =>
          dia.data === dataPontuacao ? { ...dia, tarefas: tarefasAtualizadas } : dia
        );

        setDias(diasAtualizados);

        let tarefasPorDiaTemp = {}

        for (const dia of diasAtualizados) {
          tarefasPorDiaTemp[dia.data] = dia.tarefas.length === 0
            ? tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
            : dia.tarefas;
        }
        setTarefasPorDia(tarefasPorDiaTemp);

        await inserirDias(userId, diasAtualizados);
      }
    } else if (tipo === 'atividade') {
      
    
      const atividadesAtualizadas = items.map(i => i.id === id ? { ...i, finalizada } : i);
      setItems(atividadesAtualizadas);
      

      await setListaAtividades(userId, atividadesAtualizadas);
    }



    await updatePontuacao(userId, item.areaId, item.subareaId, atualizacaoPontuacao, dataPontuacao);

    console.log("item.areaId")
    console.log(item.areaId)
    console.log("item.subareaId")
    console.log(item.subareaId)
    console.log("atualizacaoPontuacao")
    console.log(atualizacaoPontuacao)
    console.log("dataPontuacao")
    console.log(dataPontuacao)

    setPontuacoes(prev => {
      const novaPontuacao = {
        data: dataPontuacao,
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





