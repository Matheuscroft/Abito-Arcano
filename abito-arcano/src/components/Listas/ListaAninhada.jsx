import React, { useEffect, useState } from 'react';
import './ItemLista.css'
import FormAdicionarItem from './FormAdicionarItem';
import ItemLista from './ItemLista';
import EditorItemLista from './EditorItemLista';

const ListaAninhada = ({ listas, user, item, lista, onToggle, setListasLocal, updateListas, index, onSave, onDelete, onMove }) => {

  const [itemEditando, setItemEditando] = useState()

 /* useEffect(() => {
    console.log("Estado atualizadOOOOOO - item:");
    console.log(item)
  }, [item]);*/

  return (
    <div className='lista-aninhada'>
      <label>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => onToggle(lista, item.id)}
        />
        <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
          {item.nome}
        </span>
      </label>
      <FormAdicionarItem listas={listas} user={user} lista={lista} setListasLocal={setListasLocal} updateListas={updateListas} listaAninhada={item} />

      <ul>
        {Array.isArray(item.itens) && item.itens.length === 0 ? (
          <li>Lista vazia, adicione um item</li>
        ) : (
          item.itens && item.itens.map((item, index) => (
            <li key={item.id}>
              <ItemLista
                listas={listas}
                user={user}
                item={item}
                index={index}
                lista={lista}
                onEdit={() => setItemEditando(item)}
                onDelete={onDelete}
                onToggle={onToggle}
                onMove={onMove}
                setListasLocal={setListasLocal}
                updateListas={updateListas}
                onSave={onSave}
              />

              {itemEditando && itemEditando === item && (
                <EditorItemLista
                  item={itemEditando}
                  setItemEditando={setItemEditando}
                  onSave={(nome, tipo) => onSave(itemEditando, nome, tipo)}
                />
              )}

            </li>
          ))
        )}
      </ul>



    </div>
  );
};

export default ListaAninhada;
