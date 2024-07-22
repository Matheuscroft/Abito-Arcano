import React, { useState } from 'react';
import Tarefa from './Tarefa';
import EditorItem from './EditorItem';
import { addItem, updateItem, toggleFinalizada, deleteItem } from './todoUtils';
import { substituirTarefasGerais } from '../auth/firebaseTarefas';
import { getDias, inserirDias } from '../auth/firebaseDiasHoras';

function ListaTarefas({ user, tarefas, setTarefas, setPontuacoes, setDias, dias, tarefasPorDia, setTarefasPorDia }) {
  const [novaTarefa, setNovaTarefa] = useState('');
  const [itemEditando, setItemEditando] = useState(null);

  const resetarListaDeTarefasGerais = async (userId) => {
    try {
      // 1. Substituir a lista de tarefas gerais com um array vazio.
      const tarefasVazias = [];
      await substituirTarefasGerais(userId, tarefasVazias);
      setTarefas(tarefasVazias)

      // 2. Obter a lista de dias do Firebase.
      const dias = await getDias(userId);

      console.log("dias")
      console.log(dias)

      // 3. Esvaziar o array de tarefas de todos os dias.
      const diasAtualizados = dias.map(dia => ({
        ...dia,
        tarefas: []
      }));

      // 4. Inserir a lista de dias atualizada no Firebase.
      await inserirDias({ userId, dias: diasAtualizados });

      console.log("Lista de tarefas gerais e tarefas de todos os dias resetadas com sucesso.");

      setDias(diasAtualizados)
      setTarefasPorDia({});

      return { tarefas: tarefasVazias, dias: diasAtualizados };
    } catch (error) {
      console.error("Erro ao resetar lista de tarefas gerais:", error);
      throw error;
    }
  };

  return (
    <div>
      <h1>Tarefas</h1>
      <button onClick={() => resetarListaDeTarefasGerais(user.uid)}>Resetar Lista de Tarefas Gerais</button>
      <input
        type="text"
        value={novaTarefa}
        onChange={(e) => setNovaTarefa(e.target.value)}
        placeholder="Digite o nome da tarefa"
      />
      <button onClick={() => addItem(novaTarefa, 'tarefa', setTarefas, tarefas, user.uid, setDias, dias, tarefasPorDia, setTarefasPorDia)}>Adicionar Tarefa</button>
      <ul>
        {tarefas.filter(tarefa => !tarefa.finalizada).map((tarefa) => (
          <li key={tarefa.id}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setItemEditando(tarefa)}
              onDelete={() => deleteItem(tarefa.id, 'tarefa', setTarefas, tarefas)}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, setTarefas, setPontuacoes, user.uid)}
            />
          </li>
        ))}
      </ul>
      {itemEditando && (
        <EditorItem
          item={itemEditando}
          setItemEditando={setItemEditando}
          onSave={(nome, numero, area, subarea) => updateItem(itemEditando.id, nome, numero, area, subarea, 'tarefa', setTarefas, tarefas, user.uid, setDias, dias, tarefasPorDia, setTarefasPorDia)}
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
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, setTarefas, setPontuacoes, user.uid)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTarefas;
