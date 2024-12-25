import React from 'react';

const BotaoDia = ({ data, diaSemana, isSelecionado, onClick }) => {
  // Formatar o nome do dia da semana para a versão abreviada
  const formatarDiaSemana = (diaSemana) => {
    const abreviacoes = {
      'segunda-feira': 'SEG',
      'terça-feira': 'TER',
      'quarta-feira': 'QUA',
      'quinta-feira': 'QUI',
      'sexta-feira': 'SEX',
      'sábado': 'SAB',
      'domingo': 'DOM',
    };
    return abreviacoes[diaSemana.toLowerCase()] || diaSemana;
  };

  return (
    <button
      onClick={onClick}
      style={{
        margin: '0 5px',
        padding: '8px',
        backgroundColor: isSelecionado ? '#ddd' : '#fff',
        border: isSelecionado ? '2px solid #000' : '1px solid #ccc',
        borderRadius: '5px',
        textAlign: 'center',
      }}
    >
      <div>{data}</div>
      <div style={{fontSize: '9px'}}>{formatarDiaSemana(diaSemana)}</div>
    </button>
  );
};

export default BotaoDia;
