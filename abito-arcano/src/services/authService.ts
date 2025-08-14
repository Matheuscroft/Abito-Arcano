import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/auth`;

export const register = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/register`, {
    name: name,
    email: email,
    password: password,
    role: 'USER'
  });

  return response.data;
};

export const login = async (login, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    login,
    password,
  });

  return response.data;
};

export const validarToken = async (token) => {
  try {
    await axios.get(`${API_URL}/validate`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return true;
  } catch (error) {
    return false;
  }
};