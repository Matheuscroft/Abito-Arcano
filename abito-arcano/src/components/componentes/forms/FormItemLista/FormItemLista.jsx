import React, { useState } from 'react';
import FormSetasOrdenar from '../FormSetasOrdenar/FormSetasOrdenar';
import './FormItemLista.css';

const FormItemLista = ({ item, onEdit, lista, onDelete, onMove, index }) => {
 
    return (
        <div className='form-item-lista-div'>
            {item && index !== undefined && (
                <>

                    <button style={{ marginLeft: '50px' }} onClick={() => onEdit(index, -1)}>Editar</button>
                    <button onClick={() => onDelete(item.id)}>X</button>
                    
                    <FormSetasOrdenar onMove={onMove} index={index} lista={lista}/>
                </>
            )}
        </div>
    );
};

export default FormItemLista;
