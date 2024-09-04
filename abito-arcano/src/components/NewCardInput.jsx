import React, { useEffect, useState } from 'react';

const NewCardInput = ({ areas = [], onAddCard }) => {
    const [newCardText, setNewCardText] = useState('');
    const [selectedArea, setSelectedArea] = useState('');


    useEffect(() => {
        console.log("Estado atual - areas:", areas);
      }, [areas]);

    const handleAddCard = () => {
        if (newCardText.trim()) {
            onAddCard(newCardText, selectedArea);
            setNewCardText('');
            setSelectedArea('');
        }
    };

    

    return (
        <div>
            <input
                type="text"
                value={newCardText}
                onChange={(e) => setNewCardText(e.target.value)}
                placeholder="Digite o texto do card"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCard()}
            />
            <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
            >
                <option value="">Escolha a área</option>
                {areas.map(area => (
                    <option key={area.nome} value={area.nome}>
                        {area.nome}
                    </option>
                ))}
            </select>
            <button onClick={handleAddCard}>Adicionar Card</button>
        </div>
    );
};

export default NewCardInput;
