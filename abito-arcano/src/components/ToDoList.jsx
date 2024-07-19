import React, { useState, useEffect } from 'react';
import { getPontuacoes } from '../auth/firebasePontuacoes';
import { getListaAtividades, updateAtividade } from '../auth/firebaseAtividades';
import { getListaTarefas } from '../auth/firebaseTarefas';
import BarraPontuacoes from './BarraPontuacoes';
import ListaAtividades from './ListaAtividades';
import Diarias from './Diarias';

function ToDoList({ user }) {
  const [tarefas, setTarefas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [pontuacoes, setPontuacoes] = useState({});


  useEffect(() => {
    if (user) {
      console.log('User ID:', user.uid);
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const tarefas = await getListaTarefas(user.uid);
      const atividades = await getListaAtividades();
      const pontuacoes = await getPontuacoes();

      /*const atividadessAtualizadas = atividades.map(atividade => ({
        ...atividade,
        userId: user.uid 
      }));
  
      // Atualiza cada atividade no Firebase
      for (const atividade of atividadessAtualizadas) {
        await updateAtividade(atividade.id, atividade);
      }
  
      console.log("atividades atualizadas com o user ID.");*/

      setTarefas(tarefas);
      setAtividades(atividades);
      setPontuacoes(pontuacoes);
      console.log("atividades")
      console.log(atividades)
      console.log("tarefas")
      console.log(tarefas)
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

      <BarraPontuacoes user={user} pontuacoes={pontuacoes} setPontuacoes={setPontuacoes} />

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Diarias user={user} tarefas={tarefas} setPontuacoes={setPontuacoes} />
        </div>

        <div style={{ flex: 1 }}>
          <ListaAtividades
            user={user}
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
