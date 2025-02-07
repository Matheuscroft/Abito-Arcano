import React from 'react';
import FormItemLista from '../componentes/forms/FormItemLista/FormItemLista';
import './ItemLista.css'
import ListaAninhada from './ListaAninhada';
import ParagrafoItemLista from './ParagrafoItemLista';
import Tarefa from '../pages/ToDoList/Tarefa';

import { Checkbox } from '../ui/checkbox';
import { Box, Flex, Text } from '@chakra-ui/react';
import CheckboxItemLista from './CheckboxItemLista';

const ItemLista = ({ listas, user, item, onEdit, lista, onDelete, onToggle, onSave, onMove, index, setListasLocal, updateListas, path = [], areas, isTarefas = null, tarefa = null, setItems = null, dias = null, setDias = null, diaVisualizado = null, setPontuacoes, isAninhado = false }) => {

  const newPath = [...path, index];

  return (
    <Flex justify="space-between" align="center" width="100%" boxSizing="border-box">
      {item && index !== undefined && (
        <>
          <Flex flex="1" minWidth="50%">
            {item.tipo === 'checklist' && <CheckboxItemLista item={item} lista={lista} onToggle={onToggle}/>}
            {item.tipo === 'texto' && <ParagrafoItemLista item={item}/>}
            {item.tipo === 'lista' && <ListaAninhada listas={listas} user={user} index={index} item={item} lista={lista} onToggle={onToggle} setListasLocal={setListasLocal} updateListas={updateListas} onEdit={onEdit} onDelete={onDelete} onMove={onMove} path={newPath} onSave={onSave} areas={areas} isTarefas={isTarefas} tarefa={tarefa} setItems={setItems} dias={dias} setDias={setDias} diaVisualizado={diaVisualizado} setPontuacoes={setPontuacoes}/>}
            {item.tipo === 'tarefa' &&  <Tarefa
                  tarefa={item}
                  areas={areas}
                  index={index}
                  lista={lista}
                  onToggle={onToggle}
                  isAninhado={isAninhado}
                />}
          </Flex>

          <Box display="flex" justifyContent="flex-end">
            <FormItemLista item={item} onEdit={onEdit} lista={lista} onDelete={onDelete} onMove={onMove} index={index} path={newPath} />
          </Box>
        </>
      )}




    </Flex>
  );
};

export default ItemLista;
