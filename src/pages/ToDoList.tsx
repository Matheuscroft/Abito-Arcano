import React, { useState, useEffect } from "react";
import {
  getListaAtividades,
  setListaAtividades,
} from "../auth/firebaseAtividades.js";
import BarraPontuacoes from "../components/BarraPontuacoes";
import ListaAtividades from "../components/ListaAtividades";
import Diarias from "../components/pages/ToDoList/Diarias";

import { Box, Container, Heading, SegmentGroup, SimpleGrid } from "@chakra-ui/react";
import { getDias } from "../services/diasService";
import { getAreas } from "../services/areasService";
import { getPontuacoes } from "../services/scoreService";
import type { UserResponseDTO } from "@/types/user.ts";
import type { ActivityItem } from "@/types/item.ts";
import type { ScoreResponseDTO } from "@/types/score.ts";
import type { DayResponseDTO } from "@/types/day.ts";
import type { AreaResponseDTO } from "@/types/area.ts";

const simpleGridProps = {
  columns: { base: 1, md: 2 },
  spacingX: 60,
  spacingY: 4,
  mt: 4,
} as const;

interface ToDoListProps {
  user: UserResponseDTO;
}

function ToDoList({ user }: ToDoListProps) {
  const [atividades, setAtividades] = useState<ActivityItem[]>([]);
  const [pontuacoes, setPontuacoes] = useState<ScoreResponseDTO[]>([]);
  const [dias, setDias] = useState<DayResponseDTO[]>([]);
  const [areas, setAreas] = useState<AreaResponseDTO[]>([]);
  const [diaVisualizado, setDiaVisualizado] = useState<DayResponseDTO | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("diarias");
  //const navigate = useNavigate();

  /*useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      console.log("User ID:", user.id);
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

      if (user && user.id) {
        let atividades = await getListaAtividades(user.id);

        if (!atividades || atividades.atividades.length === 0) {
          console.log("if");
          atividades = await resetarListaAtividades();
        }

        let pontuacoes = await getPontuacoes(user.id);

        setAtividades(atividades.atividades);
        setPontuacoes(pontuacoes);
      }
    };
    fetchData();
  }, [user]);

  const resetarListaAtividades = async () => {
    console.log("entrei no resetar lista atv");
    const atividadesObjeto = { userId: user.id, atividades: [] };

    console.log("atividadesObjeto");
    console.log(atividadesObjeto);

    await setListaAtividades(user.id, atividadesObjeto.atividades);
    setAtividades(atividadesObjeto.atividades);

    return atividadesObjeto;
  };

  return (
    <Container 
      maxW={{ base: "100%", md: "container.xl" }} 
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6 }}
    >
      <Heading 
        size={{ base: "lg", md: "xl" }}
        mb={{ base: 4, md: 6 }}
        textAlign={{ base: "center", md: "left" }}
      >
        To-Do List
      </Heading>

      <BarraPontuacoes
        pontuacoes={pontuacoes}
        setPontuacoes={setPontuacoes}
        areas={areas}
        setAreas={setAreas}
        user={user}
      />

      <Box mt={{ base: 4, md: 6 }}>
        <SegmentGroup.Root
          value={activeTab}
          onValueChange={(e) => setActiveTab(e.value ?? "diarias")}
          size={{ base: "sm", md: "md" }}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Item value="diarias">
            <SegmentGroup.ItemText 
              fontSize={{ base: "sm", md: "md" }}
            >
              Atividades Diárias
            </SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
          <SegmentGroup.Item value="lista">
            <SegmentGroup.ItemText 
              fontSize={{ base: "sm", md: "md" }}
            >
              Lista de Atividades
            </SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        </SegmentGroup.Root>

        <Box 
          mt={{ base: 4, md: 6 }}
          px={{ base: 0, md: 2 }}
        >
          {activeTab === "diarias" && (
            <Diarias
              user={user}
              pontuacoes={pontuacoes}
              setPontuacoes={setPontuacoes}
              areas={areas}
              diaVisualizado={diaVisualizado}
              setDiaVisualizado={setDiaVisualizado}
              dias={dias}
              setDias={setDias}
            />
          )}

          {activeTab === "lista" && (
            <ListaAtividades
              user={user}
              atividades={atividades}
              setAtividades={setAtividades}
              setPontuacoes={setPontuacoes}
              areas={areas}
              dias={dias}
              setDias={setDias}
              resetarListaAtividades={resetarListaAtividades}
              dataAtual={""}
            />
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default ToDoList;
