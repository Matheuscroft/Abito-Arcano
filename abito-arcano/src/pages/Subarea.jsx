import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { getSubareaById } from "../services/subareasService.ts";

const Subarea = () => {
  const { id } = useParams();
  const [subarea, setSubarea] = useState(null);
  const navigate = useNavigate();

  const voltar = () => {
    if (subarea?.areaId) {
      navigate(`/areas/${subarea.areaId}`);
    } else {
      navigate("/areas");
    }
  };

  useEffect(() => {
    const carregarSubarea = async () => {
      const token = localStorage.getItem("token");
      try {
        const dados = await getSubareaById(token, id);
        setSubarea(dados);
      } catch (err) {
        console.error("Erro ao carregar subárea:", err);
      }
    };

    carregarSubarea();
  }, [id]);

  if (!subarea) return <p>Carregando subárea...</p>;

  return (
    <Box p={4}>
      <Flex justify="flex-start" mb={2}>
        <Button size="xs" onClick={voltar} colorScheme="blue">
          Voltar
        </Button>
      </Flex>
      <Heading size="lg">Subárea: {subarea.name}</Heading>
    </Box>
  );
};

export default Subarea;
