import React from 'react';

function Tarefa({ tarefa, onEdit, onDelete, onToggle }) {
  const corArea = getCorArea(tarefa.area);

  return (
    <div>
      <input
        type="checkbox"
        checked={tarefa.finalizada}
        onChange={onToggle}
      />
      {tarefa.nome} - <span style={{ backgroundColor: corArea, padding: '0 5px', borderRadius: '5px' }}>{tarefa.numero}</span> - <span style={{ backgroundColor: corArea, padding: '0 5px', borderRadius: '5px' }}>{tarefa.area}</span> - {tarefa.subarea}
      <button onClick={onEdit}>Editar</button>
      <button onClick={onDelete}>Excluir</button>
    </div>
  );
}

const getCorArea = (area) => {
  const areas = JSON.parse(localStorage.getItem('areas')) || [];
  const areaEncontrada = areas.find(a => a.nome === area);
  return areaEncontrada ? areaEncontrada.cor : '#000';
};

export default Tarefa;
