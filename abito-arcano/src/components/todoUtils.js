import {
    addTarefa,
    updateTarefa,
    deleteTarefa,
    addAtividade,
    updateAtividade,
    deleteAtividade,
    updatePontuacao
  } from '../auth/firebaseService';


  export const addItem = async (nome, tipo, setItems, items, data) => {
    if (nome.trim() === '') return;
  
    const novoItem = { nome, numero: 0, area: '', subarea: '', finalizada: false };
    const itemAdicionado = tipo === 'tarefa' 
      ? await addTarefa(novoItem) 
      : await addAtividade(novoItem);
  
    setItems(prevItems => ({
      ...prevItems,
      [data]: [...(prevItems[data] || []), itemAdicionado]
    }));
  };
  
  export const updateItem = async (id, nome, numero, area, subarea, tipo, setItems, items) => {
    const itemAtualizado = tipo === 'tarefa'
      ? await updateTarefa(id, { nome, numero, area, subarea })
      : await updateAtividade(id, { nome, numero, area, subarea });
  
    const itensAtualizados = items.map(item => item.id === id ? itemAtualizado : item)
  
    setItems(itensAtualizados);
  };

  export const toggleFinalizada = async (id, tipo, items, setItems, setPontuacoes) => {
    const item = items.find(i => i.id === id);
    if (item) {
      const finalizada = !item.finalizada;
      const atualizacaoPontuacao = finalizada ? item.numero : -item.numero;
      if (tipo === 'tarefa') {
        await updateTarefa(id, { ...item, finalizada });
      } else {
        await updateAtividade(id, { ...item, finalizada });
      }
      await updatePontuacao(item.area, atualizacaoPontuacao);
      if (item.subarea) {
        await updatePontuacao(item.subarea, atualizacaoPontuacao);
      }
      const itensAtualizados = items.map(i => i.id === id ? { ...i, finalizada } : i);
      setItems(itensAtualizados);
      setPontuacoes(prev => ({
        ...prev,
        [item.area]: (prev[item.area] || 0) + atualizacaoPontuacao,
        ...(item.subarea && { [item.subarea]: (prev[item.subarea] || 0) + atualizacaoPontuacao }),
      }));
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

  