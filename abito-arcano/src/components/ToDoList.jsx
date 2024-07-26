import React, { useState, useEffect } from 'react';
import { getPontuacoes, updatePontuacoes } from '../auth/firebasePontuacoes';
import { getListaAtividades, setListaAtividades } from '../auth/firebaseAtividades';
import BarraPontuacoes from './BarraPontuacoes';
import ListaAtividades from './ListaAtividades';
import Diarias from './Diarias';
import { useNavigate } from 'react-router-dom';
import { getAreas } from '../auth/firebaseAreaSubarea';
import { getDias, inserirDias } from '../auth/firebaseDiasHoras';
import { getListaTarefas, substituirTarefasGerais } from '../auth/firebaseTarefas';

function ToDoList({ user }) {
  const [atividades, setAtividades] = useState([]);
  const [pontuacoes, setPontuacoes] = useState({});
  const [dias, setDias] = useState({});
  const [areas, setAreas] = useState({});
  const navigate = useNavigate();


  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      console.log('User ID:', user.uid);
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO - atividades:");
    console.log(atividades)
  }, [atividades]);

  useEffect(() => {
    const fetchData = async () => {
      let atividades = await getListaAtividades(user.uid);

      console.log("atividades")
      console.log(atividades)
      console.log("atividades.atividades")
      console.log(atividades.atividades)

      if (!atividades || atividades.atividades.length === 0) {
        console.log("if")
        atividades = await resetarListaAtividades()
        
      }

      const dataAtual = new Date().toLocaleDateString('pt-BR');
      const areas = await getAreas();
      let pontuacoes = await getPontuacoes(user.uid);
      const dias = await getDias(user.uid);

      /*console.log("pontuacoes do to do")
      console.log(pontuacoes)*/

      if (pontuacoes.length === 0) {
        resetarListaPontuacoes(user, areas, dias)
      }

      setAtividades(atividades.atividades);
      setPontuacoes(pontuacoes);
      setDias(dias)
      setAreas(areas)
      /*console.log("pontuacoes")
      console.log(pontuacoes)*/


    };
    fetchData();
  }, []);

  const resetarListaAtividades = async () => {
    console.log("entrei no resetar lista atv")
    const atividadesObjeto = { userId: user.uid, atividades: [] };

    console.log("atividadesObjeto")
    console.log(atividadesObjeto)

    await setListaAtividades(user.uid, atividadesObjeto.atividades);
    setAtividades(atividadesObjeto.atividades);

    return atividadesObjeto
  }

  const resetarListaPontuacoes = async (user, areas, dias) => {
    let pontuacoes = [];

    //console.log("Iniciando resetarListaPontuacoes");

    dias.forEach(dia => {

      const diaData = {
        data: dia.data,
        areas: []
      };

      areas.forEach(area => {
        const areaData = {
          areaId: area.id,
          pontos: 0,
          subareas: []
        };

        area.subareas.forEach(subarea => {
          areaData.subareas.push({
            subareaId: subarea.id,
            pontos: 0
          });
        });

        diaData.areas.push(areaData);
      });

      pontuacoes.push(diaData);
    });

    await updatePontuacoes(user.uid, pontuacoes);

    /*console.log("pontuacoes do final do reset");
    console.log(pontuacoes);*/

    return pontuacoes;
  };




  /*useEffect(() => {
    console.log("Estado atualizadOOOOOO - atividades:");
    console.log(atividades)
  }, [atividades]);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO - pontuacoes:");
    console.log(pontuacoes)
  }, [pontuacoes]);*/

/*  useEffect(() => {
    console.log("Estado atualizadOOOOOO - dias:");
    console.log(dias)
  }, [dias]);*/

  /*useEffect(() => {
    console.log("Estado atualizadOOOOOO - areas:");
    console.log(areas)
  }, [areas]);*/


  return (
    <div>
      <h1>To-Do List</h1>

      <BarraPontuacoes pontuacoes={pontuacoes} setPontuacoes={setPontuacoes} areas={areas} setAreas={setAreas} resetarListaPontuacoes={() => resetarListaPontuacoes(user, areas, dias)} user={user} />

      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Diarias user={user} pontuacoes={pontuacoes} setPontuacoes={setPontuacoes} areas={areas} setAreas={setAreas} />
        </div>

        <div style={{ flex: 1 }}>
          <ListaAtividades
            user={user}
            atividades={atividades}
            setAtividades={setAtividades}
            pontuacoes={pontuacoes}
            setPontuacoes={setPontuacoes}
            areas={areas}
            setAreas={setAreas}
            dias={dias}
            setDias={setDias}
            resetarListaAtividades={resetarListaAtividades}
          />
        </div>
      </div>
    </div>
  );
}

export default ToDoList;
