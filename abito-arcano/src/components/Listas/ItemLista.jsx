import React from 'react';
import FormItemLista from '../componentes/forms/FormItemLista/FormItemLista';
import './ItemLista.css'
import ListaAninhada from './ListaAninhada';
import ParagrafoItemLista from './ParagrafoItemLista';

const ItemLista = ({ listas, user, item, onEdit, lista, onDelete, onToggle, onSave, onMove, index, setListasLocal, updateListas, path = [] }) => {

  const newPath = [...path, index];

  return (
    <div className="parent-div">
      {item && index !== undefined && (
        <>
          <div className="left-content">
            {item.tipo === 'checklist' && (
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
            )}
            {item.tipo === 'texto' && <ParagrafoItemLista item={item}/>}
            {item.tipo === 'lista' && <ListaAninhada listas={listas} user={user} index={index} item={item} lista={lista} onToggle={onToggle} setListasLocal={setListasLocal} updateListas={updateListas} onEdit={onEdit} onDelete={onDelete} onMove={onMove} path={newPath} onSave={onSave}/>}
          </div>

          <div className="right-content">
            <FormItemLista item={item} onEdit={onEdit} lista={lista} onDelete={onDelete} onMove={onMove} index={index} path={newPath} />
          </div>
        </>
      )}




    </div>
  );
};

export default ItemLista;
