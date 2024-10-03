import React, {  } from 'react';
import './FormBotoesEditarEDelete.css';

const FormBotoesEditarEDelete = ({ item, onEdit, onDelete, index }) => {
 
    return (
        <div className='form-item-lista-div'>
            {item && index !== undefined && (
                <>

                    <button style={{ marginLeft: '50px' }} onClick={() => onEdit(index, -1)}>Editar</button>
                    <button className='form-botoes-editar-delete-button-delete' onClick={() => onDelete(item.id)}>X</button>
                    
                </>
            )}
        </div>
    );
};

export default FormBotoesEditarEDelete;
