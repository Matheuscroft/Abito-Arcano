import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Fieldset,
  Field,
  Input,
  Stack,
  Button,
  Text,
} from '@chakra-ui/react';
import { login } from '../services/authService.ts';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const data = await login(email, password);
      console.log('Login realizado com sucesso:', data);

      localStorage.setItem('token', data);
      setAuth(true);
      navigate('/tarefas');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao fazer login');
      console.error('Erro no login:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <Fieldset.Root size="lg" maxW="md" mx="auto" mt={10} spacing={4}>
        <Stack spacing={4}>
          <Fieldset.Legend fontSize="2xl" fontWeight="bold">
            Login
          </Fieldset.Legend>
          <Fieldset.HelperText>
            Acesse sua conta com e-mail e senha
          </Fieldset.HelperText>

          <Field.Root>
            <Field.Label>E-mail</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Senha</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field.Root>

          {error && <Text color="red.500">{error}</Text>}

          <Button type="submit" colorScheme="teal">
            Login
          </Button>
          <Button variant="link" onClick={() => navigate('/cadastro')}>
            Cadastre-se
          </Button>
        </Stack>
      </Fieldset.Root>
    </form>
  );
};

export default Login;
