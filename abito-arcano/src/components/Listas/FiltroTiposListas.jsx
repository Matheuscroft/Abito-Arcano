import React, { useState, useEffect } from 'react';

const FiltroTiposListas = ({ listas, onFilterChangeTipo }) => {
  const [selectedTipos, setSelectedTipos] = useState([]);
  const [tiposDisponiveis, setTiposDisponiveis] = useState([]);

  useEffect(() => {
    const tiposUnicos = [...new Set(listas?.map(lista => lista.tipo))];
    setTiposDisponiveis(tiposUnicos);
  }, [listas]);

  const toggleTipo = (tipo) => {
    let updatedSelectedTipos;
    if (selectedTipos.includes(tipo)) {
      updatedSelectedTipos = selectedTipos.filter(t => t !== tipo);
    } else {
      updatedSelectedTipos = [...selectedTipos, tipo];
    }
    setSelectedTipos(updatedSelectedTipos);
    onFilterChangeTipo(updatedSelectedTipos);
  };

  return (
    <div className="filtro-tipos-listas">
      {tiposDisponiveis.map(tipo => (
        <button
          key={tipo}
          onClick={() => toggleTipo(tipo)}
          style={{
            border: selectedTipos.includes(tipo) ? '2px solid #333' : '1px solid #ccc',
            backgroundColor: selectedTipos.includes(tipo) ? '#333' : 'transparent',
            color: selectedTipos.includes(tipo) ? '#fff' : '#000',
            padding: '8px',
            margin: '5px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {tipo}
        </button>
      ))}
    </div>
  );
};

export default FiltroTiposListas;
