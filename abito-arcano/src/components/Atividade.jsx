import React, { useState, useEffect } from 'react';
import { setarCorAreaETexto } from './utils';

function Atividade({ atividade, onEdit, onDelete, onToggle, areas }) {

    const [corArea, setCorArea] = useState('#000');
    const [corTexto, setCorTexto] = useState('#fff');


    useEffect(() => {
        if (Array.isArray(areas) && atividade.areaId) {

            setarCorAreaETexto(atividade, areas, setCorArea, setCorTexto)
            console.log("SETOU COR")

        } else {
            console.log("areas não é um array ou tarefa não possui areaId");
        }
    }, [atividade.areaId, areas]);;

    return (
        <div>
            <input
                type="checkbox"
                checked={atividade.finalizada}
                onChange={onToggle}
            />
            {atividade.nome} -
            <span style={{ backgroundColor: corArea, color: corTexto, padding: '0 5px', borderRadius: '5px' }}>
                {"+" + atividade.numero + " " + atividade.area}
            </span>
            {atividade.subarea ? ` - ${atividade.subarea}` : ""}
            <button onClick={onEdit}>Editar</button>
            <button onClick={onDelete}>Excluir</button>
        </div>
    );
}

export default Atividade;
