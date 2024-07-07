import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ToDoList from './components/ToDoList';
import Areas from './components/Areas';
import Projeto from './components/Projeto';
import './App.css';

function App() {
  const [componenteAtivo, setComponenteAtivo] = useState('tarefas');

  return (
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
  );
}

export default App;
