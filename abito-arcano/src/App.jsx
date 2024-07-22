import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import ToDoList from './components/ToDoList';
import Areas from './components/Areas';
import Projeto from './components/Projeto';
import Login from './components/Login';
import Cadastro from './components/Cadastro';
import Oficina from './components/Oficina';
import './App.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './auth/firebase';

function App() {

  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Carregando...</div>;
  }


  /*return (
    <Router>
      <div className="App">
        <div className="sidebar">
          <Link to="/areas"><button>Áreas</button></Link>
          <Link to="/projetos"><button>Projetos</button></Link>
          <Link to="/missoes"><button>Missões</button></Link>
          <Link to="/quests"><button>Quests</button></Link>
          <Link to="/tarefas"><button>Tarefas</button></Link>
        </div>
        <div className="main-content">
          <Routes>
            <Route path="/tarefas" element={<ToDoList />} />
            <Route path="/areas" element={<Areas />} />
            <Route path="/projetos" element={<div>Componentes de Projetos</div>} />
            <Route path="/missoes" element={<div>Componentes de Missões</div>} />
            <Route path="/quests" element={<div>Componentes de Quests</div>} />
            <Route path="/projeto/:nomeProjeto" element={<Projeto />} />
            <Route path="/" element={<ToDoList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );*/

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
            </div>
            <div className="main-content">
              <Routes>
                <Route path="/tarefas" element={<ToDoList user={user}/>} />
                <Route path="/areas" element={<Areas />} />
                <Route path="/projetos" element={<div>Componentes de Projetos</div>} />
                <Route path="/missoes" element={<div>Componentes de Missões</div>} />
                <Route path="/quests" element={<div>Componentes de Quests</div>} />
                <Route path="/projeto/:nomeProjeto" element={<Projeto />} />
                <Route path="/oficina" element={<Oficina user={user}/>} />
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
