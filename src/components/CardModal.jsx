import React, { useState } from 'react';
import '../css/CardModal.css';

const CardModal = ({ card, onClose, onSave, areas }) => {
    const [text, setText] = useState(card.text);
    const [selectedArea, setSelectedArea] = useState(card.nomeArea);
    const [observations, setObservations] = useState(card.observations);

    const handleSave = () => {
        const areaObj = areas.find(a => a.nome === selectedArea);
        onSave({ ...card, text, areaId: areaObj.id, nomeArea: areaObj.nome, observations });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>X</button>
                <input 
                    type="text" 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                />
                <select 
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                >
                    {areas.map(area => (
                        <option key={area.id} value={area.nome}>
                            {area.nome}
                        </option>
                    ))}
                </select>
                <textarea 
                    value={observations}
                    onChange={(e) => setObservations(e.target.value)}
                />
                <button onClick={handleSave}>Salvar</button>
            </div>
        </div>
    );
};

export default CardModal