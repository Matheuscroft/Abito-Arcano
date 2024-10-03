import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ToDoList from './components/pages/ToDoList/ToDoList';
import Areas from './components/Areas';
import Projeto from './components/Projeto';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Oficina from './components/Oficina';
import Brainstorm from './components/Brainstorm';
import Listas from './components/Listas/Listas';
import Mes from './components/pages/mes/Mes'
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signOut } from './auth/firebase';

function App() {

  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Carregando...</div>;
  }

  function handleLogout() {
    signOut(auth)
      .then(() => {
        console.log('Usuário desconectado');
      })
      .catch((error) => {
        console.error('Erro ao desconectar: ', error);
      });
  }
  

  return (
    <Router>
      <div className="App">
        {!user ? (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        ) : (
          <div>
            <div className="sidebar">
              <Link to="/areas"><button>Áreas</button></Link>
              <Link to="/projetos"><button>Projetos</button></Link>
              <Link to="/missoes"><button>Missões</button></Link>
              <Link to="/quests"><button>Quests</button></Link>
              <Link to="/tarefas"><button>Tarefas</button></Link>
              <Link to="/oficina"><button>Oficina</button></Link>
              <Link to="/brainstorm"><button>Brainstorm</button></Link>
              <Link to="/listas"><button>Listas</button></Link>
              <Link to="/mes"><button>Mês</button></Link>
              <button onClick={handleLogout}>Logout</button>
            </div>
            <div className="main-content">
              <Routes>
                <Route path="/tarefas" element={<ToDoList user={user}/>} />
                <Route path="/areas" element={<Areas user={user}/>} />
                <Route path="/projetos" element={<div>Componentes de Projetos</div>} />
                <Route path="/missoes" element={<div>Componentes de Missões</div>} />
                <Route path="/quests" element={<div>Componentes de Quests</div>} />
                <Route path="/projeto/:nomeProjeto" element={<Projeto />} />
                <Route path="/oficina" element={<Oficina user={user}/>} />
                <Route path="/brainstorm" element={<Brainstorm user={user}/>} />
                <Route path="/listas" element={<Listas user={user}/>} />
                <Route path="/mes" element={<Mes user={user}/>} />
                <Route path="/" element={<ToDoList />} />
                <Route path="*" element={<Navigate to="/tarefas" />} />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
