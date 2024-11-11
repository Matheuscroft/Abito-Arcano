import React, { useState } from 'react';
import { updateLocalList } from './listaUtils';
import { v4 as uuidv4 } from 'uuid';
import InputAdicionarNome from '../componentes/inputs/InputAdicionarNome/InputAdicionarNome'

const FormAdicionarItem = ({ listas, user, lista, setListasLocal, updateListas, listaAninhada = null }) => {
  const [nomeNovoItem, setNomeNovoItem] = useState('');
  const [tipoItem, setTipoItem] = useState('checklist');
  const [listaLocal, setListaLocal] = useState(lista);

  /*const handleAddItem = () => {
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
  };*/

  const addItemToList = (lista, targetId, novoItem) => {
    if (lista.id === targetId) {
      return {
        ...lista,
        itens: [...(lista.itens || []), novoItem],
      };
    }
  
    if (lista.itens && lista.itens.length > 0) {
      return {
        ...lista,
        itens: lista.itens.map((subItem) => addItemToList(subItem, targetId, novoItem)),
      };
    }
  
    return lista;
  };

  const handleAddItem = () => {

    if (nomeNovoItem.trim()) {

      const novoChecklistItem = {
        id: uuidv4(),
        nome: nomeNovoItem,
        completed: tipoItem === 'checklist' ? false : undefined,
        tipo: tipoItem,
        itens: tipoItem === 'lista' ? [] : undefined,
      };


      let listaAtualizada;

      if (listaAninhada) {
        listaAtualizada = addItemToList(lista, listaAninhada.id, novoChecklistItem);
      } else {
        listaAtualizada = addItemToList(lista, lista.id, novoChecklistItem);
      }

      console.log("Lista Principal Atualizada:", listaAtualizada);

      updateListas(user.uid, lista, listas, setListasLocal, listaAtualizada);

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
