import React, { useState } from 'react';

const ListaForm = ({ addLista }) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('lista');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nome.trim()) {
      addLista({ nome, tipo });
      setNome('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Nome da lista" 
        value={nome} 
        onChange={(e) => setNome(e.target.value)} 
      />
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="lista">Lista</option>
        <option value="treino">Treino</option>
        <option value="checklist">Checklist</option>
      </select>
      <button type="submit">Criar Lista</button>
    </form>
  );
};

export default ListaForm;
