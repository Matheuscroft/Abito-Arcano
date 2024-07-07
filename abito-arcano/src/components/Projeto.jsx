import React from 'react';
import { useParams } from 'react-router-dom';

function Projeto() {
  const { nomeProjeto } = useParams();

  return (
    <div>
      <h1>{nomeProjeto}</h1>
    </div>
  );
}

export default Projeto;
