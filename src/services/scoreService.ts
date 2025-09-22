import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/score`;

export const getPontuacoes = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("[getPontuacoes] Erro ao buscar pontuações:", error);
    throw error;
  }
};
