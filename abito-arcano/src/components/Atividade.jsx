import React, { useState, useEffect } from 'react';
import { getCorArea } from '../auth/firebaseAreaSubarea';

function Atividade({ atividade, onEdit, onDelete, onToggle, areas }) {

    const [corArea, setCorArea] = useState('#000');

    /*useEffect(() => {
        const fetchCorArea = async () => {
            const cor = await getCorArea(atividade.area);
            setCorArea(cor);
        };
        fetchCorArea();
    }, [atividade.area]);*/

    useEffect(() => {

        if (areas) {
            const areaEncontrada = areas.find(a => a.nome === atividade.area);
            if (areaEncontrada) {
                setCorArea(areaEncontrada.cor);
            }
        }

    }, [atividade.area, areas]);

    return (
        <div>
            <input
                type="checkbox"
                checked={atividade.finalizada}
                onChange={onToggle}
            />
            {atividade.nome} - <span style={{ backgroundColor: corArea, padding: '0 5px', borderRadius: '5px' }}>{atividade.numero}</span> - <span style={{ backgroundColor: corArea, padding: '0 5px', borderRadius: '5px' }}>{atividade.area}</span> - {atividade.subarea}
            <button onClick={onEdit}>Editar</button>
            <button onClick={onDelete}>Excluir</button>
        </div>
    );
}

export default Atividade;
