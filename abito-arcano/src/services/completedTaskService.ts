import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/completed`;

export const checkTarefa = async (dto, token) => {
  try {
    const response = await axios.post(`${API_URL}/check`, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`[checkTarefa] Erro ao concluir tarefa:`, error);
    throw error;
  }
};

export const uncheckTarefa = async (dto, token) => {
  try {
    const response = await axios.post(`${API_URL}/uncheck`, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`[uncheckTarefa] Erro ao desfazer conclusão da tarefa:`, error);
    throw error;
  }
};
