import React, { useState } from 'react';
import { updateLocalList } from './listaUtils';
import { v4 as uuidv4 } from 'uuid';

const InputAdicionarItem = ({ listas, user, lista, setListasLocal, updateListas }) => {
  const [novoItem, setNovoItem] = useState('');
  const [tipoItem, setTipoItem] = useState('checklist');
  const [listaLocal, setListaLocal] = useState(lista);

  const handleAddItem = () => {
    if (novoItem.trim()) {
      let novoChecklistItem;

      if (tipoItem === 'checklist') {
        novoChecklistItem = {
          id: uuidv4(),
          nome: novoItem,
          completed: false,
          tipo: 'checklist',
        };
      } else if (tipoItem === 'paragrafo') {
        novoChecklistItem = {
          id: uuidv4(),
          nome: novoItem,
          tipo: 'paragrafo',
        };
      } else if (tipoItem === 'lista') {
        novoChecklistItem = {
          id: uuidv4(),
          nome: novoItem,
          tipo: 'lista',
          itens: [],
        };
      }

      updateListas(user.uid, lista.id, listas, setListasLocal, novoChecklistItem);
      const listaAtualizada = updateLocalList(listaLocal, novoChecklistItem, null);
      setListaLocal(listaAtualizada);
      setNovoItem('');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Adicionar item"
        value={novoItem}
        onChange={(e) => setNovoItem(e.target.value)}
      />
      <select value={tipoItem} onChange={(e) => setTipoItem(e.target.value)}>
        <option value="checklist">Checklist</option>
        <option value="paragrafo">Parágrafo</option>
        <option value="lista">Lista</option>
      </select>
      <button onClick={handleAddItem}>Adicionar Item</button>
    </div>
  );
};

export default InputAdicionarItem;
