import React from 'react';

const SelectTipoLista = ({ tipo, setTipo, onSave }) => {
  const handleChange = (e) => {
    const novoTipo = e.target.value;
    setTipo(novoTipo);
    if (onSave) {
      onSave(novoTipo);
    }
  };

  return (
    <select value={tipo} onChange={handleChange}>
      <option value="lista">Lista</option>
      <option value="treino">Treino</option>
      <option value="checklist">Checklist</option>
    </select>
  );
};

export default SelectTipoLista;
