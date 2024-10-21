import React, {  } from 'react';
import './FormBotoesEditarEDelete.css';

const FormBotoesEditarEDelete = ({ item, onEdit, onDelete, index }) => {
 
   /* const handleEdit = (item, lista, atualizarLista, atualizarFirebase) => {
        atualizarFirebase(item).then(() => {
          atualizarLista([...lista.filter(i => i.id !== item.id), itemAtualizado]);
        });
      };*/
      
     /* const handleDelete = (item, lista, atualizarLista, atualizarFirebase) => {
        atualizarFirebase(item.id).then(() => {
          atualizarLista(lista.filter(i => i.id !== item.id));
        });

        const item = listaLocal.itens.find((item) => item.id === itemId);
        //await updateListas(user.uid, lista.id, listas, setListasLocal, null, null, item);
        const listaAtualizada = updateLocalList(listaLocal, null, null, item);
        setListaLocal(listaAtualizada);

      };*/
      

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
