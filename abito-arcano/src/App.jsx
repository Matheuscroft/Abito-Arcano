import React, { useState } from 'react';
import ToDoList from './components/ToDoList';
import Areas from './components/Areas';
import './App.css';

function App() {
  const [componenteAtivo, setComponenteAtivo] = useState('tarefas');

  const renderizarComponente = () => {
    switch (componenteAtivo) {
      case 'tarefas':
        return <ToDoList />;
      case 'areas':
        return <Areas />;
      case 'projetos':
        return <div>Componentes de Projetos</div>;
      case 'missoes':
        return <div>Componentes de Missões</div>;
      case 'quests':
        return <div>Componentes de Quests</div>;
      default:
        return <ToDoList />;
    }
  };

  return (
    <div className="App">
      <div className="sidebar">
        <button onClick={() => setComponenteAtivo('areas')}>Áreas</button>
        <button onClick={() => setComponenteAtivo('projetos')}>Projetos</button>
        <button onClick={() => setComponenteAtivo('missoes')}>Missões</button>
        <button onClick={() => setComponenteAtivo('quests')}>Quests</button>
        <button onClick={() => setComponenteAtivo('tarefas')}>Tarefas</button>
      </div>
      <div className="main-content">
        {renderizarComponente()}
      </div>
    </div>
  );
}

export default App;
