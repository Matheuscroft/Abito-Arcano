import React, { useState, useEffect } from 'react';
import { setHoraTrocaFirebase, getHoraTrocaFirebase } from '../auth/firebaseService';

const RelogioCron = ({ trocarDia }) => {
    const [horaTroca, setHoraTroca] = useState('00:00:00');
    const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const fetchHoraTroca = async () => {
            const horaSalva = await getHoraTrocaFirebase();
            if (horaSalva) {
                setHoraTroca(horaSalva);
            }
        };
        fetchHoraTroca();
    }, []);

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
        await setHoraTrocaFirebase(novaHoraTroca);
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
        </div>
    );
};

export default RelogioCron;
