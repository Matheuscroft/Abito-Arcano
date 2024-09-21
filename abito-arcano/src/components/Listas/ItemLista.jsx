import React, { useState } from 'react';

const ItemLista = ({ item, onEdit, lista, onDelete, onToggle, areas, onMove, index }) => {
    const [novoItem, setNovoItem] = useState('');
    const [tipoItem, setTipoItem] = useState('checklist');
    const [listaLocal, setListaLocal] = useState(lista);



    return (
        <div>
            {item && index !== undefined && (
                <>
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
                    {item.tipo === 'paragrafo' && <p>{item.nome}</p>}
                    {item.tipo === 'lista' && <p>Lista: {item.nome}</p>}

                    <button style={{ marginLeft: '50px' }} onClick={() => onEdit(index, -1)} disabled={index === 0}>Editar</button>
                    <button onClick={() => onDelete(item.id)}>X</button>
                    <button onClick={() => onMove(index, -1)} disabled={index === 0}>↑</button>
                    <button onClick={() => onMove(index, 1)} disabled={index === lista.itens.length - 1}>↓</button>
                </>
            )}




        </div>
    );
};

export default ItemLista;
