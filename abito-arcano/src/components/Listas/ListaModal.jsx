import React, { useState } from 'react';
import { updateLocalList } from './listaUtils';
import { v4 as uuidv4 } from 'uuid';

const ListaModal = ({ listas, user, lista, onClose, setListasLocal, updateListas }) => {
  const [novoItem, setNovoItem] = useState('');
  const [listaLocal, setListaLocal] = useState(lista);

  const handleAddItem = () => {
    if (novoItem.trim()) {
      const novoChecklistItem = {
        id: uuidv4(),
        nome: novoItem,
        completed: false,
      };
  
      updateListas(user.uid, lista.id, listas, setListasLocal, novoChecklistItem);
  
      const listaAtualizada = updateLocalList(listaLocal, novoChecklistItem, null);
      setListaLocal(listaAtualizada);
  
      setNovoItem('');
    }
  };
  

  const handleToggleItem = (itemId) => {
    const item = listaLocal.itens.find((item) => item.id === itemId);
    
    updateListas(user.uid, lista.id, listas, setListasLocal, null, item);
  
    const listaAtualizada = updateLocalList(listaLocal, null, item);
    setListaLocal(listaAtualizada);
  };
  

  const handleDeleteItem = async (itemId) => {
    const item = listaLocal.itens.find((item) => item.id === itemId);
  
    await updateListas(user.uid, lista.id, listas, setListasLocal, null, null, item);
  
    const listaAtualizada = updateLocalList(listaLocal, null, null, item);
    setListaLocal(listaAtualizada);
  };

  const moveItem = (index, direction) => {

    const novosItens = [...listaLocal.itens];
    const targetIndex = index + direction;

    if (targetIndex >= 0 && targetIndex < novosItens.length) {

      const temp = novosItens[index];
      novosItens[index] = novosItens[targetIndex];
      novosItens[targetIndex] = temp;

      const listaAtualizada = { ...listaLocal, itens: novosItens };
      setListaLocal(listaAtualizada);

      updateListas(user.uid, lista.id, listas, setListasLocal, null, null, null, novosItens);

    }

  };
  

  return (
    <div className="modal">
      <h2>{listaLocal.nome}</h2>
      <p>Tipo: {listaLocal.tipo}</p>
      
      <ul>
        {listaLocal.itens && listaLocal.itens.map((item, index) => (
          <li key={item.id}>
            <label>
              <input 
                type="checkbox" 
                checked={item.completed} 
                onChange={() => handleToggleItem(item.id)} 
              />
              <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                {item.nome}
              </span>
              <button onClick={() => handleDeleteItem(item.id)}>X</button>
              <button onClick={() => moveItem(index, -1)} disabled={index === 0}>↑</button>
              <button onClick={() => moveItem(index, 1)} disabled={index === listaLocal.itens.length - 1}>↓</button>
            </label>
          </li>
        ))}
      </ul>

      <input 
        type="text" 
        placeholder="Adicionar item" 
        value={novoItem} 
        onChange={(e) => setNovoItem(e.target.value)} 
      />
      <button onClick={handleAddItem}>Adicionar Item</button>
      <button onClick={onClose}>Fechar</button>
    </div>
  );
};

export default ListaModal;
