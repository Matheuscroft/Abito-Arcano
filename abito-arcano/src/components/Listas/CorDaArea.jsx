import React from 'react';

const CorDaArea = ({ areaId, areas }) => {
  const area = areas.find((area) => area.id === areaId);
  const cor = area ? area.cor : '#000';

  return (
    <div
      style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: cor,
      }}
    />
  );
};

export default CorDaArea;
