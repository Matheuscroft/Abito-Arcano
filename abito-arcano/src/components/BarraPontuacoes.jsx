import React, { useState, useEffect } from 'react';
import { resetPontuacao, getPontuacoes, updatePontuacoes } from '../auth/firebasePontuacoes';

function BarraPontuacoes({ pontuacoes, setPontuacoes, areas, setAreas, resetarListaPontuacoes, user }) {
  const [mostrarSubareas, setMostrarSubareas] = useState(false);

  /*useEffect(() => {
    console.log("Estado atual - areas:", areas);
  }, [areas]);

  useEffect(() => {
    console.log("Areas received: ", areas);
    console.log("Pontuacoes received: ", pontuacoes);
  }, [areas, pontuacoes]);*/

  const calcularPontuacaoTotal = (pontuacoes, areaId, subareaId = null) => {
    if (typeof pontuacoes !== 'object' || pontuacoes === null) {
      console.error('Pontuações inválidas:', pontuacoes);
      return 0;
    }
  

    /*console.log("CALCULAR PONTUACAO TOTAL")
    console.log("pontuacoes")
    console.log(pontuacoes)
    console.log()*/

    let total = 0;
  
    for (let key in pontuacoes) {
      const pontuacao = pontuacoes[key];
  
      /*console.log("key")
      console.log(key)
      console.log("Array.isArray(pontuacao)")
      console.log(Array.isArray(pontuacao))*/

      if (Array.isArray(pontuacao)) {
        pontuacao.forEach(p => {
          if (p && p.areas && Array.isArray(p.areas)) {
            p.areas.forEach(area => {
              if (area.areaId === areaId) {
                if (subareaId) {
                  area.subareas.forEach(subarea => {
                    if (subarea.subareaId === subareaId) {
                      total += subarea.pontos;
                    }
                  });
                } else {
                  total += area.pontos;
                }
              }
            });
          }
        });
      }
    }
  
    return total;
  };
  
  
  

  const resetPontuacaoAreas = async () => {
    let currentPontuacoes = await getPontuacoes(user.uid); 

    const updatedPontuacoes = currentPontuacoes.map(pontuacao => ({
      ...pontuacao,
      areas: pontuacao.areas.map(area => ({
        ...area,
        pontos: 0
      }))
    }));

    await updatePontuacoes(user.uid, updatedPontuacoes); 
    setPontuacoes(updatedPontuacoes);
  };

  const resetPontuacaoSubareas = async () => {
    let currentPontuacoes = await getPontuacoes(user.uid); 

    const updatedPontuacoes = currentPontuacoes.map(pontuacao => ({
      ...pontuacao,
      areas: pontuacao.areas.map(area => ({
        ...area,
        subareas: area.subareas.map(subarea => ({
          ...subarea,
          pontos: 0
        }))
      }))
    }));

    await updatePontuacoes(user.uid, updatedPontuacoes); 
    setPontuacoes(updatedPontuacoes);
  };

  return (
    <div>
      <div>
      <button onClick={resetarListaPontuacoes}>Resetar Lista de Pontuações</button>
        <button onClick={resetPontuacaoAreas}>Resetar Pontuação das Áreas</button>
        <button onClick={resetPontuacaoSubareas}>Resetar Pontuação das Subáreas</button>
      </div>
      <div className="barra-pontuacoes">
        {areas && Array.isArray(areas) && areas.length > 0 ? (
          areas.map((area) => (
            <div key={area.id} className="card-pontuacao" style={{ backgroundColor: area.cor }}>
              <div>{area.nome}</div>
              <div>{calcularPontuacaoTotal(pontuacoes, area.id)}</div>
            </div>
          ))
        ) : (
          <p>Carregando áreas...</p>
        )}
      </div>

      <button onClick={() => setMostrarSubareas(!mostrarSubareas)}>
        {mostrarSubareas ? 'Esconder Subáreas' : 'Mostrar Subáreas'}
      </button>

      {mostrarSubareas && (
        <div className="barra-pontuacoes">
          {areas && Array.isArray(areas) && areas.length > 0 ? (
            areas.map((area) => (
              <div key={area.id} style={{ marginBottom: '10px', display: 'flex' }}>
                {area.subareas.map((subarea) => (
                  <div key={subarea.id} className="card-pontuacao" style={{ backgroundColor: area.cor }}>
                    <div>{subarea.nome}</div>
                    <div>{calcularPontuacaoTotal(pontuacoes, area.id, subarea.id)}</div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>Carregando subáreas...</p>
          )}
        </div>
      )}
    </div>
  );
}

export default BarraPontuacoes;
