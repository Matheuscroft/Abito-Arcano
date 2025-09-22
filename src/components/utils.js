const calcularBrilho = (corHex) => {
    const r = parseInt(corHex.substring(1, 3), 16);
    const g = parseInt(corHex.substring(3, 5), 16);
    const b = parseInt(corHex.substring(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114);
  }

  export const setarCorAreaETexto = (item, areas, setCorArea, setCorTexto, setNomeArea, setNomeSubarea) => {
  const areaEncontrada = areas.find(a => a.id === item.areaId);

  if (areaEncontrada) {
    setCorArea(areaEncontrada.color);
    setNomeArea?.(areaEncontrada.name);
    const brilho = calcularBrilho(areaEncontrada.color);
    setCorTexto(brilho < 186 || areaEncontrada.name.toUpperCase() === 'SEM CATEGORIA' ? '#fff' : '#000');

    if (item.subareaId && Array.isArray(areaEncontrada.subareas)) {
      const subareaEncontrada = areaEncontrada.subareas.find(
        (s) => s.id === item.subareaId
      );
      if (subareaEncontrada) {
        setNomeSubarea?.(subareaEncontrada.name);
      } else {
        setNomeSubarea?.("");
      }
    } else {
      setNomeSubarea?.("");
    }
  } else {
    setCorArea('#000');
    setCorTexto('#fff');
    setNomeArea?.('Sem Categoria');
    setNomeSubarea?.("");
  }
};
