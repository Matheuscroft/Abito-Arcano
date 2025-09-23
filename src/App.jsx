import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import ToDoList from "./pages/ToDoList";
import Areas from "./pages/Areas";
import Projeto from "./components/Projeto";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Oficina from "./components/Oficina";
import Brainstorm from "./components/Brainstorm";
import Listas from "./components/Listas/Listas";
import Mes from "./components/pages/mes/Mes";
import "./App.css";
import { Box, Button, ButtonGroup, Container, Wrap, WrapItem } from "@chakra-ui/react";
import Subareas from "./pages/Subareas";
import { validarToken } from './services/authService';
import Subarea from "./pages/Subarea";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [verificandoToken, setVerificandoToken] = useState(true);

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const valido = await validarToken(token);
        setIsAuthenticated(valido);
      } else {
        setIsAuthenticated(false);
      }
      setVerificandoToken(false);
    };

    verificarToken();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  }

  if (verificandoToken) return <p>Verificando autenticação...</p>;

  return (
    <Router>
      <Box w="100vw" maxW="100%" overflowX="hidden" minH="100vh">
        <Container 
          maxW={{ base: "100%", md: "container.xl" }} 
          px={{ base: 3, md: 4 }}
          py={{ base: 2, md: 4 }}
        >
          <div className="App">
            {!isAuthenticated ? (
              <Routes>
                <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            ) : (
              <Box>
                <Box 
                  className="sidebar" 
                  mb={{ base: 4, md: 6 }}
                  w="100%"
                  overflowX="hidden"
                >
                  <Wrap 
                    spacing={{ base: 2, md: 4 }} 
                    justify={{ base: "center", md: "flex-start" }}
                  >
                    <WrapItem>
                      <Link to="/areas">
                        <Button 
                          variant="outline" 
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Áreas
                        </Button>
                      </Link>
                    </WrapItem>
                    <WrapItem>
                      <Link to="/projetos">
                        <Button 
                          variant="outline" 
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Projetos
                        </Button>
                      </Link>
                    </WrapItem>
                    <WrapItem>
                      <Link to="/missoes">
                        <Button 
                          variant="outline" 
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Missões
                        </Button>
                      </Link>
                    </WrapItem>
                    <WrapItem>
                      <Link to="/quests">
                        <Button 
                          variant="outline" 
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Quests
                        </Button>
                      </Link>
                    </WrapItem>
                    <WrapItem>
                      <Link to="/tarefas">
                        <Button 
                          variant="outline" 
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Tarefas
                        </Button>
                      </Link>
                    </WrapItem>
                    <WrapItem>
                      <Link to="/oficina">
                        <Button 
                          variant="outline" 
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Oficina
                        </Button>
                      </Link>
                    </WrapItem>
                    <WrapItem>
                      <Link to="/brainstorm">
                        <Button 
                          variant="outline" 
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Brainstorm
                        </Button>
                      </Link>
                    </WrapItem>
                    <WrapItem>
                      <Link to="/listas">
                        <Button 
                          variant="outline" 
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Listas
                        </Button>
                      </Link>
                    </WrapItem>
                    <WrapItem>
                      <Link to="/mes">
                        <Button 
                          variant="outline" 
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Mês
                        </Button>
                      </Link>
                    </WrapItem>
                    <WrapItem>
                      <Button 
                        colorPalette="red" 
                        variant="outline" 
                        onClick={handleLogout}
                        size={{ base: "sm", md: "md" }}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        Logout
                      </Button>
                    </WrapItem>
                  </Wrap>
                </Box>

                <Box 
                  className="main-content"
                  w="100%"
                  overflowX="hidden"
                >
                  <Routes>
                    <Route path="/tarefas" element={<ToDoList />} />
                    <Route path="/areas" element={<Areas />} />
                    <Route path="/areas/:id" element={<Subareas />} />
                    <Route path="/subareas/:id" element={<Subarea />} />
                    <Route
                      path="/projetos"
                      element={<div>Componentes de Projetos</div>}
                    />
                    <Route
                      path="/missoes"
                      element={<div>Componentes de Missões</div>}
                    />
                    <Route
                      path="/quests"
                      element={<div>Componentes de Quests</div>}
                    />
                    <Route path="/projeto/:nomeProjeto" element={<Projeto />} />
                    <Route path="/oficina" element={<Oficina />} />
                    <Route
                      path="/brainstorm"
                      element={<Brainstorm />}
                    />
                    <Route path="/listas" element={<Listas />} />
                    <Route path="/mes" element={<Mes />} />
                    <Route path="/" element={<ToDoList />} />
                    <Route path="*" element={<Navigate to="/tarefas" />} />
                  </Routes>
                </Box>
              </Box>
            )}
          </div>
        </Container>
      </Box>
    </Router>
  );
}

export default App;
