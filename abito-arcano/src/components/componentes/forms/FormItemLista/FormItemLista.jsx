import React, {  } from 'react';
import FormSetasOrdenar from '../FormSetasOrdenar/FormSetasOrdenar';
import './FormItemLista.css';
import FormBotoesEditarEDelete from '../FormBotoesEditarEDelete/FormBotoesEditarEDelete';
import { Flex } from '@chakra-ui/react';

const FormItemLista = ({ item, onEdit, lista, onDelete, onMove, index, path }) => {
 
    return (
        <Flex as="span" display="inline-flex" alignItems="center">
            {item && index !== undefined && (
                <>

                    <FormBotoesEditarEDelete item={item} onEdit={() => onEdit(path)} onDelete={onDelete} index={index}/>
                    
                    <FormSetasOrdenar onMove={onMove} item={item} lista={lista}/>
                </>
            )}
        </Flex>
    );
};

export default FormItemLista;
