import React, { useState, useEffect } from 'react';
import { setarCorAreaETexto } from './utils';

function Tarefa({ tarefa, onEdit, onDelete, onToggle, areas }) {
  const [corArea, setCorArea] = useState('#000');
  const [corTexto, setCorTexto] = useState('#fff');

  useEffect(() => {
    if (Array.isArray(areas) && tarefa.areaId) {

      setarCorAreaETexto(tarefa, areas, setCorArea, setCorTexto)

    } else {
      console.log("areas não é um array ou tarefa não possui areaId");
    }
  }, [tarefa.areaId, areas]);

  return (
    <div>
      <input
        type="checkbox"
        checked={tarefa.finalizada}
        onChange={onToggle}
      />
      {tarefa.nome} - 
      <span style={{ backgroundColor: corArea, color: corTexto, padding: '0 5px', borderRadius: '5px' }}>
        {"+"+ tarefa.numero + " " + tarefa.area}
      </span>
      {tarefa.subarea ? ` - ${tarefa.subarea}` : ""}
      <button onClick={onEdit}>Editar</button>
      <button onClick={onDelete}>Excluir</button>
    </div>
  );
}

export default Tarefa;
