import React, { useState, useEffect } from 'react';

function calcularBrilho(corHex) {
  const r = parseInt(corHex.substring(1, 3), 16);
  const g = parseInt(corHex.substring(3, 5), 16);
  const b = parseInt(corHex.substring(5, 7), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114);
}

function Tarefa({ tarefa, onEdit, onDelete, onToggle, areas }) {
  const [corArea, setCorArea] = useState('#000');
  const [corTexto, setCorTexto] = useState('#fff');

  useEffect(() => {
    if (Array.isArray(areas) && tarefa.areaId) {
      console.log("areas é um array", areas);

      console.log("tarefa");
      console.log(tarefa);
      console.log("tarefa.areaId");
      console.log(tarefa.areaId);

      const areaEncontrada = areas.find(a => a.id === tarefa.areaId);
      console.log("areaEncontrada", areaEncontrada);

      if (areaEncontrada) {
        console.log("Área encontrada");

        setCorArea(areaEncontrada.cor);
        console.log("Cor da área:", areaEncontrada.cor);

        const brilho = calcularBrilho(areaEncontrada.cor);
        console.log("Brilho", brilho);

        setCorTexto(brilho > 186 || areaEncontrada.nome === 'SEM CATEGORIA' ? '#000' : '#fff');
      } else {
        console.log("Área não encontrada, aplicando cores padrão");
        setCorArea('#000');
        setCorTexto('#fff');
      }
    } else {
      console.log("areas não é um array ou tarefa não possui areaId");
    }
  }, [tarefa.areaId, areas]);

  return (
    <div>
      <input
        type="checkbox"
        checked={tarefa.finalizada}
        onChange={onToggle}
      />
      {tarefa.nome} - 
      <span style={{ backgroundColor: corArea, color: corTexto, padding: '0 5px', borderRadius: '5px' }}>
        {"+"+ tarefa.numero + " " + tarefa.area}
      </span> - 
      {tarefa.subarea}
      <button onClick={onEdit}>Editar</button>
      <button onClick={onDelete}>Excluir</button>
    </div>
  );
}

export default Tarefa;
