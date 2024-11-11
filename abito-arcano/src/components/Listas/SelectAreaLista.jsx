import React, { useEffect } from 'react';

const SelectAreaLista = ({ areaId, setAreaId, onSave, areas }) => {

  useEffect(() => {
    console.log("Estado atualizado - areaId:", areaId);
  }, [areaId]);

  const handleChange = (e) => {
    const novaAreaId = e.target.value;
    setAreaId(novaAreaId); // Atualiza apenas o ID da área
    if (onSave) {
      onSave(novaAreaId); // Salva apenas o ID, não o objeto completo
    }
  };

  return (
    <select value={areaId || ''} onChange={handleChange}>
      {areas && areas.length > 0 ? (
        areas.map((item) => (
          <option key={item.id} value={item.id}>
            {item.nome}
          </option>
        ))
      ) : (
        <option disabled>Não há áreas disponíveis</option>
      )}
    </select>
  );
};

export default SelectAreaLista;
