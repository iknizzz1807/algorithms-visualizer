import React, { useState } from "react";
import { Algorithm } from "../types";

interface ControlsProps {
  onAlgorithmChange: (algorithm: Algorithm) => void;
  onArraySizeChange: (size: number) => void;
  onRandomize: () => void;
  onSort: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  onAlgorithmChange,
  onArraySizeChange,
  onRandomize,
  onSort,
}) => {
  const [algorithm, setAlgorithm] = useState<Algorithm>("bubble");
  const [arraySize, setArraySize] = useState<number>(50);

  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const algo = e.target.value as Algorithm;
    setAlgorithm(algo);
    onAlgorithmChange(algo);
  };

  const handleArraySizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setArraySize(size);
    onArraySizeChange(size);
  };

  return (
    <div>
      <select value={algorithm} onChange={handleAlgorithmChange}>
        <option value="bubble">Bubble Sort</option>
        <option value="selection">Selection Sort</option>
        <option value="insertion">Insertion Sort</option>
        <option value="quick">Quick Sort</option>
      </select>
      <input
        type="range"
        min="10"
        max="100"
        value={arraySize}
        onChange={handleArraySizeChange}
      />
      <button onClick={onRandomize}>Randomize</button>
      <button onClick={onSort}>Sort</button>
    </div>
  );
};

export default Controls;
