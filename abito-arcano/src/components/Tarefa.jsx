import React from 'react';

function Tarefa({ tarefa, onEdit, onDelete, onToggle }) {
  return (
    <div>
      <input
        type="checkbox"
        checked={tarefa.finalizada}
        onChange={onToggle}
      />
      {tarefa.nome} - Categoria: {tarefa.categoria || 'Nenhuma'}
      <button onClick={onEdit}>Editar</button>
      <button onClick={onDelete}>Excluir</button>
    </div>
  );
}

export default Tarefa;
