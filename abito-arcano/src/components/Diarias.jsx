import React, { useState, useEffect, useRef } from 'react';
import ListaTarefas from './ListaTarefas';
import Fila from './Fila';

import { getListaTarefas, getTarefasPorDia, addOrUpdateTarefasPorDia, addDia, getDias, setHoraTrocaFirebase, getHoraTrocaFirebase, inserirDias, setarDataAtualParaDia } from '../auth/firebaseService';

const Diarias = ({ tarefas, setPontuacoes }) => {
    const [tarefasPorDia, setTarefasPorDia] = useState({});
    const [dataAtual, setDataAtual] = useState('');
    //const [horaTroca, setHoraTroca] = useState('');
    const [horaTroca, setHoraTroca] = useState('00:00:00');
    const [tarefasGerais, setTarefasGerais] = useState([]);
    const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString());
    const [dias, setDias] = useState([]);
    const [diaVisualizado, setDiaVisualizado] = useState('');
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchHoraTroca = async () => {
            const horaSalva = await getHoraTrocaFirebase();
            if (horaSalva) {
                setHoraTroca(horaSalva);
            }
        };
        fetchHoraTroca();
    }, []);

    const handleHoraTrocaChange = async (e) => {
        const novaHoraMinutos = e.target.value.slice(0, 5);
        const novaHoraTroca = `${novaHoraMinutos}:00`;
        setHoraTroca(novaHoraTroca);
        await setHoraTrocaFirebase(novaHoraTroca);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const [horas, minutos, segundos] = horaTroca ? horaTroca.split(':').map(Number) : [0, 0, 0];

            if (
                (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) ||
                (now.getHours() === horas && now.getMinutes() === minutos && now.getSeconds() === segundos)
            ) {
                console.log("Hora de trocar o dia");
                trocarDia();
            }

        }, 1000);

        return () => clearInterval(timer);
    }, [horaTroca, dataAtual]);


    useEffect(() => {
        const fetchData = async () => {
            
            const tarefasGerais = await getListaTarefas();
            setTarefasGerais(tarefasGerais);

            let diasSalvos = await getDias();
            const tarefasPorDiaTemp = {};

            console.log("diasSalvos")
            console.log(diasSalvos)

            const hoje = new Date().toLocaleDateString('pt-BR');
            const diaAtual = diasSalvos.find(dia => dia.dataAtual).data || { data: hoje };

            console.log("hoje")
            console.log(hoje)
            console.log("diaAtual")
            console.log(diaAtual)

            if (diasSalvos.length === 0) {

                resetarListaDeDias(tarefasPorDiaTemp)
                
            } else {

                for (const dia of diasSalvos) {
                    tarefasPorDiaTemp[dia.data] = dia.tarefas.length === 0
                        ? tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
                        : dia.tarefas;

                        console.log("dia")
                        console.log(dia)
                        console.log("tarefasPorDiaTemp")
                        console.log(tarefasPorDiaTemp)
                }

                setDias(diasSalvos.map(d => d.data));
                setDataAtual(diaAtual);
            }

            setTarefasPorDia(tarefasPorDiaTemp);
            setDiaVisualizado(diaAtual);
        };

        fetchData();
    }, []);

    const resetarListaDeDias = async (tarefasPorDiaTemp) => {
        try {
            const novosDias = [];
                for (let i = 0; i <= 6; i++) {
                    const data = new Date();
                    data.setDate(data.getDate() + i);
                    const dataStr = data.toLocaleDateString('pt-BR');
                    const dia = {
                        data: dataStr,
                        dataAtual: i === 0,
                        tarefas: tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
                    };
                    novosDias.push(dia);
                    tarefasPorDiaTemp[dataStr] = dia.tarefas;

                }

                await inserirDias(novosDias);
                
                setDias(novosDias.map(d => d.data));
                setDataAtual(novosDias[0].data);

        } catch (error) {
            console.error("Erro ao resetar a lista de dias:", error);
        }
    };


    const converterParaDate = (dataStr) => {
        const [dia, mes, ano] = dataStr.split('/').map(Number);
        return new Date(ano, mes - 1, dia);
    };


    const trocarDia = async () => {
        try {
            console.log("Trocar dia");
    
            const dataAtualDate = converterParaDate(dataAtual);
            dataAtualDate.setDate(dataAtualDate.getDate() + 1);
            const novaDataStr = dataAtualDate.toLocaleDateString('pt-BR');
    
            let diasSalvos = await getDias();
            console.log("diasSalvos após troca", diasSalvos);
    
            diasSalvos = diasSalvos.map(dia => {
                if (dia.data === dataAtual) {
                    return { ...dia, dataAtual: false };
                } else if (dia.data === novaDataStr) {
                    return { ...dia, dataAtual: true };
                }
                return dia;
            });
    
            const ultimoDia = diasSalvos[diasSalvos.length - 1];
            const ultimoDiaDate = converterParaDate(ultimoDia.data);
            ultimoDiaDate.setDate(ultimoDiaDate.getDate() + 1);
            const novoDiaStr = ultimoDiaDate.toLocaleDateString('pt-BR');
    
            const novoDia = {
                data: novoDiaStr,
                dataAtual: false,
                tarefas: tarefasGerais.map(tarefa => ({ ...tarefa, finalizada: false }))
            };
    
            diasSalvos.push(novoDia);
    
            await inserirDias(diasSalvos);
    
            setDataAtual(novaDataStr);
            setDiaVisualizado(novaDataStr);
    
            console.log("Dia trocado com sucesso");
        } catch (error) {
            console.error("Erro ao trocar dia:", error);
        }
    };
    





    useEffect(() => {
        const interval = setInterval(() => {
            setHoraAtual(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const resetarTarefasFuturas = async () => {
        try {
            const tarefasGeraisAtualizadas = await getListaTarefas();
    
            const tarefasGeraisLimpa = tarefasGeraisAtualizadas.map(tarefa => ({
                ...tarefa,
                finalizada: false
            }));
    
            const hoje = new Date().toLocaleDateString('pt-BR');
            const diasSalvos = await getDias();
    
            const diasAtualizados = diasSalvos.map(dia => {
                const data = new Date(dia.data + 'T00:00:00').toLocaleDateString('pt-BR');
                if (data > hoje) {
                    return {
                        ...dia,
                        tarefas: tarefasGeraisLimpa
                    };
                }
                return dia;
            });

            console.log("diasAtualizados")
            console.log(diasAtualizados)
    
            await inserirDias(diasAtualizados);
            setDias(diasAtualizados.map(d => d.data)); 
        } catch (error) {
            console.error("Erro ao resetar tarefas futuras:", error);
        }
    };
    

    const resetarDiaAtual = async () => {
        try {
            const hoje = new Date().toLocaleDateString('pt-BR');
            console.log("Hoje do resetarDiaAtual:", hoje);
    
            let diasSalvos = await getDias();
            console.log("diasSalvos antes de resetar dia atual:", diasSalvos);
    
            diasSalvos = diasSalvos.map(dia => {
                if (dia.data === hoje) {
                    return { ...dia, dataAtual: true };
                } else {
                    return { ...dia, dataAtual: false };
                }
            });
    
            await inserirDias(diasSalvos);
    
            setDataAtual(hoje);
            setDiaVisualizado(hoje);
    
            console.log("Dia atual resetado para"+ hoje +"com sucesso");
        } catch (error) {
            console.error('Erro ao resetar o dia atual:', error);
        }
    };
    

    useEffect(() => {
        console.log("Estado atualizado - dataAtual:");
        console.log(dataAtual)
    }, [dataAtual]);

    useEffect(() => {
        console.log("Estado atualizado - diaVisualizado:");
        console.log(diaVisualizado)
    }, [diaVisualizado]);

    useEffect(() => {
        console.log("Estado atualizado - dias:");
        console.log(dias)
    }, [dias]);

    


    return (
        <div>
            <h1>Diárias</h1>
            <div>
                <div>
                    <span>Hora Atual: {horaAtual}</span>
                    <input
                        type="time"
                        value={horaTroca.slice(0, 5)}
                        onChange={handleHoraTrocaChange}
                        step="60"
                    />
                </div>
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
                            {dias.map((dia, index) => (
                                <button
                                    key={dia}
                                    onClick={() => setDiaVisualizado(dia)}
                                    style={{
                                        margin: '0 5px',
                                        padding: '10px',
                                        backgroundColor: diaVisualizado === dia ? '#ddd' : '#fff',
                                        border: diaVisualizado === dia ? '2px solid #000' : '1px solid #ccc',
                                        borderRadius: '5px',

                                    }}
                                >
                                    {dia}
                                </button>

                            ))}
                        </div>


                    </div>

                </div>
            </div>
            <ListaTarefas
                tarefas={tarefasPorDia[diaVisualizado] || []}
                setPontuacoes={setPontuacoes}
                setTarefas={(novasTarefas) => {
                    setTarefasPorDia(prev => ({ ...prev, [diaVisualizado]: novasTarefas }));
                    addOrUpdateTarefasPorDia(diaVisualizado, novasTarefas);
                }}
            />
        </div>
    );
};

export default Diarias;
