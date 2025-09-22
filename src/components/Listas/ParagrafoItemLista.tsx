import React from 'react';
import './ItemLista.css';
import type { TextItem } from '@/types/item';

interface ParagrafoItemListaProps {
  item: TextItem;
}

const ParagrafoItemLista: React.FC<ParagrafoItemListaProps> = ({ item }) => {
  return (
    <div className="parent-div">
      <p style={{ display: 'inline-block' }}>{item.title}</p>
    </div>
  );
};


export default ParagrafoItemLista;
