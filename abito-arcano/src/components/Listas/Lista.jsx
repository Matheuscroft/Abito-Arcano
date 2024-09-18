import React from 'react';
import { updateListas } from './listaUtils';

const Lista = ({ user, listas, setListasLocal, lista, onDelete, onEdit, onClick }) => {
    return (
        <div className="lista-card">
            <h3>{lista.nome} ({lista.tipo})</h3>
            <button onClick={() => onClick(lista)}>Ver Lista</button>
            <button onClick={() => onEdit(lista)}>Editar</button>
            <button onClick={() => onDelete(lista.id)}>Excluir</button>
            <button onClick={onClick}>Abrir</button>
            <ul>
                {lista.itens.map((item) => (
                    <li key={item.id} style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => updateListas(user.uid, lista.id, listas, setListasLocal, null, item.id)}
                        />
                        {item.nome}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Lista;
