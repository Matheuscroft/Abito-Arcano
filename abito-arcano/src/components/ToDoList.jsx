import React, { useState, useEffect } from 'react';
import { getPontuacoes } from '../auth/firebasePontuacoes';
import { getListaAtividades } from '../auth/firebaseAtividades';
import { getListaTarefas} from '../auth/firebaseTarefas';
import BarraPontuacoes from './BarraPontuacoes';
import ListaAtividades from './ListaAtividades';
import Diarias from './Diarias';

function ToDoList() {
  const [tarefas, setTarefas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [pontuacoes, setPontuacoes] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const tarefas = await getListaTarefas();
      const atividades = await getListaAtividades();
      const pontuacoes = await getPontuacoes();

      setTarefas(tarefas);
      setAtividades(atividades);
      setPontuacoes(pontuacoes);
      console.log("atividades")
      console.log(atividades)
    };
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO - atividades:");
    console.log(atividades)
}, [atividades]);


  return (
    <div>
      <h1>To-Do List</h1>

      <BarraPontuacoes pontuacoes={pontuacoes} setPontuacoes={setPontuacoes} />

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
        <Diarias tarefas={tarefas} setPontuacoes={setPontuacoes}/>
        </div>

        <div style={{ flex: 1 }}>
          <ListaAtividades
            atividades={atividades}
            setAtividades={setAtividades}
            pontuacoes={pontuacoes}
            setPontuacoes={setPontuacoes}
          />
        </div>
      </div>
    </div>
  );
}

export default ToDoList;
