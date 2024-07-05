import React, { useState, useEffect } from 'react';
import Subareas from './Subareas';

function Areas() {
    const [areas, setAreas] = useState([]);
    const [nomeArea, setNomeArea] = useState('');
    const [corArea, setCorArea] = useState('#ffffff');
    const [entrarSubArea, setEntrarSubArea] = useState(false);
    const [areaSelecionada, setAreaSelecionada] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);
    const [novoNomeArea, setNovoNomeArea] = useState('');
    const [novaCorArea, setNovaCorArea] = useState('#ffffff');

    useEffect(() => {
        const storedAreas = JSON.parse(localStorage.getItem('areas')) || [];
        setAreas(storedAreas);
    }, []);

    const salvarAreas = (novasAreas) => {
        localStorage.setItem('areas', JSON.stringify(novasAreas));
        setAreas(novasAreas);
    };

    const adicionarArea = () => {
        if (nomeArea.trim() === '') return;
        const novasAreas = [...areas, { nome: nomeArea.toUpperCase(), cor: corArea, subareas: [] }];
        salvarAreas(novasAreas);
        setNomeArea('');
        setCorArea('#ffffff');
    };

    const abrirModalEdicao = (index) => {
        setAreaSelecionada(index);
        setNovoNomeArea(areas[index].nome);
        setNovaCorArea(areas[index].cor);
        setModalAberto(true);
    };

    const fecharModalEdicao = () => {
        setAreaSelecionada(null);
        setModalAberto(false);
    };

    const editarArea = () => {
        const areasAtualizadas = areas.map((area, index) =>
            index === areaSelecionada ? { ...area, nome: novoNomeArea.toUpperCase(), cor: novaCorArea } : area
        );
        salvarAreas(areasAtualizadas);
        fecharModalEdicao();
    };

    const excluirArea = (index) => {
        const areasAtualizadas = areas.filter((_, i) => i !== index);
        salvarAreas(areasAtualizadas);
    };

    const abrirSubareas = (index) => {
        const elementClicked = document.activeElement.tagName.toLowerCase();
        if (elementClicked === "button") {

            return;
        }
        setAreaSelecionada(index);
        setEntrarSubArea(true)
    };

    if (entrarSubArea !== false) {
        return <Subareas
            area={areas[areaSelecionada]}
            voltar={() => setEntrarSubArea(false)}
            salvarAreas={salvarAreas}
        />;
    }

    return (
        <div>
            <h1>Áreas</h1>
            <input
                type="text"
                value={nomeArea}
                onChange={(e) => setNomeArea(e.target.value.toUpperCase())}
                placeholder="Digite o nome da área"
            />
            <input
                type="color"
                value={corArea}
                onChange={(e) => setCorArea(e.target.value)}
            />
            <button onClick={adicionarArea}>Adicionar Área</button>
            <div className="lista-areas">
                {areas.map((area, index) => (
                    <div className="cartao-area-principal">
                        <div
                            key={index}
                            className="cartao-area"
                            style={{ backgroundColor: area.cor }}
                            onClick={() => abrirSubareas(index)}
                        >
                            <div className="nome-area">{area.nome}</div>

                        </div>
                        <div>
                            <button onClick={() => excluirArea(index)}>Excluir</button>
                            <button onClick={() => abrirModalEdicao(index)}>Editar</button>
                        </div>
                    </div>
                ))}
            </div>
            {modalAberto && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Editar Área</h2>
                        <input
                            type="text"
                            value={novoNomeArea}
                            onChange={(e) => setNovoNomeArea(e.target.value.toUpperCase())}
                            placeholder="Digite o novo nome da área"
                        />
                        <input
                            type="color"
                            value={novaCorArea}
                            onChange={(e) => setNovaCorArea(e.target.value)}
                        />
                        <button onClick={editarArea}>Salvar</button>
                        <button onClick={fecharModalEdicao}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Areas;
