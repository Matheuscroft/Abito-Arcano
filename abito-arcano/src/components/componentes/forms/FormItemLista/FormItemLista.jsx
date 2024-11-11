import React, {  } from 'react';
import FormSetasOrdenar from '../FormSetasOrdenar/FormSetasOrdenar';
import './FormItemLista.css';
import FormBotoesEditarEDelete from '../FormBotoesEditarEDelete/FormBotoesEditarEDelete';

const FormItemLista = ({ item, onEdit, lista, onDelete, onMove, index, path }) => {
 
    return (
        <div className='form-item-lista-div'>
            {item && index !== undefined && (
                <>

                    <FormBotoesEditarEDelete item={item} onEdit={() => onEdit(path)} onDelete={onDelete} index={index}/>
                    
                    <FormSetasOrdenar onMove={onMove} item={item} lista={lista}/>
                </>
            )}
        </div>
    );
};

export default FormItemLista;
