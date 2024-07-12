import React, { useState, useEffect } from 'react';
import {
  getPontuacoes,
  updatePontuacao,
  getAreas
} from '../auth/firebaseService';

function BarraPontuacoes({ tarefas, atividades, pontuacoe }) {
  const [pontuacoes, setPontuacoes] = useState(pontuacoe);
  const [areas, setAreas] = useState([]);
  const [subAreas, setSubAreas] = useState([]);
  const [mostrarSubareas, setMostrarSubareas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const pontuacoes = await getPontuacoes();
      const areas = await getAreas();

      const areasComSubareas = areas.map(area => ({
        ...area,
        subareas: area.subareas || []
      }));

      const todasSubareas = areas.reduce((acc, area) => {
        if (area.subareas) {
          acc.push(...area.subareas);
        }
        return acc;
      }, []);

      setPontuacoes(pontuacoes);
      setAreas(areasComSubareas);
      setSubAreas(todasSubareas);
    };

    fetchData();
  }, [pontuacoe]);

  const calcularPontuacoesSubareas = (itens) => {
    const pontuacoesSubareas = {};
    itens.forEach(item => {
      if (item.finalizada && item.subarea) {
        if (!pontuacoesSubareas[item.subarea]) {
          pontuacoesSubareas[item.subarea] = 0;
        }
        pontuacoesSubareas[item.subarea] += item.numero;
      }
    });
    return pontuacoesSubareas;
  };

  const pontuacoesSubareas = calcularPontuacoesSubareas([...tarefas, ...atividades]);

  return (
    <div>
      <div className="barra-pontuacoes">
        {areas.map((area) => (
          <div key={area.id} className="card-pontuacao" style={{ backgroundColor: area.cor }}>
            <div>{area.nome}</div>
            <div>{pontuacoes[area.nome] || 0}</div>
          </div>
        ))}
      </div>

      <button onClick={() => setMostrarSubareas(!mostrarSubareas)}>
        {mostrarSubareas ? 'Esconder Subáreas' : 'Mostrar Subáreas'}
      </button>

      {mostrarSubareas && (
        <div className="barra-pontuacoes">
          {areas.map((area) => (
            <div key={area.id} style={{ marginBottom: '10px', display: "flex" }}>
              {area.subareas.map((subarea) => (
                <div key={subarea.id} className="card-pontuacao" style={{ backgroundColor: area.cor }}>
                  <div>{subarea.nome}</div>
                  <div>{pontuacoesSubareas[subarea.nome] || 0}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default BarraPontuacoes;
