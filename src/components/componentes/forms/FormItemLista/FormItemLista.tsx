import React from "react";
import FormSetasOrdenar from "../FormSetasOrdenar/FormSetasOrdenar";
import FormBotoesEditarEDelete from "../FormBotoesEditarEDelete/FormBotoesEditarEDelete";
import { Flex } from "@chakra-ui/react";
import type { ItemResponse } from "@/types/item";
import type { CompletedTaskResponseDTO } from "@/types/task";

interface FormItemListaProps {
  item: ItemResponse | CompletedTaskResponseDTO;
  lista: (ItemResponse | CompletedTaskResponseDTO)[] | { itens?: (ItemResponse | CompletedTaskResponseDTO)[] };
  index?: number;
  path?: (number | string)[];
  onEdit: (path?: (number | string)[]) => void;
  onDelete: () => void;
  onMove: (item: ItemResponse | CompletedTaskResponseDTO, direction: number) => void;
}

const FormItemLista: React.FC<FormItemListaProps> = ({
  item,
  onEdit,
  lista,
  onDelete,
  onMove,
  index,
  path,
}) => {
  return (
    <Flex as="span" display="inline-flex" alignItems="center">
      {item && index !== undefined && (
        <>
          <FormBotoesEditarEDelete
            item={item}
            onEdit={() => onEdit(path)}
            onDelete={onDelete}
            index={index}
          />
          {/* <FormSetasOrdenar onMove={onMove} item={item} lista={lista} /> */}
        </>
      )}
    </Flex>
  );
};

export default FormItemLista;
