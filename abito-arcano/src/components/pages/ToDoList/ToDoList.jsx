import React, { useState, useEffect } from "react";
import {
  getPontuacoes,
  updatePontuacoes,
} from "../../../auth/firebasePontuacoes.js";
import {
  getListaAtividades,
  setListaAtividades,
} from "../../../auth/firebaseAtividades.js";
import BarraPontuacoes from "../../BarraPontuacoes";
import ListaAtividades from "../../ListaAtividades.jsx";
import Diarias from "./Diarias.jsx";
import { useNavigate } from "react-router-dom";
import { getAreas, updateAreas } from "../../../auth/firebaseAreaSubarea.js";
import { getDias } from "../../../auth/firebaseDiasHoras.js";
import { v4 as uuidv4 } from "uuid";

import { getUsuarios } from "../../../services/api.js";
import { Box, Heading, Separator, SimpleGrid } from "@chakra-ui/react";

function ToDoList({ user }) {
  const [atividades, setAtividades] = useState([]);
  const [pontuacoes, setPontuacoes] = useState({});
  const [dias, setDias] = useState({});
  const [areas, setAreas] = useState({});
  const [dataAtual, setDataAtual] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      console.log("User ID:", user.uid);
    }
  }, [user, navigate]);

  /*useEffect(() => {
    console.log("Estado atualizadOOOOOO - atividades:");
    console.log(atividades)
  }, [atividades]);*/

  useEffect(() => {
    const fetchData = async () => {
      //await resetarListaAreas(user.uid)
      if (user && user.uid) {
        const usuariosData = await getUsuarios(); // Chama o serviço para buscar os usuários
        console.log("usuariosData");
        console.log(usuariosData);

        let atividades = await getListaAtividades(user.uid);

        if (!atividades || atividades.atividades.length === 0) {
          console.log("if");
          atividades = await resetarListaAtividades();
        }

        const dataAtual = new Date().toLocaleDateString("pt-BR");
        let areasData = await getAreas(user.uid);
        let pontuacoes = await getPontuacoes(user.uid);
        const dias = await getDias(user.uid);

        console.log("dias todolist");
        console.log(dias);
        /*if (areas.length === 0) {
          console.log("to no areas 0")
          await resetarListaAreas(user.uid)
          areas = await getAreas(user.uid);
          
        }
  
        console.log("areas")
        console.log(areas)
  
        if (!Array.isArray(areas)) {
          console.log("Estrutura de áreas inválida, resetando...");
          await resetarListaAreas(user.uid);
          areas = await getAreas(user.uid); 
        }*/

        if (
          !areasData ||
          !Array.isArray(areasData.areas) ||
          areasData.areas.length === 0
        ) {
          console.log("Estrutura de áreas inválida ou vazia, resetando...");
          await resetarListaAreas(user.uid);
          areasData = await getAreas(user.uid);
        }

        console.log("Áreas:", areasData);
        /*console.log("pontuacoes do to do")
        console.log(pontuacoes)*/

        if (pontuacoes.length === 0) {
          resetarListaPontuacoes(user, areasData.areas, dias);
        }

        setAtividades(atividades.atividades);
        setPontuacoes(pontuacoes);
        setDias(dias);
        setAreas(areasData.areas);
        /*console.log("pontuacoes")
        console.log(pontuacoes)*/
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

  /*useEffect(() => {
    console.log("Estado to do list - dataAtual:");
    console.log(dataAtual)
  }, [dataAtual]);*/

  /*useEffect(() => {
    console.log("Estado atualizadOOOOOO - atividades:");
    console.log(atividades)
  }, [atividades]);

  useEffect(() => {
    console.log("Estado atualizadOOOOOO - pontuacoes:");
    console.log(pontuacoes)
  }, [pontuacoes]);*/

  /*  useEffect(() => {
      console.log("Estado atualizadOOOOOO - dias:");
      console.log(dias)
    }, [dias]);*/

  /*useEffect(() => {
    console.log("Estado atualizadOOOOOO - areas:");
    console.log(areas)
  }, [areas]);*/

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
            dataAtual={dataAtual}
            setDataAtual={setDataAtual}
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
            dataAtual={dataAtual}
          />
        </Box>
      </SimpleGrid>
    </div>
  );
}

export default ToDoList;
