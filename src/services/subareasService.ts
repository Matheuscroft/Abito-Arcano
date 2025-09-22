import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/subareas`;

export const postSubarea = async (token, subareaDTO) => {
  try {
    const response = await axios.post(API_URL, subareaDTO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar subárea:", error);
    throw error;
  }
};

export const deleteSubarea = async (token, id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Subárea deletada:", response.status);
  } catch (error) {
    console.error("Erro ao deletar subárea:", error);
    throw error;
  }
};

export const getSubareaById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar subárea:", error);
    throw error;
  }
};

export const putSubarea = async (token, id, subareaDTO) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, subareaDTO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar subárea:", error);
    throw error;
  }
};
