const calcularBrilho = (corHex) => {
    const r = parseInt(corHex.substring(1, 3), 16);
    const g = parseInt(corHex.substring(3, 5), 16);
    const b = parseInt(corHex.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114);
  }

  export const setarCorAreaETexto = (item, areas, setCorArea, setCorTexto) => {

    const areaEncontrada = areas.find(a => a.id === item.areaId);

      if (areaEncontrada) {

        setCorArea(areaEncontrada.cor);

        const brilho = calcularBrilho(areaEncontrada.cor);

        setCorTexto(brilho < 186 || areaEncontrada.nome === 'SEM CATEGORIA' ? '#fff' : '#000');
      } else {
        setCorArea('#000');
        setCorTexto('#fff');
      }
  }