import React, { useState, useEffect } from 'react';
import Tarefa from './Tarefa';
import EditorItem from './EditorItem';
import { addItem, updateItem, toggleFinalizada, deleteItem, atualizarDiasLocalmenteENoFirebase } from './todoUtils';
import { substituirTarefasGerais } from '../auth/firebaseTarefas.js';
import { getDias, inserirDias } from '../auth/firebaseDiasHoras.js';

function ListaTarefas({ user, tarefas, setPontuacoes, setDias, dias, areas, diaVisualizado }) {
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
      ////setTarefas(tarefasVazias)

      const dias = await getDias(userId);

      console.log("dias")
      console.log(dias)

      const diasAtualizados = dias.map(dia => ({
        ...dia,
        tarefas: []
      }));

      console.log("Lista de tarefas gerais e tarefas de todos os dias resetadas com sucesso.");
      console.log("diasAtualizados");
      console.log(diasAtualizados);


      atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);

      //setTarefasPorDia({});

      return { tarefas: tarefasVazias, dias: diasAtualizados };
    } catch (error) {
      console.error("Erro ao resetar lista de tarefas gerais:", error);
      throw error;
    }
  };

  const handleAdicionarItem = async () => {

    if (nomeNovaTarefa.trim() === '') return;

    addItem(nomeNovaTarefa, 'tarefa', null, tarefas, user.uid, areas, setDias, dias)

    setNomeNovaTarefa('');
  };


  const moveItem = async (index, direction, userId, tarefas, setDias, dias) => {

    const tarefasNaoFinalizadas = tarefas.filter(tarefa => !tarefa.finalizada);

    const targetIndex = index + direction;

    if (targetIndex >= 0 && targetIndex < tarefasNaoFinalizadas.length) {

      const temp = tarefasNaoFinalizadas[index];
      tarefasNaoFinalizadas[index] = tarefasNaoFinalizadas[targetIndex];
      tarefasNaoFinalizadas[targetIndex] = temp;


      let tarefaNaoFinalizadaIndex = 0;
      const tarefasAtualizadas = tarefas.map(tarefa => {
        if (tarefa.finalizada) {
          return tarefa;
        }
        const tarefaAtualizada = tarefasNaoFinalizadas[tarefaNaoFinalizadaIndex];
        tarefaNaoFinalizadaIndex++;
        return tarefaAtualizada;
      });

      console.log("tarefasAtualizadas")
      console.log(tarefasAtualizadas)


      await substituirTarefasGerais(userId, tarefasAtualizadas);


    const diasAtualizados = dias.map(dia => {
      const tarefasDoDiaAtualizadas = tarefasAtualizadas.filter(tarefaGeralAtualizada => {
          return dia.tarefas.some(tarefaDoDia => tarefaDoDia.id === tarefaGeralAtualizada.id);
      });
  
      return { ...dia, tarefas: tarefasDoDiaAtualizadas };
  });
  

      console.log("diasAtualizados")
      console.log(diasAtualizados)


      atualizarDiasLocalmenteENoFirebase(userId, diasAtualizados, setDias);
    }
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
        {tarefas.filter(tarefa => !tarefa.finalizada).map((tarefa, index) => (
          <li key={tarefa.id}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setItemEditando(tarefa)}
              onDelete={() => deleteItem(tarefa.id, 'tarefa', null, tarefas, user.uid, setDias, dias)}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, null, setPontuacoes, user.uid, diaVisualizado, dias, setDias)}
              areas={areas}
              index={index}
              lista={tarefas}
              onMove={(index, direction) => moveItem(index, direction, user.uid, tarefas, setDias, dias)}
            />
          </li>
        ))}
      </ul>

      {itemEditando && (
        <EditorItem
          item={itemEditando}
          tipo={"tarefa"}
          setItemEditando={setItemEditando}
          onSave={(nome, numero, area, subarea, areaId, subareaId, diasSemana) => updateItem(itemEditando.id, nome, numero, area, subarea, areaId, subareaId, 'tarefa', null, tarefas, user.uid, setDias, dias, diasSemana)}
          areas={areas}
        />
      )}


      <h2>Finalizadas</h2>
      <ul>
        {tarefas.filter(tarefa => tarefa.finalizada).map((tarefa, index) => (
          <li key={tarefa.id} style={{ textDecoration: 'line-through' }}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setItemEditando(tarefa)}
              onDelete={() => deleteItem(tarefa.id, 'tarefa', null, tarefas, user.uid, setDias, dias)}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, null, setPontuacoes, user.uid, diaVisualizado, dias, setDias)}
              areas={areas}
              onMove={(direction) => moveItem(index, direction)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTarefas;
