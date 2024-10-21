import {
  updatePontuacao
} from '../auth/firebasePontuacoes.js';
import {
  getListaAtividades,
  updateAtividade,
  setListaAtividades
} from '../auth/firebaseAtividades.js';
import { v4 as uuidv4 } from 'uuid';

import {
  updateTarefa,

} from '../auth/firebaseTarefas.js';
import { inserirDias } from '../auth/firebaseDiasHoras.js';
import { getListaTarefas, substituirTarefasGerais } from '../auth/firebaseTarefas.js';

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


export const addItem = async (nome, tipo, setItems, items, userId, areas, setDias, dias) => {
  if (nome.trim() === '') return;

  const { areaId, subareaId } = await buscarIdsAreaESubarea(areas, "SEM CATEGORIA", "");

  console.log("ADD ITEM")
  const novoItem = { 
    id: uuidv4(),
    nome, 
    numero: 1, 
    area: 'SEM CATEGORIA', 
    subarea: '', 
    areaId: areaId,
    subareaId: subareaId,
    finalizada: false
  };

  console.log("items")
  console.log(items)

  console.log("novoItem")
  console.log(novoItem)
  console.log("novoItem")
  console.log(novoItem)


  if (tipo === 'atividade') {

    const atividadesData = await getListaAtividades(userId);
    const atividadesArray = atividadesData.atividades || [];
    atividadesArray.push(novoItem)
    
    console.log("Novasatividades")
    console.log(atividadesArray)
    
    await setListaAtividades(userId, atividadesArray);
    setItems(atividadesArray);

  } else if (tipo === 'tarefa') {
    

    await atualizarTarefasEDias(novoItem, setItems, items, userId, setDias, dias, false);
  }
};




export const updateItem = async (id, nome, numero, area, subarea, areaId, subareaId, tipo, setItems, items, userId, setDias, dias, diasSemana) => {
  
  
  if (tipo === 'tarefa') {
    const itemAtualizado = { id, nome, numero, area, subarea, areaId, subareaId, diasSemana };

    console.log("itemAtualizado")
    console.log(itemAtualizado)
    

    await atualizarTarefasEDias(itemAtualizado, setItems, items, userId, setDias, dias, true);
  } else if (tipo === 'atividade') {
    console.log("else, sou atividade")


    const atividadesAtualizadas = items.map(atividade =>
      atividade.id === id 
        ? { ...atividade, nome, numero, area, subarea, areaId, subareaId }
        : atividade
    );



    console.log("atividadesAtualizadas")
    console.log(atividadesAtualizadas)

    await setListaAtividades(userId, atividadesAtualizadas);


    setItems(atividadesAtualizadas);
  }
};


const atualizarTarefasGerais = async (item, items, userId, isUpdate) => {

  console.log("to no atualizarTarefasGerais")
  let novasTarefas;
  if (isUpdate) {
    console.log("if")
    const tarefasGerais = await getListaTarefas(userId);
    novasTarefas = tarefasGerais.map(tarefa =>
      tarefa.id === item.id
        ? { ...tarefa, nome: item.nome, numero: item.numero, area: item.area, subarea: item.subarea, areaId: item.areaId, subareaId: item.subareaId, diasSemana: item.diasSemana }
        : tarefa
    );
  } else {
    console.log("else")
    novasTarefas = [...items, item];
  }
  console.log("novasTarefas do atualizar dias e tarefas")
  console.log(novasTarefas)
  await substituirTarefasGerais(userId, novasTarefas);

}

const atualizarDias = async (item, userId, setDias, dias, isUpdate) => {

  const diaAtual = dias.find(dia => dia.dataAtual);
  const dataAtual = new Date(diaAtual.data.split('/').reverse().join('-')).toISOString().split('T')[0];



  const diasAtualizados = dias.map(dia => {
    const diaData = new Date(dia.data.split('/').reverse().join('-')).toISOString().split('T')[0];
    if (diaData >= dataAtual) {
      const tarefasAtualizadasDia = isUpdate
        ? dia.tarefas.map(tarefa =>
          tarefa.id === item.id
            ? { ...tarefa, nome: item.nome, numero: item.numero, area: item.area, subarea: item.subarea, areaId: item.areaId, subareaId: item.subareaId, diasSemana: item.diasSemana }
            : tarefa
        )
        : [...dia.tarefas, item];
      return { ...dia, tarefas: tarefasAtualizadasDia };
    }
    return dia;
  });


  atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);

  console.log("Dias atualizados localmente e no Firebase");
  console.log(diasAtualizados);
}

