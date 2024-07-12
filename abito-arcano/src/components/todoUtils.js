import {
    addTarefa,
    updateTarefa,
    deleteTarefa,
    addAtividade,
    updateAtividade,
    deleteAtividade,
    updatePontuacao
  } from '../auth/firebaseService';
  
  export const addItem = async (nome, tipo, setTarefas, setAtividades, tarefas, atividades) => {
    if (nome.trim() === '') return;
  
    const novoItem = { nome, numero: 0, area: '', subarea: '', finalizada: false };
  
    if (tipo === 'tarefa') {
      const tarefaAdicionada = await addTarefa(novoItem);
      setTarefas([...tarefas, tarefaAdicionada]);
    } else {
      const atividadeAdicionada = await addAtividade(novoItem);
      setAtividades([...atividades, atividadeAdicionada]);
    }
  };
  
  export const updateItem = async (id, nome, numero, area, subarea, tipo, setTarefas, setAtividades, tarefas, atividades) => {
    const itemAtualizado = tipo === 'tarefa'
      ? await updateTarefa(id, { nome, numero, area, subarea })
      : await updateAtividade(id, { nome, numero, area, subarea });
  
    const itensAtualizados = tipo === 'tarefa'
      ? tarefas.map(tarefa => tarefa.id === id ? itemAtualizado : tarefa)
      : atividades.map(atividade => atividade.id === id ? itemAtualizado : atividade);
  
    if (tipo === 'tarefa') setTarefas(itensAtualizados);
    else setAtividades(itensAtualizados);
  };
  
  export const toggleFinalizada = async (id, tipo, setTarefas, setAtividades, tarefas, atividades, setPontuacoes) => {
    const lista = tipo === 'tarefa' ? tarefas : atividades;
    const item = lista.find(item => item.id === id);
  
    if (item) {
      const finalizada = !item.finalizada;
      const atualizacaoPontuacao = finalizada ? item.numero : -item.numero;
  
      if (tipo === 'tarefa') {
        await updateTarefa(id, { ...item, finalizada });
      } else {
        await updateAtividade(id, { ...item, finalizada });
      }
  
      const atualizarPontuacoes = async () => {
        await updatePontuacao(item.area, atualizacaoPontuacao);
        if (item.subarea) {
          await updatePontuacao(item.subarea, atualizacaoPontuacao);
        }
      };
  
      await atualizarPontuacoes();
  
      const itensAtualizados = lista.map(item =>
        item.id === id ? { ...item, finalizada } : item
      );
  
      if (tipo === 'tarefa') setTarefas(itensAtualizados);
      else setAtividades(itensAtualizados);
  
      // Atualizar localmente a pontuação exibida na interface
      setPontuacoes(prev => ({
        ...prev,
        [item.area]: (prev[item.area] || 0) + atualizacaoPontuacao,
        ...(item.subarea && { [item.subarea]: (prev[item.subarea] || 0) + atualizacaoPontuacao }),
      }));
    }
  };
  
  
  
  export const deleteItem = async (id, tipo, setTarefas, setAtividades, tarefas, atividades) => {
    if (tipo === 'tarefa') {
      await deleteTarefa(id);
      setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    } else {
      await deleteAtividade(id);
      setAtividades(atividades.filter(atividade => atividade.id !== id));
    }
  };
  