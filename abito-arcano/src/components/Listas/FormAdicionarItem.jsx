import React, { useState } from 'react';
import { updateLocalList } from './listaUtils';
import { v4 as uuidv4 } from 'uuid';
import InputAdicionarNome from '../componentes/inputs/InputAdicionarNome/InputAdicionarNome'

const FormAdicionarItem = ({ listas, user, lista, setListasLocal, updateListas }) => {
  const [nomeNovoItem, setNomeNovoItem] = useState('');
  const [tipoItem, setTipoItem] = useState('checklist');
  const [listaLocal, setListaLocal] = useState(lista);

  const handleAddItem = () => {
    if (nomeNovoItem.trim()) {
      let novoChecklistItem;

      if (tipoItem === 'checklist') {
        novoChecklistItem = {
          id: uuidv4(),
          nome: nomeNovoItem,
          completed: false,
          tipo: 'checklist',
        };
      } else if (tipoItem === 'paragrafo') {
        novoChecklistItem = {
          id: uuidv4(),
          nome: nomeNovoItem,
          tipo: 'paragrafo',
        };
      } else if (tipoItem === 'lista') {
        novoChecklistItem = {
          id: uuidv4(),
          nome: nomeNovoItem,
          tipo: 'lista',
          itens: [],
        };
      }

      updateListas(user.uid, lista.id, listas, setListasLocal, novoChecklistItem);
      const listaAtualizada = updateLocalList(listaLocal, novoChecklistItem, null);
      setListaLocal(listaAtualizada);
      setNomeNovoItem('');
    }
  };

  return (
    <div>
      <InputAdicionarNome placeholder="Adicionar item" nomeNovo={nomeNovoItem} setNomeNovo={setNomeNovoItem} handleAddItem={handleAddItem} />
      
      <select value={tipoItem} onChange={(e) => setTipoItem(e.target.value)}>
        <option value="checklist">Checklist</option>
        <option value="paragrafo">Parágrafo</option>
        <option value="lista">Lista</option>
      </select>
      <button onClick={handleAddItem}>Adicionar Item</button>
    </div>
  );
};

export default FormAdicionarItem;
