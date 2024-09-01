import React, { useState, useEffect } from 'react';
import { setHoraTrocaFirebase, getHoraTrocaFirebase } from '../auth/firebaseDiasHoras.js';

const RelogioCron = ({ user, trocarDia }) => {
    const [horaTroca, setHoraTroca] = useState('00:00:00');
    const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString());



    useEffect(() => {
        const fetchHoraTroca = async () => {
            const horaSalva = await getHoraTrocaFirebase(user.uid);
            if (horaSalva) {
                setHoraTroca(horaSalva);
            }
        };
        fetchHoraTroca();
    }, [user]);

    useEffect(() => {
        /*console.log("Estado atualizado - horaTroca:");
        console.log(horaTroca)*/
        console.log("user.uid")
        console.log(user.uid)
    }, [horaTroca]);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const [horas, minutos, segundos] = horaTroca ? horaTroca.split(':').map(Number) : [0, 0, 0];

            if (
                (now.getHours() === 0 && now.getMinutes() === 0 && now.getSeconds() === 0) ||
                (now.getHours() === horas && now.getMinutes() === minutos && now.getSeconds() === 0)
            ) {
                console.log("Hora de trocar o dia");
                trocarDia();
            }

        }, 1000);

        return () => clearInterval(timer);
    }, [horaTroca, trocarDia]);

    useEffect(() => {
        const interval = setInterval(() => {
            setHoraAtual(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleHoraTrocaChange = async (e) => {
        const novaHoraMinutos = e.target.value.slice(0, 5);
        const novaHoraTroca = `${novaHoraMinutos}:00`;
        setHoraTroca(novaHoraTroca);
        await setHoraTrocaFirebase(user.uid, novaHoraTroca);
    };

    const resetHoraTroca = async () => {
        const defaultHoraTroca = '00:00:00';
        setHoraTroca(defaultHoraTroca);
        await setHoraTrocaFirebase(user.uid, defaultHoraTroca);
    };

    return (
        <div>
            <span>Hora Atual: {horaAtual}</span>
            <input
                type="time"
                value={horaTroca.slice(0, 5)}
                onChange={handleHoraTrocaChange}
                step="60"
            />
            <button onClick={resetHoraTroca}>Resetar Hora de Troca</button>
            <button onClick={trocarDia}>Trocar Dia</button>
        </div>
    );
};

export default RelogioCron;
