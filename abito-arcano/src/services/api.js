export const getUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:3001/usuarios');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
  };
   