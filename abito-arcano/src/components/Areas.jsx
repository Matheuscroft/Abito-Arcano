import React, { useState, useEffect } from 'react';
import Subareas from './Subareas';
import {
    getAreas,
    addArea,
    updateArea,
    deleteArea
} from '../auth/firebaseAreaSubarea';

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
        const fetchAreas = async () => {
            const fetchedAreas = await getAreas();
            setAreas(fetchedAreas);
            console.log("fetchedAreas:")
            console.log(fetchedAreas)
        };
        fetchAreas();



        console.log("areas:")
        console.log(areas)

    }, []);

    const adicionarArea = async () => {
        if (nomeArea.trim() === '') return;
        const novaArea = { nome: nomeArea.toUpperCase(), cor: corArea, subareas: [] };
        const areaAdicionada = await addArea(novaArea);
        setAreas([...areas, areaAdicionada]);
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

    const editarArea = async () => {
        const areaAtualizada = { ...areas[areaSelecionada], nome: novoNomeArea.toUpperCase(), cor: novaCorArea };
        await updateArea(areaAtualizada.id, areaAtualizada);
        const areasAtualizadas = areas.map((area, index) =>
            index === areaSelecionada ? areaAtualizada : area
        );
        setAreas(areasAtualizadas);
        fecharModalEdicao();
    };

    const excluirArea = async (index) => {
        await deleteArea(areas[index].id);
        const areasAtualizadas = areas.filter((_, i) => i !== index);
        setAreas(areasAtualizadas);
    };

    const abrirSubareas = (index) => {
        const elementClicked = document.activeElement.tagName.toLowerCase();
        if (elementClicked === "button") {
            return;
        }
        setAreaSelecionada(index);
        setEntrarSubArea(true);
    };

    if (entrarSubArea !== false) {
        return <Subareas
            area={areas[areaSelecionada]}
            voltar={() => setEntrarSubArea(false)}
            atualizarArea={(areaAtualizada) => {
                const novasAreas = areas.map(a => a.id === areaAtualizada.id ? areaAtualizada : a);
                setAreas(novasAreas);
            }}
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
                    <div className="cartao-area-principal" key={index}>
                        <div
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
