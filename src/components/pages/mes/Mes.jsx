import React, { useState, useEffect } from 'react';
import InputAdicionarNome from '../../componentes/inputs/InputAdicionarNome/InputAdicionarNome';

const Mes = ({ user }) => {
    const [listas, setListasLocal] = useState([]);
    const [selectedLista, setSelectedLista] = useState(null);

    const [nomeNovoItem, setNomeNovoItem] = useState('');
    const [tipoItem, setTipoItem] = useState('checklist');

    const [quests, setQuestsLocal] = useState([]);

    const handleAddItem = () => {
        if (nomeNovoItem.trim()) {
            let novoChecklistItem;



            //updateListas(user.uid, lista.id, listas, setListasLocal, novoChecklistItem);
            //const listaAtualizada = updateLocalList(listaLocal, novoChecklistItem, null);
            //setListaLocal(listaAtualizada);
            //setNomeNovoItem('');
        }
    };



    return (
        <div>


            <div >

                <h1>Mês Atual:</h1>
                <h2>Outubro</h2>

            </div>

            <InputAdicionarNome
                placeholder={'Adicione uma quest'}
                nomeNovo={nomeNovoItem}
                setNomeNovo={setNomeNovoItem}
                handleAddItem={handleAddItem}
            />





        </div>
    );
};

export default Mes;
