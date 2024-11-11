import React, { useState } from 'react';

const FiltroAreasListas = ({ areas, onFilterChange }) => {
  const [selectedAreas, setSelectedAreas] = useState([]);

  const toggleArea = (areaId) => {
    let updatedSelectedAreas;
    if (selectedAreas.includes(areaId)) {
      updatedSelectedAreas = selectedAreas.filter(id => id !== areaId);
    } else {
      updatedSelectedAreas = [...selectedAreas, areaId];
    }
    setSelectedAreas(updatedSelectedAreas);
    onFilterChange(updatedSelectedAreas);
  };

  return (
    <div className="filtro-areas-listas">
      {areas.map(area => (
        <button
          key={area.id}
          onClick={() => toggleArea(area.id)}
          style={{
            border: selectedAreas.includes(area.id) ? `2px solid ${area.cor}` : '1px solid #ccc',
            backgroundColor: selectedAreas.includes(area.id) ? area.cor : 'transparent',
            color: selectedAreas.includes(area.id) ? '#fff' : '#000',
            padding: '8px',
            margin: '5px',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {area.nome}
        </button>
      ))}
    </div>
  );
};

export default FiltroAreasListas;
