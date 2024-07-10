import React, { useState, useEffect } from 'react';
import Tarefa from './Tarefa';
import EditorTarefa from './EditorTarefa';

function ToDoList() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [pontuacoes, setPontuacoes] = useState({});

  useEffect(() => {
    const storedTarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    const storedPontuacoes = JSON.parse(localStorage.getItem('pontuacoes')) || {};
    setTarefas(storedTarefas);
    setPontuacoes(storedPontuacoes);
  }, []);

  useEffect(() => {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
    localStorage.setItem('pontuacoes', JSON.stringify(pontuacoes));
  }, [tarefas, pontuacoes]);

  const addTarefa = () => {
    if (novaTarefa.trim() === '') return;
    const nova = { id: Date.now(), nome: novaTarefa, numero: 0, area: '', subarea: '', finalizada: false };
    setTarefas([...tarefas, nova]);
    setNovaTarefa('');
  };

  const updateTarefa = (id, nome, numero, area, subarea) => {
    const tarefasAtualizadas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        return { ...tarefa, nome, numero, area, subarea };
      }
      return tarefa;
    });
    setTarefas(tarefasAtualizadas);
    setTarefaEditando(null);
  };

  const toggleFinalizada = (id) => {
    const tarefasAtualizadas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        const finalizada = !tarefa.finalizada;
        const atualizacaoPontuacao = finalizada ? tarefa.numero : -tarefa.numero;
        atualizarPontuacao(tarefa.area, atualizacaoPontuacao);
        return { ...tarefa, finalizada };
      }
      return tarefa;
    });
    setTarefas(tarefasAtualizadas);
  };

  const deleteTarefa = (id) => {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa && tarefa.finalizada) {
      atualizarPontuacao(tarefa.area, -tarefa.numero);
    }
    const tarefasAtualizadas = tarefas.filter((tarefa) => tarefa.id !== id);
    setTarefas(tarefasAtualizadas);
  };

  const atualizarPontuacao = (area, pontos) => {
    setPontuacoes((prevPontuacoes) => ({
      ...prevPontuacoes,
      [area]: (prevPontuacoes[area] || 0) + pontos,
    }));
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

      <div className="barra-pontuacoes">
        {JSON.parse(localStorage.getItem('areas')).map((area) => (
          <div key={area.nome} className="card-pontuacao" style={{ backgroundColor: area.cor }}>
            <div>{area.nome}</div>
            <div>{pontuacoes[area.nome] || 0}</div>
          </div>
        ))}
      </div>

      <ul>
        {tarefas.filter(tarefa => !tarefa.finalizada).map((tarefa) => (
          <li key={tarefa.id}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setTarefaEditando(tarefa)}
              onDelete={() => deleteTarefa(tarefa.id)}
              onToggle={() => toggleFinalizada(tarefa.id)}
            />
          </li>
        ))}
      </ul>
      {tarefaEditando && (
        <EditorTarefa
          tarefa={tarefaEditando}
          onSave={(nome, numero, area, subarea) => updateTarefa(tarefaEditando.id, nome, numero, area, subarea)}
        />
      )}
      <h2>Finalizadas</h2>
      <ul>
        {tarefas.filter(tarefa => tarefa.finalizada).map((tarefa) => (
          <li key={tarefa.id} style={{ textDecoration: 'line-through' }}>
            <Tarefa
              tarefa={tarefa}
              onEdit={() => setTarefaEditando(tarefa)}
              onDelete={() => deleteTarefa(tarefa.id)}
              onToggle={() => toggleFinalizada(tarefa.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

const getCorArea = (area) => {
  const areas = JSON.parse(localStorage.getItem('areas')) || [];
  const areaEncontrada = areas.find(a => a.nome === area);
  return areaEncontrada ? areaEncontrada.cor : '#000';
};

export default ToDoList;
