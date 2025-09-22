import React, { useState, useEffect } from 'react';
import SelectTipoLista from './SelectTipoLista';
import SelectAreaLista from './SelectAreaLista';
import CorDaArea from './CorDaArea';
import './listas.css'

const CabecalhoListaModal = ({ lista, onSave, areas }) => {
  const [nome, setNome] = useState(lista.nome);
  const [tipo, setTipo] = useState(lista.tipo);
  const [areaId, setAreaId] = useState(lista.areaId || (areas.length > 0 ? areas[0].id : ''));
  const [isEditingNome, setIsEditingNome] = useState(false);
  const [isEditingTipo, setIsEditingTipo] = useState(false);
  const [isEditingArea, setIsEditingArea] = useState(false);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO -cabecalholistamodal lista:");
    console.log(lista)
  }, [lista]);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO -cabecalholistamodal lista.area:");
    console.log(lista.areaId)
  }, [lista.areaId]);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO -cabecalholistamodal areas:");
    console.log(areas)
  }, [areas]);

  const handleNomeSave = () => {
    setIsEditingNome(false);
    onSave({ ...lista, nome });
  };

  const handleTipoSave = (novoTipo) => {
    setIsEditingTipo(false);
    onSave({ ...lista, tipo: novoTipo });
  };

  const handleAreaSave = (novaAreaId) => {
    setIsEditingArea(false);
    setAreaId(novaAreaId); 
    onSave({ ...lista, areaId: novaAreaId }); 
  };

  return (
    <div className="cabecalho-container">
      <h2>
        {isEditingNome ? (
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            onBlur={handleNomeSave}
            autoFocus
          />
        ) : (
          <span onClick={() => setIsEditingNome(true)}>{nome}</span>
        )}
      </h2>
  
      <div className="select-row">
        <p>
          Tipo:{" "}
          {isEditingTipo ? (
            <SelectTipoLista tipo={tipo} setTipo={setTipo} onSave={handleTipoSave} />
          ) : (
            <span onClick={() => setIsEditingTipo(true)}>{tipo}</span>
          )}
        </p>
  
        <p>
          Área:{" "}
          {isEditingArea ? (
            <SelectAreaLista areaId={areaId} setAreaId={setAreaId} onSave={handleAreaSave} areas={areas} />
          ) : (
            <span onClick={() => setIsEditingArea(true)}>
              {areas.find(area => area.id === areaId)?.nome || "Nenhuma área selecionada"}
            </span>
          )}
        </p>
  
        <CorDaArea areaId={areaId} areas={areas} className="cor-da-area" />
      </div>
    </div>
  );
  
};

export default CabecalhoListaModal;
