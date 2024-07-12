import React, { useState, useEffect } from 'react';
import Tarefa from './Tarefa';
import Atividade from './Atividade';
import EditorItem from './EditorItem';
import {
  getListaTarefas,
  addTarefa as addTarefaFirebase,
  updateTarefa as updateTarefaFirebase,
  deleteTarefa as deleteTarefaFirebase,
  getListaAtividades,
  addAtividade as addAtividadeFirebase,
  updateAtividade as updateAtividadeFirebase,
  deleteAtividade as deleteAtividadeFirebase,
  getPontuacoes,
  updatePontuacao,
  getAreas
} from '../auth/firebaseService';

import BarraPontuacoes from './BarraPontuacoes';


function ToDoList() {
  const [tarefas, setTarefas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [novaAtividade, setNovaAtividade] = useState('');
  const [itemEditando, setItemEditando] = useState(null);
  const [tipoEditando, setTipoEditando] = useState(null);
  
  const [pontuacoes, setPontuacoes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const tarefas = await getListaTarefas();
      const atividades = await getListaAtividades();

      const pontuacoes = await getPontuacoes();
     
      setTarefas(tarefas);
      setAtividades(atividades);

      setPontuacoes(pontuacoes);
    };
    fetchData();
  }, []);

  const addItem = async (nome, tipo) => {
    if (nome.trim() === '') return;

    const novoItem = { nome, numero: 0, area: '', subarea: '', finalizada: false };
    if (tipo === 'tarefa') {
      const tarefaAdicionada = await addTarefaFirebase(novoItem);
      setTarefas([...tarefas, tarefaAdicionada]);
    } else {
      const atividadeAdicionada = await addAtividadeFirebase(novoItem);
      setAtividades([...atividades, atividadeAdicionada]);
    }
  };

  const updateItem = async (id, nome, numero, area, subarea, tipo) => {
    const itemAtualizado = tipo === 'tarefa'
      ? await updateTarefaFirebase(id, { nome, numero, area, subarea })
      : await updateAtividadeFirebase(id, { nome, numero, area, subarea });

    const itensAtualizados = tipo === 'tarefa'
      ? tarefas.map(tarefa => tarefa.id === id ? itemAtualizado : tarefa)
      : atividades.map(atividade => atividade.id === id ? itemAtualizado : atividade);

    if (tipo === 'tarefa') setTarefas(itensAtualizados);
    else setAtividades(itensAtualizados);
    setItemEditando(null);
    setTipoEditando(null);
  };

  const toggleFinalizada = async (id, tipo) => {
    const item = tipo === 'tarefa' ? tarefas.find(t => t.id === id) : atividades.find(a => a.id === id);
    if (item) {
      const finalizada = !item.finalizada;
      const atualizacaoPontuacao = finalizada ? item.numero : -item.numero;
      if (tipo === 'tarefa') {
        await updateTarefaFirebase(id, { ...item, finalizada });
      } else {
        await updateAtividadeFirebase(id, { ...item, finalizada });
      }
      if (finalizada) {
        await updatePontuacao(item.area, atualizacaoPontuacao);
        if (item.subarea) {
          await updatePontuacao(item.subarea, atualizacaoPontuacao);
        }
      } else {
        await updatePontuacao(item.area, atualizacaoPontuacao);
        if (item.subarea) {
          await updatePontuacao(item.subarea, atualizacaoPontuacao);
        }
      }
      const itensAtualizados = tipo === 'tarefa'
        ? tarefas.map(t => t.id === id ? { ...t, finalizada } : t)
        : atividades.map(a => a.id === id ? { ...a, finalizada } : a);
      if (tipo === 'tarefa') setTarefas(itensAtualizados);
      else setAtividades(itensAtualizados);
      setPontuacoes(prev => ({
        ...prev,
        [item.area]: (prev[item.area] || 0) + atualizacaoPontuacao,
        ...(item.subarea && { [item.subarea]: (prev[item.subarea] || 0) + atualizacaoPontuacao }),
      }));
    }
  };

  const deleteItem = async (id, tipo) => {
    const item = tipo === 'tarefa' ? tarefas.find(t => t.id === id) : atividades.find(a => a.id === id);

    if (tipo === 'tarefa') {
      await deleteTarefaFirebase(id);
      setTarefas(tarefas.filter(tarefa => tarefa.id !== id));
    } else {
      await deleteAtividadeFirebase(id);
      setAtividades(atividades.filter(atividade => atividade.id !== id));
    }
  };

  return (
    <div>
      <h1>To-Do List</h1>

      <BarraPontuacoes pontuacoes={pontuacoes} setPontuacoes={setPontuacoes} />

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <h1>Tarefas</h1>
          <input
            type="text"
            value={novaTarefa}
            onChange={(e) => setNovaTarefa(e.target.value)}
            placeholder="Digite o nome da tarefa"
          />
          <button onClick={() => addItem(novaTarefa, 'tarefa')}>Adicionar Tarefa</button>

          <ul>
            {tarefas.filter(tarefa => !tarefa.finalizada).map((tarefa) => (
              <li key={tarefa.id}>
                <Tarefa
                  tarefa={tarefa}
                  onEdit={() => { setItemEditando(tarefa); setTipoEditando('tarefa'); }}
                  onDelete={() => deleteItem(tarefa.id, 'tarefa')}
                  onToggle={() => toggleFinalizada(tarefa.id, 'tarefa')}
                />
              </li>
            ))}
          </ul>
          {itemEditando && tipoEditando === 'tarefa' && (
            <EditorItem
              item={itemEditando}
              onSave={(nome, numero, area, subarea) => updateItem(itemEditando.id, nome, numero, area, subarea, 'tarefa')}
              tipo="tarefa"
            />
          )}
          <h2>Finalizadas</h2>
          <ul>
            {tarefas.filter(tarefa => tarefa.finalizada).map((tarefa) => (
              <li key={tarefa.id} style={{ textDecoration: 'line-through' }}>
                <Tarefa
                  tarefa={tarefa}
                  onEdit={() => { setItemEditando(tarefa); setTipoEditando('tarefa'); }}
                  onDelete={() => deleteItem(tarefa.id, 'tarefa')}
                  onToggle={() => toggleFinalizada(tarefa.id, 'tarefa')}
                />
              </li>
            ))}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          <h1>Atividades</h1>
          <input
            type="text"
            value={novaAtividade}
            onChange={(e) => setNovaAtividade(e.target.value)}
            placeholder="Digite o nome da atividade"
          />
          <button onClick={() => addItem(novaAtividade, 'atividade')}>Adicionar Atividade</button>

          <ul>
            {atividades.filter(atividade => !atividade.finalizada).map((atividade) => (
              <li key={atividade.id}>
                <Atividade
                  atividade={atividade}
                  onEdit={() => { setItemEditando(atividade); setTipoEditando('atividade'); }}
                  onDelete={() => deleteItem(atividade.id, 'atividade')}
                  onToggle={() => toggleFinalizada(atividade.id, 'atividade')}
                />
              </li>
            ))}
          </ul>
          {itemEditando && tipoEditando === 'atividade' && (
            <EditorItem
              item={itemEditando}
              onSave={(nome, numero, area, subarea) => updateItem(itemEditando.id, nome, numero, area, subarea, 'atividade')}
              tipo="atividade"
            />
          )}
          <h2>Finalizadas</h2>
          <ul>
            {atividades.filter(atividade => atividade.finalizada).map((atividade) => (
              <li key={atividade.id} style={{ textDecoration: 'line-through' }}>
                <Atividade
                  atividade={atividade}
                  onEdit={() => { setItemEditando(atividade); setTipoEditando('atividade'); }}
                  onDelete={() => deleteItem(atividade.id, 'atividade')}
                  onToggle={() => toggleFinalizada(atividade.id, 'atividade')}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ToDoList;