const atualizarTarefasEDias = async (item, setItems, items, userId, setDias, dias, isUpdate = false) => {

  console.log("item")
  console.log(item)

  console.log("isUpdate")
  console.log(isUpdate)

  atualizarTarefasGerais(item, items, userId, isUpdate);


  atualizarDias(item, userId, setDias, dias, isUpdate)
  

};




export const deleteItem = async (id, tipo, setItems, items, userId, setDias, dias) => {
  if (tipo === 'tarefa') {
    const tarefasAtualizadas = items.filter(item => item.id !== id);

    atualizarTarefasLocalmenteENoFirebase(userId, tarefasAtualizadas, setItems);


    const diasAtualizados = dias.map(dia => ({
      ...dia,
      tarefas: dia.tarefas.filter(tarefa => tarefa.id !== id)
    }));


    

    atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);

  } else if (tipo === 'atividade') {
    const atividadesAtualizadas = items.filter(item => item.id !== id);
    setItems(atividadesAtualizadas);
    await setListaAtividades(userId, atividadesAtualizadas);
  }
};


export const atualizarTarefasLocalmenteENoFirebase = async (userId, tarefasAtualizadas, setTarefas) => {

  //setTarefas(tarefasAtualizadas);
  await substituirTarefasGerais(userId, tarefasAtualizadas);

}

export const atualizarDiasLocalmenteENoFirebase = async (userId, diasAtualizados, setDias) => {

  setDias(diasAtualizados);
  await inserirDias(userId, diasAtualizados);

}



export const toggleFinalizada = async (id, tipo, items, setItems, setPontuacoes, userId, dataPontuacao = "", dias, setDias) => {
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
    console.log("item")
    console.log(item)

    console.log("id")
    console.log(id)

    if (tipo === 'tarefa') {
      const diaReferido = dias.find(dia => dia.data === dataPontuacao);
      if (diaReferido) {
        const tarefasAtualizadas = diaReferido.tarefas.map(tarefa =>
          tarefa.id === id ? { ...tarefa, finalizada } : tarefa
        );

        const diasAtualizados = dias.map(dia =>
          dia.data === dataPontuacao ? { ...dia, tarefas: tarefasAtualizadas } : dia
        );

        atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);
      }
    } else if (tipo === 'atividade') {


      const atividadesAtualizadas = items.map(i => i.id === id ? { ...i, finalizada } : i);
      setItems(atividadesAtualizadas);

      console.log("atividade else")
      console.log("atividadesAtualizadas")
      console.log(atividadesAtualizadas)


      await setListaAtividades(userId, atividadesAtualizadas);
    }


    console.log("item.areaId")
    
    console.log(item.areaId)

    await updatePontuacao(userId, item.areaId, item.subareaId, atualizacaoPontuacao, dataPontuacao);


    setPontuacoes(prev => {
      const novaPontuacao = {
        data: dataPontuacao,
        pontos: atualizacaoPontuacao,
        subareaId: item.subareaId,
      };

      const dataExistente = prev.find(p => p.data === dataPontuacao);

      if (dataExistente) {
        const areaExistente = dataExistente.areas.find(a => a.areaId === item.areaId);

        if (areaExistente) {
          const subareaExistente = areaExistente.subareas.find(sa => sa.subareaId === item.subareaId);

          if (subareaExistente) {
            subareaExistente.pontos += atualizacaoPontuacao;
          } else {
            areaExistente.subareas.push({
              subareaId: item.subareaId,
              pontos: atualizacaoPontuacao
            });
          }

          areaExistente.pontos += atualizacaoPontuacao;
        } else {
          dataExistente.areas.push({
            areaId: item.areaId,
            pontos: atualizacaoPontuacao,
            subareas: [{
              subareaId: item.subareaId,
              pontos: atualizacaoPontuacao
            }]
          });
        }
      } else {
        prev.push({
          data: dataPontuacao,
          areas: [{
            areaId: item.areaId,
            pontos: atualizacaoPontuacao,
            subareas: [{
              subareaId: item.subareaId,
              pontos: atualizacaoPontuacao
            }]
          }]
        });
      }

      return [...prev];
    });

  }
};





