import React from 'react';
import './InputAdicionarNome.css';

const InputAdicionarNome = ({ placeholder, nomeNovo, setNomeNovo, handleAddItem }) => {
  

  return (
    <div className='input-adicionar-nome-div'>
      <input
        type="text"
        placeholder={placeholder}
        value={nomeNovo}
        onChange={(e) => setNomeNovo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleAddItem();
          }
        }}
      />
    </div>
  );
};

export default InputAdicionarNome;
