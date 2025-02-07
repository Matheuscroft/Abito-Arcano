import React, { useState, useEffect } from 'react';
import './listas.css';
import SelectTipoItem from './selects/select-tipo-item/SelectTipoItem';
import { Box, Button, Heading, HStack, Input } from '@chakra-ui/react';

function EditorItemLista({ item, onSave, setItemEditando }) {
    const [nome, setNome] = useState(item.nome);
    const [tipo, setTipo] = useState(item.tipo);


    const handleSave = () => {
        setItemEditando(false);
        onSave(nome, tipo);
    };

    useEffect(() => {
        console.log("Estado atualizadOOOOOO - item do editoritemlista:");
        console.log(item)
      }, [item]);


    return (
        <Box p="6">
            <Heading>Editar Item</Heading>
            <HStack>
            <Input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder={`Digite o nome da `}
                width="150px"
                size="xs"
            />

            <SelectTipoItem tipo={tipo} setTipo={setTipo}/>

            <Button size="xs" onClick={handleSave} >Salvar</Button>
            <Button size="xs" onClick={() => setItemEditando(false)} variant="outline" colorPalette="red">Cancelar</Button>
            </HStack>
        </Box>
    );
}

export default EditorItemLista;
