import React from 'react';
import './FormSetasOrdenar.css';
const FormSetasOrdenar = ({ onMove, item, lista }) => {

    return (
        <div className='form-setas-ordenar-div'>
            <button onClick={() => onMove(item.id, -1)} disabled={item.id === 0}>↑</button>
            {lista && lista.itens ? (
                <button onClick={() => onMove(item.id, 1)} disabled={item.id === lista.itens.length - 1}>↓</button>
            ) : (
                <button onClick={() => onMove(item.id, 1)} disabled={item.id === lista?.length - 1}>↓</button>
            )}
        </div>

    );
};

export default FormSetasOrdenar;
