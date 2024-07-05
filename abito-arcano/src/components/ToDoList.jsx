import React, { useState } from 'react';
import Tarefa from './Tarefa';
import EditorTarefa from './EditorTarefa';

function ToDoList() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [editarIndexTarefa, setEditarIndexTarefa] = useState(null);

  const addTarefa = () => {
    if (novaTarefa.trim() === '') return;
    setTarefas([...tarefas, { nome: novaTarefa, categoria: '', finalizada: false }]);
    setNovaTarefa('');
  };

  const updateCategoriaTarefa = (index, categoria) => {
    const tarefasAtualizadas = tarefas.map((tarefa, i) => {
      if (i === index) {
        return { ...tarefa, categoria: categoria };
      }
      return tarefa;
    });
    setTarefas(tarefasAtualizadas);
    setEditarIndexTarefa(null);
  };

  const toggleFinalizada = (index) => {
    const tarefasAtualizadas = tarefas.map((tarefa, i) => {
      if (i === index) {
        return { ...tarefa, finalizada: !tarefa.finalizada };
      }
      return tarefa;
    });
    setTarefas(tarefasAtualizadas);
  };

  const deleteTarefa = (index) => {
    const tarefasAtualizadas = tarefas.filter((_, i) => i !== index);
    setTarefas(tarefasAtualizadas);
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={novaTarefa}
        onChange={(e) => setNovaTarefa(e.target.value)}
        placeholder="Digite o nome da tarefa"
      />
      <button onClick={addTarefa}>Adicionar Tarefa</button>
      <ul>
        {tarefas.filter(tarefa => !tarefa.finalizada).map((tarefa, index) => (
          <li key={index}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setEditarIndexTarefa(index)}
              onDelete={() => deleteTarefa(index)}
              onToggle={() => toggleFinalizada(index)}
            />
          </li>
        ))}
      </ul>
      {editarIndexTarefa !== null && (
        <EditorTarefa
          tarefa={tarefas[editarIndexTarefa]}
          onSave={(categoria) => updateCategoriaTarefa(editarIndexTarefa, categoria)}
        />
      )}
      <h2>Finalizadas</h2>
      <ul>
        {tarefas.filter(tarefa => tarefa.finalizada).map((tarefa, index) => (
          <li key={index} style={{ textDecoration: 'line-through' }}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setEditarIndexTarefa(index)}
              onDelete={() => deleteTarefa(index)}
              onToggle={() => toggleFinalizada(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;
