import React, { useState, useEffect } from 'react';
import { getCorArea } from '../auth/firebaseService';

function Tarefa({ tarefa, onEdit, onDelete, onToggle }) {
  const [corArea, setCorArea] = useState('#000');

  useEffect(() => {
    const fetchCorArea = async () => {
      const cor = await getCorArea(tarefa.area);
      setCorArea(cor);
    };
    fetchCorArea();
  }, [tarefa.area]);

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
