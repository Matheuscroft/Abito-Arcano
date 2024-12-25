import React, { useState, useEffect } from 'react';
import { setarCorAreaETexto } from '../../utils';
import FormBotoesEditarEDelete from '../../componentes/forms/FormBotoesEditarEDelete/FormBotoesEditarEDelete'
import FormSetasOrdenar from '../../componentes/forms/FormSetasOrdenar/FormSetasOrdenar';

function Tarefa({ tarefa, onEdit, onDelete, onToggle, areas, index, lista, onMove }) {
  const [corArea, setCorArea] = useState('#000');
  const [corTexto, setCorTexto] = useState('#fff');

  useEffect(() => {

    if (Array.isArray(areas) && tarefa.areaId) {


      setarCorAreaETexto(tarefa, areas, setCorArea, setCorTexto)

    } else {
      console.log("areas não é um array ou tarefa não possui areaId");
    }
  }, [tarefa.areaId, areas]);

  return (
    <div className="parent-div">
      <div className="left-content">
        <input
          type="checkbox"
          checked={tarefa.finalizada}
          onChange={onToggle}
        />
        {tarefa.nome} -
        <span style={{ backgroundColor: corArea, color: corTexto, padding: '0 5px', borderRadius: '5px' }}>
          {"+" + tarefa.numero + " " + tarefa.area}
        </span>
        {tarefa.subarea ? ` - ${tarefa.subarea}` : ""}
      </div>
      <div className="right-content">
        <FormBotoesEditarEDelete item={tarefa} onEdit={onEdit} onDelete={onDelete} index={areas} />
        <FormSetasOrdenar onMove={onMove} item={tarefa} lista={lista}/>
      </div>
    </div>
  );
}

export default Tarefa;
