import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAreaById } from "../services/areasService.ts";
import { Box, Button, Heading, Flex } from "@chakra-ui/react";
import InputAdicionarNome from "../components/componentes/inputs/InputAdicionarNome/InputAdicionarNome.tsx";
import {
  postSubarea,
  deleteSubarea,
  putSubarea,
} from "../services/subareasService.ts";
import HexCard from "../components/cards/HexCard.jsx";
import ModalEdicaoArea from "../components/modals/ModalEdicaoArea.jsx";

function Subareas() {
  const [subareas, setSubareas] = useState([]);
  const [subareaSelecionada, setSubareaSelecionada] = useState(null);
  const [nomeNovoSubarea, setNomeNovoSubarea] = useState("");
  const [nomeEditandoSubarea, setNomeEditandoSubarea] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [area, setArea] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const voltar = () => {
    navigate("/areas");
  };

  useEffect(() => {
    const carregarArea = async () => {
      const token = localStorage.getItem("token");
      try {
        const area = await getAreaById(token, id);
        console.log("area carregada");
        console.log(area);
        setArea(area);
        setSubareas(area.subareas || []);
      } catch (error) {
        console.error("Erro ao carregar área:", error);
      }
    };
    carregarArea();
  }, [id]);

  const adicionarSubarea = async () => {
    const token = localStorage.getItem("token");
    if (!token || !area || nomeNovoSubarea.trim() === "") return;

    const novaSubareaDTO = {
      name: nomeNovoSubarea.trim(),
      areaId: area.id,
    };

    try {
      console.log("[adicionarSubarea] Enviando para backend:", novaSubareaDTO);
      const subareaCriada = await postSubarea(token, novaSubareaDTO);
      console.log("[adicionarSubarea] Subárea criada:", subareaCriada);

      const novasSubareas = [...subareas, subareaCriada];
      setSubareas(novasSubareas);
      setNomeNovoSubarea("");
    } catch (error) {
      console.error("Erro ao criar subárea:", error);
    }
  };

  const abrirModalEdicao = (subarea) => {
    if (!subarea) return;
    setSubareaSelecionada(subarea);
    setNomeEditandoSubarea(subarea.name);
    setModalAberto(true);
  };

  const fecharModalEdicao = () => {
    setSubareaSelecionada(null);
    setModalAberto(false);
  };

  const editarSubarea = async () => {
    const token = localStorage.getItem("token");
    if (!token || subareaSelecionada === null) return;

    const subareaDTO = {
      name: nomeEditandoSubarea.trim(),
      areaId: area.id,
    };

    const novasSubareas = subareas.map((sub) =>
    sub.id === subareaSelecionada.id ? { ...sub, ...subareaDTO } : sub
  );

  setSubareas(novasSubareas);
  fecharModalEdicao();

    try {
      console.log(
        "[editarSubarea] Enviando para backend:",
        subareaDTO
      );
      await putSubarea(token, subareaSelecionada.id, subareaDTO);
      console.log("[editarSubarea] Atualizada com sucesso:");

    } catch (error) {
      console.error("Erro ao editar subárea:", error);
    }
  };

  const excluirSubarea = async (id) => {
    const token = localStorage.getItem("token");

    const subareasAtualizadas = subareas.filter((sub) => sub.id !== id);
    setSubareas(subareasAtualizadas);

    try {
      console.log("[excluirSubarea] ID a ser excluído:", id);
      await deleteSubarea(token, id);
      console.log("[excluirSubarea] Exclusão no backend concluída.");
    } catch (error) {
      console.error("Erro ao excluir subárea:", error);
    }
  };

  const abrirSubarea = (subareaId) => {
    navigate(`/subareas/${subareaId}`);
  };

  if (!area) {
    return <div>Carregando...</div>;
  }

  return (
    <Box p={4}>
      <Flex justify="flex-start" mb={2}>
        <Button size="xs" onClick={voltar} colorScheme="blue">
          Voltar
        </Button>
      </Flex>
      <Heading size="lg" mb={4}>
        Subáreas de {area.name}
      </Heading>
      <Flex gap={4} mb={6} align="center" wrap="wrap">
        <InputAdicionarNome
          placeholder="Digite o nome da subárea"
          nomeNovo={nomeNovoSubarea}
          setNomeNovo={setNomeNovoSubarea}
          handleAddItem={adicionarSubarea}
        />
        <Button size="xs" colorScheme="green" onClick={adicionarSubarea}>
          Adicionar Subárea
        </Button>
      </Flex>
      <Flex wrap="wrap" gap="10px">
        {subareas.map((subarea) => (
          <HexCard
            key={subarea.id}
            name={subarea.name}
            color={area.color}
            onClick={() => abrirSubarea(subarea.id)}
            onEdit={() => abrirModalEdicao(subarea)}
            onDelete={() => excluirSubarea(subarea.id)}
          />
        ))}
      </Flex>

      {modalAberto && (
        <ModalEdicaoArea
          titulo="Editar Subárea"
          nome={nomeEditandoSubarea}
          setNome={setNomeEditandoSubarea}
          exibirCor={false}
          onSalvar={editarSubarea}
          onCancelar={fecharModalEdicao}
        />
      )}
    </Box>
  );
}

export default Subareas;
