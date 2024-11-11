import React from 'react';
import './ItemLista.css'

const ParagrafoItemLista = ({ item }) => {

  return (
    <div className="parent-div">
      <p style={{ display: 'inline-block' }}>{item.nome}</p>
    </div>
  );
};

export default ParagrafoItemLista;
