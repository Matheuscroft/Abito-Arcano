import React, { useEffect } from 'react';
import { updateListas } from './listaUtils';
import CorDaArea from './CorDaArea';
import FormSetasOrdenar from '../componentes/forms/FormSetasOrdenar/FormSetasOrdenar';
import InputCheckboxLista from './InputCheckboxLista';

const Lista = ({ user, listas, setListasLocal, lista, onDelete, handleToggleItem, onClick, areas, onMove, handleResetar }) => {

    /* useEffect(() => {
         console.log("Estado atualizadOOOOOO - novas lista do lista:");
         console.log(lista)
       }, [lista]);*/

    return (
        <div className="lista-card">
            <h3>{lista.nome} ({lista.tipo})</h3>
            <div className="select-row">
                <p>{areas.find(area => area.id === lista.areaId)?.nome || "SEM CATEGORIA"}</p>
                <CorDaArea areaId={lista.areaId} areas={areas} className="cor-da-area" />
            </div>
            <FormSetasOrdenar
                onMove={(itemId, direction) => onMove(itemId, direction)}
                item={lista}
                lista={listas}
            />
            <button onClick={() => onClick(lista)}>Ver Lista</button>
            <button onClick={() => onDelete(lista.id)}>Excluir</button>
            <button onClick={() => handleResetar(lista)}>Resetar checklists</button>
            <ul>
                {(Array.isArray(lista.itens) ? lista.itens : []).map(item => (
                    <InputCheckboxLista
                        key={item.id}
                        item={item}
                        onToggle={() => handleToggleItem(lista, item.id)}
                    />
                ))}
            </ul>

        </div >
    );
};

export default Lista;
