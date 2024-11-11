import React, { useState, useEffect } from 'react';
import InputAdicionarNome from '../componentes/inputs/InputAdicionarNome/InputAdicionarNome';
import SelectTipoLista from './SelectTipoLista';
import SelectAreaLista from './SelectAreaLista';

const ListaForm = ({ addLista, areas }) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('lista');
  const [areaId, setAreaId] = useState(null);

  useEffect(() => {
    // Inicializa o areaId com a área "SEM CATEGORIA" ou o primeiro item das áreas
    if (areas && areas.length > 0) {
      const areaSemCategoria = areas.find(area => area.nome === 'SEM CATEGORIA');
      setAreaId(areaSemCategoria ? areaSemCategoria.id : areas[0].id);
    }
  }, [areas]);

  const handleSubmit = () => {
    //e.preventDefault();
    if (nome.trim()) {
      addLista({ nome, tipo, areaId });
      setNome('');
      setTipo('lista')
      setAreaId(areas[0].id)
    }
  };

  return (
    <div>
      <InputAdicionarNome placeholder="Nome da lista" nomeNovo={nome} setNomeNovo={setNome} handleAddItem={handleSubmit}/>
      <SelectTipoLista tipo={tipo} setTipo={setTipo}/>
      <SelectAreaLista areaId={areaId} setAreaId={setAreaId} areas={areas}/>
      
      <button onClick={handleSubmit}>Criar Lista</button>
    </div>
  );
};

export default ListaForm;
