import React, { useState, useEffect } from 'react';
import Tarefa from './Tarefa';
import EditorItem from './EditorItem';
import { addItem, updateItem, toggleFinalizada, deleteItem } from './todoUtils';
import { substituirTarefasGerais } from '../auth/firebaseTarefas.js';
import { getDias, inserirDias } from '../auth/firebaseDiasHoras.js';

function ListaTarefas({ user, tarefas, setTarefas, setPontuacoes, setDias, dias, tarefasPorDia, setTarefasPorDia, areas, diaVisualizado }) {
  const [nomeNovaTarefa, setNomeNovaTarefa] = useState('');
  const [itemEditando, setItemEditando] = useState(null);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO lusta tarefas - dias:");
    console.log(dias)
    console.log("Estado atualizadOOOOOO lusta tarefas - tarefas:");
    console.log(tarefas)
  }, []);

  const resetarListaDeTarefasGerais = async (userId) => {
    try {
      const tarefasVazias = [];
      await substituirTarefasGerais(userId, tarefasVazias);
      setTarefas(tarefasVazias)

      const dias = await getDias(userId);

      console.log("dias")
      console.log(dias)

      const diasAtualizados = dias.map(dia => ({
        ...dia,
        tarefas: []
      }));

      await inserirDias(userId, diasAtualizados);


      console.log("Lista de tarefas gerais e tarefas de todos os dias resetadas com sucesso.");
      console.log("diasAtualizados");
      console.log(diasAtualizados);

      setDias(diasAtualizados)
      setTarefasPorDia({});

      return { tarefas: tarefasVazias, dias: diasAtualizados };
    } catch (error) {
      console.error("Erro ao resetar lista de tarefas gerais:", error);
      throw error;
    }
  };

  const handleAdicionarItem = async () => {

    if (nomeNovaTarefa.trim() === '') return;

    addItem(nomeNovaTarefa, 'tarefa', setTarefas, tarefas, user.uid, areas, setDias, dias, tarefasPorDia, setTarefasPorDia)

    setNomeNovaTarefa('');
};

  return (
    <div>
      <h1>Tarefas</h1>
      <button onClick={() => resetarListaDeTarefasGerais(user.uid)}>Resetar Lista de Tarefas Gerais</button>
      <input
        type="text"
        value={nomeNovaTarefa}
        onChange={(e) => setNomeNovaTarefa(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAdicionarItem();
          }
        }}
        placeholder="Digite o nome da tarefa"
      />
      <button onClick={handleAdicionarItem}>Adicionar Tarefa</button>
      <ul>
        {tarefas.filter(tarefa => !tarefa.finalizada).map((tarefa) => (
          <li key={tarefa.id}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setItemEditando(tarefa)}
              onDelete={() => deleteItem(tarefa.id, 'tarefa', setTarefas, tarefas, user.uid, setDias, dias, tarefasPorDia, setTarefasPorDia)}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, setTarefas, setPontuacoes, user.uid, diaVisualizado, dias, setDias, tarefas, setTarefasPorDia)}
              areas={areas}
            />
          </li>
        ))}
      </ul>
      
      {itemEditando && (
        <EditorItem
          item={itemEditando}
          tipo={"tarefa"}
          setItemEditando={setItemEditando}
          onSave={(nome, numero, area, subarea, areaId, subareaId, diasSemana) => updateItem(itemEditando.id, nome, numero, area, subarea, areaId, subareaId, 'tarefa', setTarefas, tarefas, user.uid, setDias, dias, tarefasPorDia, setTarefasPorDia, diasSemana)}
          areas={areas}
        />
      )}


      <h2>Finalizadas</h2>
      <ul>
        {tarefas.filter(tarefa => tarefa.finalizada).map((tarefa) => (
          <li key={tarefa.id} style={{ textDecoration: 'line-through' }}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setItemEditando(tarefa)}
              onDelete={() => deleteItem(tarefa.id, 'tarefa', setTarefas, tarefas, user.uid, setDias, dias, tarefasPorDia, setTarefasPorDia)}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, setTarefas, setPontuacoes, user.uid, diaVisualizado, dias, setDias, tarefas, setTarefasPorDia)}
              areas={areas}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTarefas;
