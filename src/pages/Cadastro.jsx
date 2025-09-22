import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService.ts";
import {
  Fieldset,
  Field,
  Input,
  Button,
  Stack,
  Text,
} from "@chakra-ui/react";

const Cadastro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await register(name, email, password);
      console.log("Usuário cadastrado com sucesso:", data);
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || "Erro ao cadastrar");
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <form onSubmit={handleCadastro}>
      <Fieldset.Root size="lg" maxW="md" mx="auto" mt={10} spacing={4}>
        <Stack spacing={4}>
          <Fieldset.Legend fontSize="2xl" fontWeight="bold">
            Cadastro
          </Fieldset.Legend>
          <Fieldset.HelperText>
            Preencha os campos para criar sua conta
          </Fieldset.HelperText>

          <Field.Root>
            <Field.Label>Nome</Field.Label>
            <Input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field.Root>

          <Field.Root>
            <Field.Label>Senha</Field.Label>
            <Input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field.Root>

          {error && <Text color="red.500">{error}</Text>}

          <Button type="submit" colorScheme="teal" mt={4}>
            Cadastre-se
          </Button>
          <Button variant="link" onClick={() => navigate("/login")}>
            Voltar ao Login
          </Button>
        </Stack>
      </Fieldset.Root>
    </form>
  );
};

export default Cadastro;
