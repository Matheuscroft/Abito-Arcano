import React from 'react';

const InputCheckboxLista = ({ item, onToggle }) => {
  return (
    <li style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={onToggle}
      />
      {item.nome}
    </li>
  );
};

export default InputCheckboxLista;
