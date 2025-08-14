import React, { useState, useEffect } from "react";
import { updatePontuacoes } from "../auth/firebasePontuacoes.js";
import {
  getListaAtividades,
  setListaAtividades,
} from "../auth/firebaseAtividades.js";
import BarraPontuacoes from "../components/BarraPontuacoes.jsx";
import ListaAtividades from "../components/ListaAtividades.jsx";
import Diarias from "../components/pages/ToDoList/Diarias.jsx";
import { useNavigate } from "react-router-dom";
import { updateAreas } from "../auth/firebaseAreaSubarea.js";
import { v4 as uuidv4 } from "uuid";

import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import { getDias } from "../services/diasService.ts";
import { getAreas } from "../services/areasService.ts";
import { getPontuacoes } from "../services/scoreService.ts";

function ToDoList({ user }) {
  const [atividades, setAtividades] = useState([]);
  const [pontuacoes, setPontuacoes] = useState({});
  const [dias, setDias] = useState([]);
  const [areas, setAreas] = useState({});
  const [diaVisualizado, setDiaVisualizado] = useState(null);
  const navigate = useNavigate();

  /*useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      console.log("User ID:", user.uid);
    }
  }, [user, navigate]);*/

  /*useEffect(() => {
    console.log("Estado atualizadOOOOOO - atividades:");
    console.log(atividades)
  }, [atividades]);*/

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      console.log("token todolist");
      console.log(token);
      const dias = await getDias(token);

      console.log("dias todolist");
      console.log(dias);
      setDias(dias);

      if (dias.length > 0) {
        const diaAtual = dias.find((dia) => dia.current === true);
        if (diaAtual) {
          setDiaVisualizado(diaAtual);
        }
      }

      const areas = await getAreas(token);
      console.log("areas todolist");
      console.log(areas);
      setAreas(areas);

      const pontuacoes = await getPontuacoes(token);
      setPontuacoes(pontuacoes);

      if (user && user.uid) {
        let atividades = await getListaAtividades(user.uid);

        if (!atividades || atividades.atividades.length === 0) {
          console.log("if");
          atividades = await resetarListaAtividades();
        }

        let pontuacoes = await getPontuacoes(user.uid);

        setAtividades(atividades.atividades);
        setPontuacoes(pontuacoes);
      }
    };
    fetchData();
  }, []);

  const resetarListaAreas = async (userId) => {
    console.log("to no resetarListaAreas");

    const areass = [
      {
        id: uuidv4(),
        nome: "SEM CATEGORIA",
        cor: "#000000",
        subareas: [
          {
            id: uuidv4(),
            nome: "SEM CATEGORIA",
          },
        ],
      },
    ];

    await updateAreas(userId, areass);
    console.log("Estrutura de áreas resetada:", areass);
  };

  const resetarListaAtividades = async () => {
    console.log("entrei no resetar lista atv");
    const atividadesObjeto = { userId: user.uid, atividades: [] };

    console.log("atividadesObjeto");
    console.log(atividadesObjeto);

    await setListaAtividades(user.uid, atividadesObjeto.atividades);
    setAtividades(atividadesObjeto.atividades);

    return atividadesObjeto;
  };

  const resetarListaPontuacoes = async (user, areas, dias) => {
    let pontuacoes = [];

    //console.log("Iniciando resetarListaPontuacoes");

    dias.forEach((dia) => {
      const diaData = {
        data: dia.data,
        areas: [],
      };

      areas.forEach((area) => {
        const areaData = {
          areaId: area.id,
          pontos: 0,
          subareas: [],
        };

        area.subareas.forEach((subarea) => {
          areaData.subareas.push({
            subareaId: subarea.id,
            pontos: 0,
          });
        });

        diaData.areas.push(areaData);
      });

      pontuacoes.push(diaData);
    });

    await updatePontuacoes(user.uid, pontuacoes);

    /*console.log("pontuacoes do final do reset");
    console.log(pontuacoes);*/

    return pontuacoes;
  };

  return (
    <div>
      <Heading mt={4}>To-Do List</Heading>

      <BarraPontuacoes
        pontuacoes={pontuacoes}
        setPontuacoes={setPontuacoes}
        areas={areas}
        setAreas={setAreas}
        resetarListaPontuacoes={() => resetarListaPontuacoes(user, areas, dias)}
        user={user}
        resetarListaAreas={() => resetarListaAreas(user.uid)}
      />

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={60} mt={4}>
        <Box>
          <Diarias
            user={user}
            pontuacoes={pontuacoes}
            setPontuacoes={setPontuacoes}
            areas={areas}
            setAreas={setAreas}
            diaVisualizado={diaVisualizado}
            setDiaVisualizado={setDiaVisualizado}
            dias={dias}
            setDias={setDias}
          />
        </Box>

        <Box position="relative" ml="10">
          <Box
            position="absolute"
            left="-5"
            top="0"
            bottom="0"
            width="2px"
            bg="gray.300"
            display={{ base: "none", md: "block" }}
          />
          <ListaAtividades
            user={user}
            atividades={atividades}
            setAtividades={setAtividades}
            pontuacoes={pontuacoes}
            setPontuacoes={setPontuacoes}
            areas={areas}
            setAreas={setAreas}
            dias={dias}
            setDias={setDias}
            resetarListaAtividades={resetarListaAtividades}
            dataAtual={true}
          />
        </Box>
      </SimpleGrid>
    </div>
  );
}

export default ToDoList;
