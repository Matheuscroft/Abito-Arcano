import axios from "axios";
const API_URL = `${process.env.REACT_APP_API_URL}/tarefas`;

export const addTarefa = async (tarefaDTO, dayId, token) => {
  try {
    const response = await axios.post(`${API_URL}?dayId=${dayId}`, tarefaDTO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    throw error;
  }
};

export const updateTarefa = async (tarefaId, tarefaDTO, dayId, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/${tarefaId}?dayId=${dayId}`,
      tarefaDTO,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`[updateTarefa] Erro ao atualizar tarefa ${tarefaId}:`, error);
    throw error;
  }
};


export const deleteTarefa = async (tarefaId, dayId, token) => {
  console.log(`[deleteTarefa] Deletando tarefa ${tarefaId} do dia ${dayId}`);
  try {
    console.log(`[deleteTarefa] Enviando requisição DELETE para ${API_URL}/${tarefaId}?dayId=${dayId}`);
    console.log(`[deleteTarefa] Token: ${token}`);
    await axios.delete(`${API_URL}/${tarefaId}?dayId=${dayId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`[deleteTarefa] Tarefa ${tarefaId} deletada com sucesso`);
  } catch (error) {
    console.error(`[deleteTarefa] Erro ao deletar tarefa ${tarefaId}:`, error);
    throw error;
  }
};

