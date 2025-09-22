import React, { useEffect } from 'react';
import { updateListas } from './listaUtils';
import CorDaArea from './CorDaArea';
import FormSetasOrdenar from '../componentes/forms/FormSetasOrdenar/FormSetasOrdenar';
import InputCheckboxLista from './InputCheckboxLista';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import FormBotoesExcluir from '../componentes/forms/FormBotoesExcluir/FormBotoesExcluir';
import FormBotoesEditarEDelete from '../componentes/forms/FormBotoesEditarEDelete/FormBotoesEditarEDelete';

const Lista = ({ user, listas, setListasLocal, lista, onDelete, handleToggleItem, onClick, areas, onMove, handleResetar }) => {

    /* useEffect(() => {
         console.log("Estado atualizadOOOOOO - novas lista do lista:");
         console.log(lista)
       }, [lista]);*/

    return (
        <Box border="1px solid #ccc" width="300px" position="relative" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} mb={4} maxHeight="800px">
            <FormBotoesExcluir item={lista} onDelete={onDelete} />
            <Heading mt={7} onClick={() => onClick(lista)} size="xl">{lista.nome} ({lista.tipo})</Heading>
            <Flex mt={5} mb={5} alignItems="center" justify="space-between">
                <Flex alignItems="center" gap={2}>
                    <CorDaArea areaId={lista.areaId} areas={areas} className="cor-da-area" />
                    <Text textStyle="lg">{areas.find(area => area.id === lista.areaId)?.nome || "SEM CATEGORIA"}</Text>
                </Flex>
                <Box>
                    <FormSetasOrdenar
                        onMove={(itemId, direction) => onMove(itemId, direction)}
                        item={lista}
                        lista={listas}
                    />
                </Box>
            </Flex>
            <Button mb={5} variant="surface" onClick={() => handleResetar(lista)}>Resetar checklists</Button>
            <Box overflowY="auto" maxHeight="600px">
            <ul>
                    {(Array.isArray(lista.itens) ? lista.itens : []).map(item => (
                        <InputCheckboxLista
                            key={item.id}
                            item={item}
                            onToggle={() => handleToggleItem(lista, item.id)}
                        />
                    ))}
                </ul>
                </Box>
        </Box >
    );
};

export default Lista;
