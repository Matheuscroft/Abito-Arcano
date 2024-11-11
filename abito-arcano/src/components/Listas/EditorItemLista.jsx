import React, { useState, useEffect } from 'react';
import './listas.css';

function EditorItemLista({ item, onSave, setItemEditando }) {
    const [nome, setNome] = useState(item.nome);
    const [tipo, setTipo] = useState(item.tipo);


    const handleSave = () => {
        setItemEditando(false);
        onSave(nome, tipo);
    };

    useEffect(() => {
        console.log("Estado atualizadOOOOOO - item do editoritemlista:");
        console.log(item)
      }, [item]);


    return (
        <div className='editor-item-lista-div'>
            <h4>Editar Item</h4>
            <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={`Digite o nome da `}
            />
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Selecione um tipo</option>
                <option value="checklist">Checklist</option>
                <option value="texto">Texto</option>
                <option value="lista">Lista</option>
            </select>

            <button onClick={handleSave}>Salvar</button>
        </div>
    );
}

export default EditorItemLista;
