import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Subareas({ area, voltar, salvarAreas }) {
  const [subareas, setSubareas] = useState([]);
  const [subareaSelecionada, setSubareaSelecionada] = useState(null);
  const [novoProjeto, setNovoProjeto] = useState('');

  useEffect(() => {
    setSubareas(area.subareas || []);
  }, [area]);

  const adicionarSubarea = (nomeSubarea) => {
    if (nomeSubarea.trim() === '') return;
    const novasSubareas = [...subareas, { nome: nomeSubarea }];
    atualizarSubareas(novasSubareas);
  };

  const atualizarSubareas = (novasSubareas) => {
    const novasAreas = JSON.parse(localStorage.getItem('areas')).map((a) =>
      a.nome === area.nome ? { ...a, subareas: novasSubareas } : a
    );
    salvarAreas(novasAreas);
    setSubareas(novasSubareas);
  };

  const editarSubarea = (index, novoNome) => {
    const subareasAtualizadas = subareas.map((subarea, i) =>
      i === index ? { ...subarea, nome: novoNome } : subarea
    );
    atualizarSubareas(subareasAtualizadas);
  };

  const excluirSubarea = (index) => {
    const subareasAtualizadas = subareas.filter((_, i) => i !== index);
    atualizarSubareas(subareasAtualizadas);
  };

  const abrirSubarea = (index) => {
    setSubareaSelecionada(index);
  };

  const fecharSubarea = () => {
    setSubareaSelecionada(null);
  };

  const adicionarProjeto = () => {
    if (novoProjeto.trim() === '') return;
    const subareasAtualizadas = subareas.map((subarea, index) =>
      index === subareaSelecionada ? { ...subarea, projetos: [...(subarea.projetos || []), { nome: novoProjeto }] } : subarea
    );
    atualizarSubareas(subareasAtualizadas);
    setNovoProjeto('');
  };

  const excluirProjeto = (subareaIndex, projetoIndex) => {
    const subareasAtualizadas = subareas.map((subarea, index) =>
      index === subareaIndex ? { ...subarea, projetos: subarea.projetos.filter((_, i) => i !== projetoIndex) } : subarea
    );
    atualizarSubareas(subareasAtualizadas);
  };

  const editarProjeto = (subareaIndex, projetoIndex, novoNome) => {
    const subareasAtualizadas = subareas.map((subarea, index) =>
      index === subareaIndex ? {
        ...subarea,
        projetos: subarea.projetos.map((projeto, idx) =>
          idx === projetoIndex ? { ...projeto, nome: novoNome } : projeto
        )
      } : subarea
    );
    atualizarSubareas(subareasAtualizadas);
  };

  return (
    <div>
      <h1>Subáreas de {area.nome}</h1>
      <input
        type="text"
        placeholder="Digite o nome da subárea"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            adicionarSubarea(e.target.value);
            e.target.value = '';
          }
        }}
      />
      <button onClick={voltar}>Voltar</button>
      <div className="lista-subareas">
        {subareas.map((subarea, index) => (
          <div key={index} className="cartao-subarea-principal">
            <div
              className="cartao-subarea"
              style={{ backgroundColor: area.cor }}
              onClick={() => abrirSubarea(index)}
            >
              <div className="nome-subarea">{subarea.nome}</div>
            </div>
            {subareaSelecionada === index && (
              <div>
                <div>
                  <input
                    type="text"
                    value={novoProjeto}
                    onChange={(e) => setNovoProjeto(e.target.value)}
                    placeholder="Novo projeto"
                  />
                  <button onClick={adicionarProjeto}>Adicionar Projeto</button>
                </div>
                {subarea.projetos && subarea.projetos.map((projeto, projIndex) => (
                  <div key={projIndex} className="projeto">
                    <Link to={`/projeto/${projeto.nome}`} className="link-projeto">
                      <div
                        className="pentagono"
                        style={{ backgroundColor: area.cor }}
                      />
                      <div className="nome-projeto">{projeto.nome}</div>
                    </Link>
                    <div>
                      <button onClick={() => editarProjeto(index, projIndex, prompt("Editar nome do projeto:", projeto.nome) || projeto.nome)}>Editar</button>
                      <button onClick={() => excluirProjeto(index, projIndex)}>Excluir</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subareas;
