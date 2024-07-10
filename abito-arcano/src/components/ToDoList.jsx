import React, { useState, useEffect } from 'react';
import Tarefa from './Tarefa';
import EditorTarefa from './EditorTarefa';
import {
  getListaTarefas,
  addTarefa as addTarefaFirebase,
  updateTarefa as updateTarefaFirebase,
  deleteTarefa as deleteTarefaFirebase,
  getPontuacoes,
  updatePontuacao,
  getAreas
} from '../auth/firebaseService';
import { db } from '../auth/firebase';

function ToDoList() {
  const [tarefas, setTarefas] = useState([]);
  const [novaTarefa, setNovaTarefa] = useState('');
  const [tarefaEditando, setTarefaEditando] = useState(null);
  const [pontuacoes, setPontuacoes] = useState({});
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const tarefas = await getListaTarefas();
      const pontuacoes = await getPontuacoes();
      const areas = await getAreas();
      setTarefas(tarefas);
      setPontuacoes(pontuacoes);
      setAreas(areas);
    };
    fetchData();
  }, []);
  

  const addTarefa = async () => {
    if (novaTarefa.trim() === '') return;
    const nova = { nome: novaTarefa, numero: 0, area: '', subarea: '', finalizada: false };
    const tarefaAdicionada = await addTarefaFirebase(nova);
    setTarefas([...tarefas, tarefaAdicionada]);
    setNovaTarefa('');
  };

  const updateTarefa = async (id, nome, numero, area, subarea) => {
    const tarefaAtualizada = await updateTarefaFirebase(id, { nome, numero, area, subarea });
    const tarefasAtualizadas = tarefas.map((tarefa) => {
      if (tarefa.id === id) {
        return tarefaAtualizada;
      }
      return tarefa;
    });
    setTarefas(tarefasAtualizadas);
    setTarefaEditando(null);
  };

  const toggleFinalizada = async (id) => {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
      const finalizada = !tarefa.finalizada;
      const atualizacaoPontuacao = finalizada ? tarefa.numero : -tarefa.numero;
      await updateTarefaFirebase(id, { ...tarefa, finalizada });
      await updatePontuacao(tarefa.area, atualizacaoPontuacao);
      const tarefasAtualizadas = tarefas.map((t) => {
        if (t.id === id) {
          return { ...t, finalizada };
        }
        return t;
      });
      setTarefas(tarefasAtualizadas);
      setPontuacoes((prevPontuacoes) => ({
        ...prevPontuacoes,
        [tarefa.area]: (prevPontuacoes[tarefa.area] || 0) + atualizacaoPontuacao,
      }));
    }
  };

  const deleteTarefa = async (id) => {
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa && tarefa.finalizada) {
      await updatePontuacao(tarefa.area, -tarefa.numero);
    }
    await deleteTarefaFirebase(id);
    const tarefasAtualizadas = tarefas.filter((tarefa) => tarefa.id !== id);
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

      <div className="barra-pontuacoes">
        {areas.map((area) => (
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

export default ToDoList;
