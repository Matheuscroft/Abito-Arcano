import React, { useState } from 'react';
import './FormBotoesEditarEDelete.css';

const FormBotoesEditarEDelete = ({ item, onEdit, onDelete, index }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='form-item-lista-div'>
      {item && index !== undefined && (
        <>
          {/* Botão de três pontos */}
          <button onClick={toggleMenu} className="menu-button">⋮</button>
          
          {/* Modal de menu com os botões de edição e exclusão */}
          {isMenuOpen && (
            <div className="menu-modal">
              <button onClick={() => { onEdit(index, -1); toggleMenu(); }}>Editar</button>
              <button className='form-botoes-editar-delete-button-delete' onClick={() => { onDelete(item.id, { listaId: item.id }); toggleMenu(); }}>Excluir</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FormBotoesEditarEDelete;
