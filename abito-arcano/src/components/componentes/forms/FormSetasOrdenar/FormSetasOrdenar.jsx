import React, { useState } from 'react';
import './FormSetasOrdenar.css';
const FormSetasOrdenar = ({ onMove, index, lista}) => {

    return (
        <div className='form-setas-ordenar-div'>
            <button onClick={() => onMove(index, -1)} disabled={index === 0}>↑</button>
            <button onClick={() => onMove(index, 1)} disabled={index === lista.itens.length - 1}>↓</button>
        </div>
    );
};

export default FormSetasOrdenar;
