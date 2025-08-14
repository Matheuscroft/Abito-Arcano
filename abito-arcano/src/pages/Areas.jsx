import React, { useState, useEffect } from "react";
import InputAdicionarNome from "../components/componentes/inputs/InputAdicionarNome/InputAdicionarNome";
import {
  getAreas,
  postArea,
  putArea,
  deleteArea,
} from "../services/areasService.ts";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import HexCard from "../components/cards/HexCard.jsx";
import ModalEdicaoArea from "../components/modals/ModalEdicaoArea.jsx";

function Areas({ user }) {
  const [areas, setAreas] = useState([]);
  const [nomeArea, setNomeArea] = useState("");
  const [corArea, setCorArea] = useState("#ffffff");
  const [areaSelecionada, setAreaSelecionada] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoNomeArea, setNovoNomeArea] = useState("");
  const [novaCorArea, setNovaCorArea] = useState("#ffffff");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      const token = localStorage.getItem("token");
      const fetchedAreas = await getAreas(token);
      console.log("fetchedAreas:", fetchedAreas);
      setAreas(fetchedAreas);

      /* if (user.uid) { 
                try {
                    const fetchedAreas = await getAreas(user.uid);  
                    console.log("fetchedAreas:", fetchedAreas);
                    setTodasAreas(fetchedAreas.areas);

                    const areasFiltradas = fetchedAreas.areas.filter(area => area.nome !== 'SEM CATEGORIA');
                    setAreas(areasFiltradas);

                    console.log("areasFiltradas:", areasFiltradas);

                } catch (error) {
                    console.error("Erro ao buscar áreas:", error);
                }
            }*/
    };
    fetchAreas();
  }, [user]);

  const adicionarArea = async () => {
    const token = localStorage.getItem("token");
    console.log("entrei adicionarArea");
    if (nomeArea.trim() === "") return;
    const novaAreaDTO = {
      name: nomeArea.toUpperCase(),
      color: corArea,
    };

    try {
      console.log("Enviando nova área:", novaAreaDTO);
      const areaCriada = await postArea(token, novaAreaDTO);

      console.log("Área criada no backend:", areaCriada);

      setAreas((prev) => [...prev, areaCriada]);


      setNomeArea("");
      setCorArea("#ffffff");
    } catch (error) {
      console.error("Erro ao adicionar área:", error);
    }
  };

  const abrirModalEdicao = (areaId) => {
    console.log("[abrirModalEdicao] areaId:", areaId);

    const area = areas.find((a) => a.id === areaId);
    if (!area) {
      console.error("Área não encontrada");
      return;
    }

    setAreaSelecionada(area);
    setNovoNomeArea(area.name);
    setNovaCorArea(area.color);
    setModalAberto(true);
  };

  const fecharModalEdicao = () => {
    setAreaSelecionada(null);
    setModalAberto(false);
  };

  const editarArea = async () => {
    const token = localStorage.getItem("token");
    if (!token || !areaSelecionada) return;

    const areaDTO = {
      name: novoNomeArea.toUpperCase(),
      color: novaCorArea,
    };

    const novasAreas = areas.map((area) =>
      area.id === areaSelecionada.id ? { ...area, ...areaDTO } : area
    );

    setAreas(novasAreas);
    fecharModalEdicao();

    try {
      console.log(
        "[editarArea] Enviando para backend:",
        areaSelecionada.id,
        areaDTO
      );

      await putArea(token, areaSelecionada.id, areaDTO);
    } catch (error) {
      console.error("Erro ao editar área:", error);
    }
  };

  const excluirArea = async (id) => {
    const token = localStorage.getItem("token");
    console.log(`[excluirArea] Tentando excluir área com ID: ${id}`);

    try {
      await deleteArea(token, id);
      console.log(`[excluirArea] Área ${id} excluída com sucesso no backend.`);

      const areasAtualizadas = areas.filter((area) => area.id !== id);
      setAreas(areasAtualizadas);

      console.log("[excluirArea] Estado local atualizado:", areasAtualizadas);
    } catch (error) {
      console.error(`[excluirArea] Erro ao excluir área ${id}:`, error);
    }
  };

  const abrirSubareas = (areaId, event) => {
    const elementClicked = event.target.tagName.toLowerCase();
    if (elementClicked === "button") return;
    navigate(`/areas/${areaId}`);
  };


  return (
    <Box p={4}>
      <Heading as="h1" size="lg" mb={4}>
        Áreas
      </Heading>
      <Flex gap={4} mb={6} align="center" wrap="wrap">
        <InputAdicionarNome
          placeholder="Digite o nome da área"
          nomeNovo={nomeArea.toUpperCase()}
          setNomeNovo={setNomeArea}
          handleAddItem={adicionarArea}
        />

        <Input
          type="color"
          value={corArea}
          onChange={(e) => setCorArea(e.target.value)}
          w="60px"
          h="40px"
          p={0}
          border="none"
          cursor="pointer"
          bg="transparent"
        />
        <Button size="xs" colorScheme="blue" onClick={adicionarArea}>
          Adicionar Área
        </Button>
      </Flex>

      <Flex wrap="wrap" gap="10px">
        {areas
    .filter((area) => area.name.toUpperCase() !== "SEM CATEGORIA")
    .map((area) => (
          <HexCard
            key={area.id}
            name={area.name}
            color={area.color}
            onClick={(e) => abrirSubareas(area.id, e)}
            onEdit={() => abrirModalEdicao(area.id)}
            onDelete={() => excluirArea(area.id)}
          />
        ))}
      </Flex>

      {modalAberto && (
        <ModalEdicaoArea
          titulo="Editar Área"
          nome={novoNomeArea}
          setNome={setNovoNomeArea}
          cor={novaCorArea}
          setCor={setNovaCorArea}
          exibirCor={true}
          onSalvar={editarArea}
          onCancelar={fecharModalEdicao}
        />
      )}
    </Box>
  );
}

export default Areas;
