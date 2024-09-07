const calcularBrilho = (corHex) => {
    const r = parseInt(corHex.substring(1, 3), 16);
    const g = parseInt(corHex.substring(3, 5), 16);
    const b = parseInt(corHex.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114);
  }

  export const setarCorAreaETexto = (item, areas, setCorArea, setCorTexto) => {

    const areaEncontrada = areas.find(a => a.id === item.areaId);
      console.log("areaEncontrada", areaEncontrada);

      if (areaEncontrada) {

        console.log("setCorArea", areaEncontrada.cor);


        setCorArea(areaEncontrada.cor);

        const brilho = calcularBrilho(areaEncontrada.cor);
        console.log("brilho", brilho);
        console.log("brilho > 186", brilho > 186);
        console.log("areaEncontrada.nome === 'SEM CATEGORIA'", areaEncontrada.nome === 'SEM CATEGORIA');

        setCorTexto(brilho < 186 || areaEncontrada.nome === 'SEM CATEGORIA' ? '#fff' : '#000');
      } else {
        console.log("Área não encontrada, aplicando cores padrão");
        setCorArea('#000');
        setCorTexto('#fff');
      }
  }