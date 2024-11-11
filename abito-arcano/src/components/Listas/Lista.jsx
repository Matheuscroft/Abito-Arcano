import React, { useEffect } from 'react';
import { updateListas } from './listaUtils';
import CorDaArea from './CorDaArea';

const Lista = ({ user, listas, setListasLocal, lista, onDelete, onEdit, onClick, areas }) => {

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
            <button onClick={() => onClick(lista)}>Ver Lista</button>
            <button onClick={() => onDelete(lista.id)}>Excluir</button>
            <ul>
                {(Array.isArray(lista.itens) ? lista.itens : []).map((item) => (
                    <li key={item.id} style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => updateListas(user.uid, lista.id, listas, setListasLocal, null, item.id)}
                        />
                        {item.nome}
                    </li>
                ))}
            </ul>

        </div >
    );
};

export default Lista;
