import axios from "axios";
const API_URL = `${process.env.REACT_APP_API_URL}/areas`;


export const getAreas = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar áreas:", error);
    throw error;
  }
};

export const postArea = async (token, area) => {
  try {
    const response = await axios.post(API_URL, area, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar área:", error);
    throw error;
  }
};

export const getAreaById = async (token, id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar área por ID:", error);
    throw error;
  }
};

export const deleteArea = async (token, id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`[deleteArea] Sucesso ao deletar área ${id}`, response.status);
  } catch (error) {
    console.error("Erro ao deletar área:", error);
    throw error;
  }
};

export const putArea = async (token, id, areaDTO) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, areaDTO, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`[putArea] Sucesso ao atualizar área ${id}`, response.status);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar área:", error);
    throw error;
  }
};
