import React, { useState, useEffect, useRef } from 'react';
import { inserirDias } from '../../../auth/firebaseDiasHoras.js';
import { atualizarDiasLocalmenteENoFirebase } from '../../todoUtils.js';
import BotaoDia from './BotaoDia.jsx';

const BarraDias = ({ user, dias, setDias, setDiaVisualizado, resetarListaDeDias, setDataAtual, tarefasGerais, setTarefasPorDia, diaVisualizado, dataAtual }) => {
    const containerRef = useRef(null);


    const resetarTarefasFuturas = async () => {
        try {
            const tarefasGeraisLimpa = tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }));
    
            console.log("tarefasGeraisLimpa");
            console.log(tarefasGeraisLimpa);
            console.log("dias");
            console.log(dias);
    
            const diasAtualizados = dias.map(dia => {
                const data = new Date(dia.data.split('/').reverse().join('-') + 'T00:00:00').toLocaleDateString('pt-BR');
                if (data > dataAtual) {
                    return { ...dia, tarefas: tarefasGeraisLimpa };
                }
                return dia;
            });
    
            console.log("diasAtualizados");
            console.log(diasAtualizados);

            atualizarDiasLocalmenteENoFirebase(user.uid, diasAtualizados, setDias);
    
            diasAtualizados.forEach(dia => {
                setTarefasPorDia(prev => ({ ...prev, [dia.data]: dia.tarefas }));
            });
    
        } catch (error) {
            console.error("Erro ao resetar tarefas futuras:", error);
        }
    };

    const resetarDiaAtual = async () => {
        try {
            const hoje = new Date().toLocaleDateString('pt-BR');
            const diasSalvos = dias.map(dia => (dia.data === hoje ? { ...dia, dataAtual: true } : { ...dia, dataAtual: false }));
            
            await inserirDias(user.uid, diasSalvos);
            setDataAtual(hoje);
            setDiaVisualizado(hoje);
        } catch (error) {
            console.error('Erro ao resetar o dia atual:', error);
        }
    };


    useEffect(() => {
        setDias(dias);
        console.log("dias do barra dias");
        console.log(dias);
    }, [dias]);

    return (
        <div>
            <h2>Dias</h2>
            <button onClick={resetarListaDeDias}>Resetar Lista de Dias</button>
            <button onClick={resetarTarefasFuturas}>Resetar Tarefas Futuras</button>
            <button onClick={resetarDiaAtual}>Resetar Dia Atual</button>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '10px' }}>
                <div
                    ref={containerRef}
                    style={{
                        display: 'flex',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        scrollBehavior: 'smooth',
                        border: "solid",
                        flexWrap: "wrap"
                    }}
                >
                    {dias.map((dia) => (
                        <BotaoDia
                        key={dia.data}
                        data={dia.data}
                        diaSemana={dia.diaSemana}
                        isSelecionado={diaVisualizado === dia.data}
                        onClick={() => setDiaVisualizado(dia.data)}
                      />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BarraDias;
