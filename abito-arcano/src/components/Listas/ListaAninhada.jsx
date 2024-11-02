import React, { useEffect } from 'react';
import './ItemLista.css'

const ListaAninhada = ({ item, lista }) => {
    
     useEffect(() => {
         console.log("Estado atualizadOOOOOO - lista:");
         console.log(lista)
     }, [lista]);

    return (
        <div style={{display: 'inline-block'}}>
           <p>{lista.nome}</p>
           <ul>
        {lista.itens && lista.itens.map((item, index) => (
          <li key={item.id}>

            <p>{item.nome}</p>

          </li>
        ))}
      </ul>
        </div>
    );
};

export default ListaAninhada;
