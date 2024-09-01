import React, { useState, useEffect } from 'react';
import { getCorArea } from '../auth/firebaseAreaSubarea';

function Tarefa({ tarefa, onEdit, onDelete, onToggle, areas }) {
  const [corArea, setCorArea] = useState('#000');


  useEffect(() => {
    if (Array.isArray(areas)) {
      const areaEncontrada = areas.find(a => a.id === tarefa.areaId);
      if (areaEncontrada) {
        setCorArea(areaEncontrada.cor);
      } else {
        setCorArea('#000'); 
      }
    }
  }, [tarefa.area, areas]);

  useEffect(() => {

    console.log("qual é areas")
      console.log(areas)
      console.log("areas.areas")
      console.log(areas.areas)
      console.log("tarefa")
      console.log(tarefa)

    /*if (areas.areas) {
      console.log("qual é areas")
      console.log(areas)
      const areaEncontrada = areas.find(a => a.nome === tarefa.area);
      if (areaEncontrada) {
        setCorArea(areaEncontrada.cor);
      }
    }*/


  }, [tarefa.area, areas]);

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

export default Tarefa;
