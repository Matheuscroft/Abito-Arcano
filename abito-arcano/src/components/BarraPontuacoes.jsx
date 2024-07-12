import React, { useState, useEffect } from 'react';
import { updatePontuacao, getPontuacoes, getAreas } from '../auth/firebaseService';

function BarraPontuacoes({ pontuacoes, setPontuacoes }) {
  
  const [areas, setAreas] = useState([]);
  const [mostrarSubareas, setMostrarSubareas] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      
      const areas = await getAreas();

      const areasComSubareas = areas.map(area => ({
        ...area,
        subareas: area.subareas || []
      }));

      
      setAreas(areasComSubareas);
    };
    fetchData();
  }, []);

  const resetPontuacaoAreas = async () => {
    const updatedAreas = areas.map(area => ({
      ...area,
      pontuacao: 0
    }));

    for (const area of updatedAreas) {
      await updatePontuacao(area.nome, 0, true);
    }

    setPontuacoes(prev => {
      const newPontuacoes = { ...prev };
      updatedAreas.forEach(area => {
        newPontuacoes[area.nome] = 0;
      });
      return newPontuacoes;
    });
    setAreas(updatedAreas);
  };

  const resetPontuacaoSubareas = async () => {
    const updatedAreas = areas.map(area => ({
      ...area,
      subareas: area.subareas.map(subarea => ({
        ...subarea,
        pontuacao: 0
      }))
    }));

    for (const area of updatedAreas) {
      for (const subarea of area.subareas) {
        await updatePontuacao(subarea.nome, 0, true); 
      }
    }

    setPontuacoes(prev => {
      const newPontuacoes = { ...prev };
      updatedAreas.forEach(area => {
        area.subareas.forEach(subarea => {
          newPontuacoes[subarea.nome] = 0;
        });
      });
      return newPontuacoes;
    });
    setAreas(updatedAreas);
  };

  return (
    <div>
      <div>
        <button onClick={resetPontuacaoAreas}>Resetar Pontuação das Áreas</button>
        <button onClick={resetPontuacaoSubareas}>Resetar Pontuação das Subáreas</button>
      </div>
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
                  <div>{pontuacoes[subarea.nome] || 0}</div>
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
