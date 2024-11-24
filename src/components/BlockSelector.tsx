import React from 'react';

interface BlockSelectorProps {
  onSelect: (start: number, end: number) => void;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({ onSelect }) => {
  const handleSelect = (start: number) => {
    onSelect(start, start + 99);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Selecciona el bloque de preguntas bebé</h2>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 25 }, (_, i) => i * 100 + 1).map((start) => (
          <button
            key={start}
            onClick={() => handleSelect(start)}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
          >
            {start} - {start + 99}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BlockSelector;