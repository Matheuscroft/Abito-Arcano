const Card = ({ card, onDoubleClick, areas }) => {
    const areaObj = areas.find(a => a.id === card.areaId) || { cor: '#ccc' };

    return (
        <div 
            className="card" 
            onDoubleClick={() => onDoubleClick(card)} 
            style={{
                backgroundColor: areaObj.nome === "SEM CATEGORIA" ? '#ccc' : areaObj.cor,
                maxWidth: '150px',
                wordWrap: 'break-word',
                padding: '10px',
                borderRadius: '8px',
                margin: '10px'
            }}
        >
            <h5>{card.text}</h5>
           
        </div>
    );
};



export default Card
