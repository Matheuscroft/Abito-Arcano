import React, { useState } from 'react';
import InputAdicionarNome from '../componentes/inputs/InputAdicionarNome/InputAdicionarNome';

const ListaForm = ({ addLista }) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('lista');

  const handleSubmit = () => {
    //e.preventDefault();
    if (nome.trim()) {
      addLista({ nome, tipo });
      setNome('');
    }
  };

  return (
    <div>
      <InputAdicionarNome placeholder="Nome da lista" nomeNovo={nome} setNomeNovo={setNome} handleAddItem={handleSubmit}/>
      
      <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
        <option value="lista">Lista</option>
        <option value="treino">Treino</option>
        <option value="checklist">Checklist</option>
      </select>
      <button onClick={handleSubmit}>Criar Lista</button>
    </div>
  );
};

export default ListaForm;
