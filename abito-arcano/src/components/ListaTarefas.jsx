import React, { useState, useEffect } from 'react';
import Tarefa from './Tarefa';
import EditorItem from './EditorItem';
import { addItem, updateItem, toggleFinalizada, deleteItem } from './todoUtils';

import {
    getListaTarefas,
    getAreas
  } from '../auth/firebaseService';

function ListaTarefas({tarefes, setPontuacoes}) {
  const [tarefas, setTarefas] = useState(tarefes);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [itemEditando, setItemEditando] = useState(null);
  const [tipoEditando, setTipoEditando] = useState(null);
  const [editorVisivel, setEditorVisivel] = useState(false); // Novo estado para controlar a visibilidade do editor

  useEffect(() => {
    const fetchData = async () => {
      const tarefas = await getListaTarefas();
      const areas = await getAreas();

      const areasComSubareas = areas.map(area => ({
        ...area,
        subareas: area.subareas || []
      }));

      setTarefas(tarefas);
    };

    fetchData();
  }, []);

  const handleEdit = (tarefa) => {
    setItemEditando(tarefa);
    setTipoEditando('tarefa');
    setEditorVisivel(true); // Mostra o editor quando iniciar a edição
  };

  const handleSave = (nome, numero, area, subarea) => {
    updateItem(itemEditando.id, nome, numero, area, subarea, 'tarefa', setTarefas, setTarefas, tarefas, []);
    setItemEditando(null); // Esconde o editor após salvar
    setTipoEditando(null);
    setEditorVisivel(false);
  };

  return (
    <div>
      <h1>Tarefas</h1>
      <input
        type="text"
        value={novaTarefa}
        onChange={(e) => setNovaTarefa(e.target.value)}
        placeholder="Digite o nome da tarefa"
      />
      <button onClick={() => addItem(novaTarefa, 'tarefa', setTarefas, setTarefas, tarefas, [])}>Adicionar Tarefa</button>

      <ul>
        {tarefas.filter(tarefa => !tarefa.finalizada).map((tarefa) => (
          <li key={tarefa.id}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => handleEdit(tarefa)}
              onDelete={() => deleteItem(tarefa.id, 'tarefa', setTarefas, setTarefas, tarefas, [])}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', setTarefas, setTarefas, tarefas, [], setPontuacoes)}
            />
          </li>
        ))}
      </ul>
      {itemEditando && tipoEditando === 'tarefa' && editorVisivel && (
        <EditorItem
          item={itemEditando}
          onSave={handleSave}
          tipo="tarefa"
        />
      )}
      <h2>Finalizadas</h2>
      <ul>
        {tarefas.filter(tarefa => tarefa.finalizada).map((tarefa) => (
          <li key={tarefa.id} style={{ textDecoration: 'line-through' }}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => handleEdit(tarefa)}
              onDelete={() => deleteItem(tarefa.id, 'tarefa', setTarefas, setTarefas, tarefas, [])}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', setTarefas, setTarefas, tarefas, [], setPontuacoes)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTarefas;
