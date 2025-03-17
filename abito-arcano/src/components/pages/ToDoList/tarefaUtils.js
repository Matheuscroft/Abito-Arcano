// 🔍 Função para buscar uma tarefa pelo ID, percorrendo listas aninhadas recursivamente
export const buscarTarefaRecursivamente = (id, lista) => {
    for (const tarefa of lista) {
      if (tarefa.id === id) return tarefa; 
      if (tarefa.tipo === "lista" && Array.isArray(tarefa.itens)) {
        const encontrada = buscarTarefaRecursivamente(id, tarefa.itens);
        if (encontrada) return encontrada; 
      }
    }
    return null;
  };
  
  // 📌 Expande uma tarefa do dia, preservando o status de finalização e expandindo listas aninhadas
  export const expandirTarefa = (tarefaDia, tarefasGerais) => {
    const tarefaDetalhada = buscarTarefaRecursivamente(tarefaDia.id, tarefasGerais);
  
    console.log("tarefaDetalhada");
    console.log(tarefaDetalhada);

    if (tarefaDetalhada !== null && tarefaDetalhada.tipo === "lista") {
      return {
        ...tarefaDetalhada,
        finalizada: tarefaDia.finalizada, 
        itens: (tarefaDia.itens || []).map((item) => expandirTarefa(item, tarefasGerais)).filter(Boolean),
      };
    }
  
    return {
      ...tarefaDetalhada,
      finalizada: tarefaDia.finalizada,
    };
  };
  
  // 🔄 Expande as tarefas de todos os dias
  export const expandirTarefasDosDias = (diasSalvos, tarefasGerais) => {
    return diasSalvos.map((dia) => ({
      ...dia,
      tarefas: dia.tarefas.map((tarefa) => expandirTarefa(tarefa, tarefasGerais)).filter(Boolean),
    }));
  };
  