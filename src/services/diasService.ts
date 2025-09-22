import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/days`;

export const getDias = async (token) => {
  console.log("[API] Buscando dias com API_URL:", API_URL);
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dias:", error);
    return [];
  }
};

export const getDiaById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("[API] Sucesso:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dia por ID:", error);
    return null;
  }
};
