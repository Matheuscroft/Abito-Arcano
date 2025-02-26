import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPontuacoes } from "../auth/firebasePontuacoes.js";
import {
  getListaAtividades,
  updatePontuacao,
} from "../auth/firebaseAtividades.js";
import { getAreas } from "../auth/firebaseAreaSubarea";
import { getHoraTrocaFirebase } from "../auth/firebaseDiasHoras.js";
import { getListaTarefas } from "../auth/firebaseTarefas.js";
import { getDias } from "../auth/firebaseDiasHoras.js";
import { getBrainstormList } from "../auth/firebaseBrainstorm.mjs";
import { getListas } from "../auth/firebaseListas.mjs";
import { Box, Button, ButtonGroup, Heading } from "@chakra-ui/react";

function Oficina({ user }) {
  const navigate = useNavigate();
  const [tarefas, setTarefas] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [pontuacoes, setPontuacoes] = useState({});
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [projetos, setProjetos] = useState([]);
  const [horaTroca, setHoraTroca] = useState([]);
  const [brainstorm, setBrainstorm] = useState([]);
  const [dias, setDias] = useState([]);
  const [listas, setListas] = useState([]);
  const [view, setView] = useState("areas");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      const tarefas = await getListaTarefas(user.uid);
      const atividades = await getListaAtividades(user.uid);
      const pontuacoes = await getPontuacoes(user.uid);
      const areas = await getAreas(user.uid);
      //const horaTroca = await getHoraTrocaFirebase();
      const horaTroca = await getHoraTrocaFirebase(user.uid);
      const dias = await getDias(user.uid);
      const brainstorm = await getBrainstormList(user.uid);
      const listas = await getListas(user.uid);

      console.log("pontuacoes");
      console.log(pontuacoes);

      const subareas = areas.areas.flatMap((area) => area.subareas || []);
      //const projetos = areas.flatMap(area => area.projetos || []);

      setTarefas(tarefas);
      setAtividades(atividades);
      setPontuacoes(pontuacoes);
      setAreas(areas);
      setSubareas(subareas);
      //setProjetos(projetos);
      setHoraTroca(horaTroca);
      setDias(dias);
      setBrainstorm(brainstorm);
      setListas(listas);
    };
    fetchData();
  }, [user, navigate]);

  const formatItem = (item, type) => {
    if (typeof item !== "object" || item === null) {
      return item;
    }

    const orderedItem = {};

    if (type === "pontuacao") {
      // Ordena 'data' primeiro
      if (item.data) {
        orderedItem.data = item.data;
      }

      // Em seguida, ordena 'areas'
      if (item.areas) {
        orderedItem.areas = item.areas.map((area) => {
          const orderedArea = {
            areaId: area.areaId,
            pontos: area.pontos,
            subareas: area.subareas.map((subarea) => ({
              subareaId: subarea.subareaId,
              pontos: subarea.pontos,
            })),
          };
          return orderedArea;
        });
      }

      // Finalmente, adiciona outras propriedades, exceto 'data' e 'areas'
      Object.keys(item)
        .filter((key) => key !== "data" && key !== "areas")
        .sort()
        .forEach((key) => {
          if (Array.isArray(item[key])) {
            orderedItem[key] = item[key]
              .map((subItem) => formatItem(subItem, type))
              .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
          } else {
            orderedItem[key] = item[key];
          }
        });
    } else {
      // Ordenação padrão para outros itens
      if (item.id) {
        orderedItem.id = item.id;
      }

      Object.keys(item)
        .filter((key) => key !== "id")
        .sort()
        .forEach((key) => {
          if (Array.isArray(item[key])) {
            orderedItem[key] = item[key]
              .map((subItem) => formatItem(subItem, type))
              .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
          } else {
            orderedItem[key] = item[key];
          }
        });
    }

    return orderedItem;
  };

  const formatData = (data, type) => {
    if (Array.isArray(data)) {
      return (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <pre>{JSON.stringify(formatItem(item, type), null, 2)}</pre>
            </li>
          ))}
        </ul>
      );
    }
    return <pre>{JSON.stringify(formatItem(data, type), null, 2)}</pre>;
  };

  const renderView = () => {
    switch (view) {
      case "areas":
        return formatData(areas, "area");
      case "subareas":
        return formatData(subareas, "subarea");
      case "projetos":
        return formatData(projetos, "projeto");
      case "pontuacoes":
        return formatData(pontuacoes, "pontuacao");
      case "tarefas":
        return formatData(tarefas, "tarefa");
      case "atividades":
        return formatData(atividades, "atividade");
      case "dias":
        return formatData(dias, "dia");
      case "horaTroca":
        return formatData(horaTroca, "horaTroca");
      case "brainstorm":
        return formatData(brainstorm, "brainstorm");
      case "listas":
        return formatData(listas, "listas");
      default:
        return <div>Selecione uma visualização</div>;
    }
  };

  return (
    <Box mt={4}>
      <Heading>Oficina</Heading>
      <ButtonGroup size="sm" spacing={4} my={4}>
        <Button variant="subtle" onClick={() => setView("areas")}>Áreas</Button>
        <Button variant="subtle" onClick={() => setView("subareas")}>Subáreas</Button>
        <Button variant="subtle" onClick={() => setView("projetos")}>Projetos</Button>
        <Button variant="subtle" onClick={() => setView("pontuacoes")}>Pontuações</Button>
        <Button variant="subtle" onClick={() => setView("tarefas")}>Tarefas</Button>
        <Button variant="subtle" onClick={() => setView("atividades")}>Atividades</Button>
        <Button variant="subtle" onClick={() => setView("dias")}>Dias</Button>
        <Button variant="subtle" onClick={() => setView("horaTroca")}>Hora de Troca</Button>
        <Button variant="subtle" onClick={() => setView("brainstorm")}>Brainstorm</Button>
        <Button variant="subtle" onClick={() => setView("listas")}>Listas</Button>
      </ButtonGroup>
      
      {renderView()}
    </Box>
  );
}

export default Oficina;
