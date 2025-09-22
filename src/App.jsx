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
import { Button, ButtonGroup, Container } from "@chakra-ui/react";
import Subareas from "./pages/Subareas";
import { validarToken } from './services/authService.ts';
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
      <Container maxW="container.xl" py={4}>
        <div className="App">
          {!isAuthenticated ? (
            <Routes>
              <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          ) : (
            <div>
              <div className="sidebar">
              <ButtonGroup size="sm" spacing={4}>
                  <Link to="/areas">
                    <Button variant="outline">Áreas</Button>
                  </Link>
                  <Link to="/projetos">
                    <Button variant="outline">Projetos</Button>
                  </Link>
                  <Link to="/missoes">
                    <Button variant="outline">Missões</Button>
                  </Link>
                  <Link to="/quests">
                    <Button variant="outline">Quests</Button>
                  </Link>
                  <Link to="/tarefas">
                    <Button variant="outline">Tarefas</Button>
                  </Link>
                  <Link to="/oficina">
                    <Button variant="outline">Oficina</Button>
                  </Link>
                  <Link to="/brainstorm">
                    <Button variant="outline">Brainstorm</Button>
                  </Link>
                  <Link to="/listas">
                    <Button variant="outline">Listas</Button>
                  </Link>
                  <Link to="/mes">
                    <Button variant="outline">Mês</Button>
                  </Link>
                  <Button colorPalette="red" variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </ButtonGroup>
              </div>
              <div className="main-content">
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
              </div>
            </div>
          )}
        </div>
      </Container>
    </Router>
  );
}

export default App;
