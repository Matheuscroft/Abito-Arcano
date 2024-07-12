import React, { useState } from 'react';
import Tarefa from './Tarefa';
import EditorItem from './EditorItem';
import { addItem, updateItem, toggleFinalizada, deleteItem } from './todoUtils';

function ListaTarefas({ tarefas, setTarefas, pontuacoes, setPontuacoes }) {
  const [novaTarefa, setNovaTarefa] = useState('');
  const [itemEditando, setItemEditando] = useState(null);

  return (
    <div>
      <h1>Tarefas</h1>
      <input
        type="text"
        value={novaTarefa}
        onChange={(e) => setNovaTarefa(e.target.value)}
        placeholder="Digite o nome da tarefa"
      />
      <button onClick={() => addItem(novaTarefa, 'tarefa', setTarefas, tarefas)}>Adicionar Tarefa</button>
      <ul>
        {tarefas.filter(tarefa => !tarefa.finalizada).map((tarefa) => (
          <li key={tarefa.id}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setItemEditando(tarefa)}
              onDelete={() => deleteItem(tarefa.id, 'tarefa', setTarefas, tarefas)}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, setTarefas, setPontuacoes)}
            />
          </li>
        ))}
      </ul>
      {itemEditando && (
        <EditorItem
          item={itemEditando}
          setItemEditando={setItemEditando}
          onSave={(nome, numero, area, subarea) => updateItem(itemEditando.id, nome, numero, area, subarea, 'tarefa', setTarefas, tarefas)}
        />
      )}
      <h2>Finalizadas</h2>
      <ul>
        {tarefas.filter(tarefa => tarefa.finalizada).map((tarefa) => (
          <li key={tarefa.id} style={{ textDecoration: 'line-through' }}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setItemEditando(tarefa)}
              onDelete={() => deleteItem(tarefa.id, 'tarefa', setTarefas, tarefas)}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, setTarefas, setPontuacoes)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTarefas;
