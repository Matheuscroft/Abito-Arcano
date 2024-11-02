import React from 'react';
import FormItemLista from '../componentes/forms/FormItemLista/FormItemLista';
import './ItemLista.css'
import ListaAninhada from './ListaAninhada';

const ItemLista = ({ item, onEdit, lista, onDelete, onToggle, areas, onMove, index }) => {
    
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
                        onChange={() => onToggle(item.id)}
                      />
                      <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                        {item.nome}
                      </span>
                    </label>
                  )}
                  {item.tipo === 'paragrafo' && <p style={{ display: 'inline-block' }}>{item.nome}</p>}
                  {item.tipo === 'lista' && <ListaAninhada item={item} lista={lista}/>}
                </div>
        
                <div className="right-content">
                  <FormItemLista item={item} onEdit={onEdit} lista={lista} onDelete={onDelete} onMove={onMove} index={index} />
                </div>
              </>
            )}




        </div>
    );
};

export default ItemLista;
