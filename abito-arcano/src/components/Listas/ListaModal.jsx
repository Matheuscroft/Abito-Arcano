import React, { useState } from 'react';
import { updateLocalList } from './listaUtils';
import { v4 as uuidv4 } from 'uuid';
import EditorItemLista from './EditorItemLista';
import ItemLista from './ItemLista';
import InputAdicionarItem from './InputAdicionarItem';

const ListaModal = ({ listas, user, lista, onClose, setListasLocal, updateListas }) => {
  const [novoItem, setNovoItem] = useState('');
  const [tipoItem, setTipoItem] = useState('checklist');
  const [listaLocal, setListaLocal] = useState(lista);
  const [itemEditando, setItemEditando] = useState()

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

  const handleToggleItem = (itemId) => {
    const item = listaLocal.itens.find((item) => item.id === itemId);

    if (item.tipo === 'checklist') {
      updateListas(user.uid, lista.id, listas, setListasLocal, null, item);
      const listaAtualizada = updateLocalList(listaLocal, null, item);
      setListaLocal(listaAtualizada);
    }
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

  const atualizarItem = (id, nome, tipo) => {

    const itemAtualizado = {
      ...itemEditando,
      nome: nome,
      tipo: tipo
    }
    console.log("itemAtualizado")
    console.log(itemAtualizado)

    const itensAtualizados = listaLocal.itens.map(item =>
      item.id === itemAtualizado.id 
        ? itemAtualizado
        : item
    );

    console.log("itensAtualizados")
    console.log(itensAtualizados)

    const listaAtualizada = { ...listaLocal, itens: itensAtualizados };
    setListaLocal(listaAtualizada);
    updateListas(user.uid, lista.id, listas, setListasLocal, null, null, null, itensAtualizados);


    

    //await setListaAtividades(userId, atividadesAtualizadas);


    //setItems(atividadesAtualizadas);
  }

  const handleSave = (nome, tipo) => {
    console.log("entrei")
    console.log("nome")
    console.log(nome)
    console.log("tipo")
    console.log(tipo)
    atualizarItem(itemEditando, nome, tipo)
  }

  return (
    <div className="modal">
      <h2>{listaLocal.nome}</h2>
      <p>Tipo: {listaLocal.tipo}</p>

      <InputAdicionarItem listas={listas} user={user} lista={lista} setListasLocal={setListasLocal} updateListas={updateListas}/>

      <ul>
        {listaLocal.itens && listaLocal.itens.map((item, index) => (
          <li key={item.id}>

            <ItemLista item={item} index={index} lista={lista} onEdit={() => setItemEditando(item)} onDelete={handleDeleteItem} onToggle={handleToggleItem} onMove={moveItem}/>

            {itemEditando && itemEditando === item && (
              <EditorItemLista
                item={itemEditando}
                setItemEditando={setItemEditando}
                onSave={(nome, tipo) => handleSave(nome, tipo)}
              />
            )}

          </li>
        ))}
      </ul>

      
      <button onClick={onClose}>Fechar</button>
    </div>
  );
};

export default ListaModal;
