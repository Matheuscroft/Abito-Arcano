import React, { useState, useEffect } from 'react';
import InputAdicionarNome from '../componentes/inputs/InputAdicionarNome/InputAdicionarNome';
import SelectTipoLista from './SelectTipoLista';
import SelectAreaLista from './SelectAreaLista';
import { Box, Button, Flex, Heading } from '@chakra-ui/react';

const ListaForm = ({ addLista, areas }) => {
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('lista');
  const [area, setArea] = useState(["SEM CATEGORIA"]);

  useEffect(() => {
    console.log("areassss do ")
      console.log(areas)
    if (areas && areas.length > 0) {
      const areaSemCategoria = areas.find(area => area.nome === 'SEM CATEGORIA');
      setArea([areaSemCategoria?.nome || areas[0].nome]);

      
      console.log("areaSemCategoria do usetg")
      console.log(areaSemCategoria)
      console.log("area do usetg")
      console.log(area)
    }
  }, [areas]);

  const handleSubmit = () => {
    if (nome.trim()) {
      console.log("area do submit")
      console.log(area)
      console.log("area[0][0]")
      console.log(area[0][0])
      addLista({ nome, tipo, area: area[0][0] });
      setNome('');
      setTipo('lista')
      setArea(areas[0])
    }
  };

  return (
    <Box mt={5}>
      <Heading>Adicionar nova lista</Heading>
    <Flex mt={5} gap={3}>
      <InputAdicionarNome placeholder="Nome da lista" nomeNovo={nome} setNomeNovo={setNome} handleAddItem={handleSubmit}/>
      <SelectTipoLista tipo={tipo} setTipo={setTipo}/>
      <SelectAreaLista area={area} setArea={setArea} areas={areas}/>
      
      <Button size="xs" variant="surface" onClick={handleSubmit}>Criar Lista</Button>
    </Flex>
    </Box>
  );
};

export default ListaForm;
