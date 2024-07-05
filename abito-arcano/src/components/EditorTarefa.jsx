import React, { useState } from 'react';

function EditorTarefa({ tarefa, onSave }) {
  const [categoria, setCategoria] = useState(tarefa.categoria);

  const handleSave = () => {
    onSave(categoria);
  };

  return (
    <div>
      <h2>Editar Tarefa</h2>
      <input
        type="text"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        placeholder="Digite a categoria"
      />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}

export default EditorTarefa;
