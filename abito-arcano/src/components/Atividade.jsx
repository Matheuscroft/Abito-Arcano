import React, { useState, useEffect } from 'react';
import { setarCorAreaETexto } from './utils';
import FormBotoesEditarEDelete from './componentes/forms/FormBotoesEditarEDelete/FormBotoesEditarEDelete';

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
        <div className="parent-div">
            <div className="left-content">
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
            </div>
            <div className="right-content">
                <FormBotoesEditarEDelete item={atividade} onEdit={onEdit} onDelete={onDelete} index={areas}/>
            </div>
        </div>
    );
}

export default Atividade;
