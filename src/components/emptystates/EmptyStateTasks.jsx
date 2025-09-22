import React from "react";
import { EmptyState, VStack } from "@chakra-ui/react";
import { LuClipboardList } from "react-icons/lu";

const EmptyStateTasks = ({ tipo }) => {
  let titulo = "";
  let descricao = "";
  let icone = <LuClipboardList size={36} />;

  switch (tipo) {
    case "nenhumaCriada":
      titulo = "Nenhuma tarefa criada";
      descricao = "Adicione uma tarefa para começar.";
      break;
    case "todasConcluidas":
      titulo = "Todas as tarefas concluídas!";
      descricao = "Você completou tudo por hoje. Ótimo trabalho!";
      icone = <span role="img" aria-label="confete">🎉</span>;
      break;
    case "nenhumaFinalizada":
      titulo = "Você ainda não concluiu nenhuma tarefa";
      descricao = "";
      break;
    default:
      titulo = "Nada para mostrar";
      descricao = "";
  }

  return (
    <EmptyState.Root size="sm">
      <EmptyState.Content>
        <EmptyState.Indicator>{icone}</EmptyState.Indicator>
        <VStack textAlign="center">
          <EmptyState.Title>{titulo}</EmptyState.Title>
          {descricao && (
            <EmptyState.Description>{descricao}</EmptyState.Description>
          )}
        </VStack>
      </EmptyState.Content>
    </EmptyState.Root>
  );
};

export default EmptyStateTasks;
