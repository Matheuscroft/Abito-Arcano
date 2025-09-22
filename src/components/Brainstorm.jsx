import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Draggable from 'react-draggable';
import Card from './Card';
import CardModal from './CardModal';
import NewCardInput from './NewCardInput';
import { getBrainstormList, setBrainstormList } from '../auth/firebaseBrainstorm';
import { getAreas } from '../auth/firebaseAreaSubarea';

const Brainstorm = ({ user }) => {
    const [cards, setCards] = useState([]);
    const [areas, setAreas] = useState([]);
    const [editingCard, setEditingCard] = useState(null);


    const handleDragEnd = (e, data, cardId) => {

        const updatedCards = cards.map(card => {
            if (card.id === cardId) {
                return { ...card, position: { x: data.x, y: data.y } };
            }
            return card;
        });

        setCards(updatedCards);
        setBrainstormList(user.uid, updatedCards);

    };

    const handleCardClick = (card) => {

        setEditingCard(card);

    };




    useEffect(() => {
        const fetchData = async () => {
            const savedCards = await getBrainstormList(user.uid);
            const fetchedAreas = await getAreas(user.uid);
            console.log("fetchedAreas.areas do brainstorm")
            console.log(fetchedAreas.areas)
            setCards(savedCards || []);
            setAreas(fetchedAreas.areas || []);
        };

        if (user?.uid) {
            fetchData();
        }
    }, [user]);

   /* const handleAddCard = (newCardText, selectedArea) => {
        const defaultArea = areas.find(a => a.nome === 'SEM CATEGORIA');
        const areaObj = areas.find(a => a.nome === selectedArea) || defaultArea;

        const newCard = {
            id: uuidv4(),
            text: newCardText || 'Novo Card',
            areaId: areaObj.id,
            nomeArea: areaObj.nome,
            observations: '',
            checklist: [],
            position: { x: 10, y: 10 }
        };

        const updatedCards = [...cards, newCard];
        setCards(updatedCards);
        setBrainstormList(user.uid, updatedCards);
    };*/

    const handleAddCard = (newCardText, selectedArea) => {
        const defaultArea = areas.find(a => a.nome === 'SEM CATEGORIA');
        const areaObj = areas.find(a => a.nome === selectedArea) || defaultArea;
    
        let defaultPosition = { x: 10, y: 10 };
    
        let isPositionOccupied = cards.some(card => 
            card.position.x === defaultPosition.x && card.position.y === defaultPosition.y
        );
    
        if (isPositionOccupied) {
            const offset = 20;
            defaultPosition = { x: defaultPosition.x + offset, y: defaultPosition.y + offset };
        }
    
        const newCard = {
            id: uuidv4(),
            text: newCardText || 'Novo Card',
            areaId: areaObj.id,
            nomeArea: areaObj.nome,
            observations: '',
            checklist: [],
            position: defaultPosition
        };
    
        const updatedCards = [...cards, newCard];
        setCards(updatedCards);
        setBrainstormList(user.uid, updatedCards);
    };
    

    const handleSaveCard = (updatedCard) => {
        const updatedCards = cards.map(card =>
            card.id === updatedCard.id ? updatedCard : card
        );
        setCards(updatedCards);
        setBrainstormList(user.uid, updatedCards);
        setEditingCard(null);
    };

    const handleDeleteCard = (id) => {
        const updatedCards = cards.filter(card => card.id !== id);
        setCards(updatedCards);
        setBrainstormList(user.uid, updatedCards);
        setEditingCard(null);
    };

    return (
        <div>
            <NewCardInput areas={areas} onAddCard={handleAddCard} />
            {cards.map((card) => (
                <Draggable
                    key={card.id}
                    defaultPosition={card.position} 
                    position={card.position} 
                    onStop={(e, data) => handleDragEnd(e, data, card.id)}
                >
                   
                    <div style={{ width: 'fit-content', height: 'fit-content', position: card.position }}>
                        <Card
                            card={card}
                            onDoubleClick={() => handleCardClick(card)}
                            areas={areas}
                        />
                        <button onClick={() => handleDeleteCard(card.id)}>X</button>
                    </div>
                </Draggable>
            ))}




            {editingCard && (
                <CardModal
                    card={editingCard}
                    areas={areas}
                    onSave={handleSaveCard}
                    onDelete={handleDeleteCard}
                    onClose={() => setEditingCard(null)}
                />
            )}
        </div>
    );
};

export default Brainstorm;
