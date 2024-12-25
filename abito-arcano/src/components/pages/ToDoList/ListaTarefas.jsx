import React, { useState, useEffect } from 'react';
import Tarefa from './Tarefa.jsx';
import EditorItem from '../../EditorItem.jsx';
import { addItem, updateItem, toggleFinalizada, deleteItem, atualizarDiasLocalmenteENoFirebase } from '../../todoUtils.js';
import { substituirTarefasGerais } from '../../../auth/firebaseTarefas.js';
import { getDias, inserirDias } from '../../../auth/firebaseDiasHoras.js';

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

    addItem(nomeNovaTarefa, 'tarefa', null, tarefas, user.uid, areas, setDias, dias, diaVisualizado)

    setNomeNovaTarefa('');
  };


  const moveItem = async (itemId, direction, userId, tarefas, setDias, dias) => {

    console.log('moveItem - itemId:', itemId, 'direction:', direction, 'userId:', userId);
    console.log('moveItem - Tarefas iniciais:', tarefas);
    console.log('moveItem - Dias iniciais:', dias);

    const tarefasNaoFinalizadas = tarefas.filter(tarefa => !tarefa.finalizada);
    

    const index = tarefasNaoFinalizadas.findIndex((tarefa) => tarefa.id === itemId);

    console.log("index")
    console.log(index)

    if (index < 0) return;

    const newIndex = index + direction;

    console.log("newIndex")
    console.log(newIndex)



    if (newIndex >= 0 && newIndex < tarefasNaoFinalizadas.length) {

      const temp = tarefasNaoFinalizadas[index];
      tarefasNaoFinalizadas[index] = tarefasNaoFinalizadas[newIndex];
      tarefasNaoFinalizadas[newIndex] = temp;

      console.log('moveItem - Tarefas reordenadas:', tarefasNaoFinalizadas);


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
        const tarefasDoDiaAtualizadas = tarefasAtualizadas.map(tarefaGeralAtualizada => {
          const tarefaDoDia = dia.tarefas.find(tarefaDoDia => tarefaDoDia.id === tarefaGeralAtualizada.id);

          if (tarefaDoDia) {
            return { ...tarefaGeralAtualizada, finalizada: tarefaDoDia.finalizada };
          } else {
            return { ...tarefaGeralAtualizada, finalizada: false };
          }
        });

        console.log('moveItem - Tarefas do dia atualizadas para dia:', dia.data, tarefasDoDiaAtualizadas);

        return { ...dia, tarefas: tarefasDoDiaAtualizadas };
      });



      console.log('moveItem - Dias atualizados:', diasAtualizados);


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
              onDelete={() => deleteItem(tarefa, 'tarefa', null, tarefas, user.uid, setDias, dias, diaVisualizado)}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, null, setPontuacoes, user.uid, diaVisualizado, dias, setDias)}
              areas={areas}
              index={index}
              lista={tarefas}
              onMove={(itemId, direction) => moveItem(itemId, direction, user.uid, tarefas, setDias, dias)}
            />

            {itemEditando && itemEditando === tarefa && (
              <EditorItem
                item={itemEditando}
                tipo={"tarefa"}
                setItemEditando={setItemEditando}
                onSave={(nome, numero, area, subarea, areaId, subareaId, diasSemana) => updateItem(itemEditando.id, nome, numero, area, subarea, areaId, subareaId, 'tarefa', null, tarefas, user.uid, setDias, dias, diasSemana, diaVisualizado)}
                areas={areas}
              />
            )}
          </li>
        ))}
      </ul>


      <h2>Finalizadas</h2>
      <ul>
        {tarefas.filter(tarefa => tarefa.finalizada).map((tarefa, index) => (
          <li key={tarefa.id} style={{ textDecoration: 'line-through' }}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setItemEditando(tarefa)}
              onDelete={() => deleteItem(tarefa, 'tarefa', null, tarefas, user.uid, setDias, dias, diaVisualizado)}
              onToggle={() => toggleFinalizada(tarefa.id, 'tarefa', tarefas, null, setPontuacoes, user.uid, diaVisualizado, dias, setDias)}
              areas={areas}
              onMove={(itemId, direction) => moveItem(itemId, direction, user.uid, tarefas, setDias, dias)}
            />

{itemEditando && itemEditando === tarefa && (
              <EditorItem
                item={itemEditando}
                tipo={"tarefa"}
                setItemEditando={setItemEditando}
                onSave={(nome, numero, area, subarea, areaId, subareaId, diasSemana) => updateItem(itemEditando.id, nome, numero, area, subarea, areaId, subareaId, 'tarefa', null, tarefas, user.uid, setDias, dias, diasSemana, diaVisualizado)}
                areas={areas}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaTarefas;
