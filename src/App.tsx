import React, { useState } from "react";
import Tray from "./components/Tray";
import Controls from "./components/Controls";
import {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
} from "./algorithms/index";
import { Bar, Algorithm } from "./types";
// import "./styles.css";

const App: React.FC = () => {
  const [array, setArray] = useState<Bar[]>([]);
  const [algorithm, setAlgorithm] = useState<Algorithm>("bubble");

  const generateRandomArray = (size: number) => {
    const newArray = Array.from({ length: size }, () => ({
      value: Math.floor(Math.random() * 100) + 10,
      color: "#4A90E2",
    }));
    setArray(newArray);
  };

  const handleAlgorithmChange = (algo: Algorithm) => {
    setAlgorithm(algo);
  };

  const handleArraySizeChange = (size: number) => {
    generateRandomArray(size);
  };

  const handleRandomize = () => {
    generateRandomArray(array.length);
  };

  const handleSort = async () => {
    const arrayCopy = [...array];
    switch (algorithm) {
      case "bubble":
        await bubbleSort(arrayCopy, setArray);
        break;
      case "selection":
        await selectionSort(arrayCopy, setArray);
        break;
      case "insertion":
        await insertionSort(arrayCopy, setArray);
        break;
      case "quick":
        await quickSort(arrayCopy, 0, arrayCopy.length - 1, setArray);
        break;
      default:
        break;
    }
  };

  React.useEffect(() => {
    generateRandomArray(50);
  }, []);

  return (
    <div className="App">
      <h1>Sorting Algorithms Visualizer</h1>
      <Controls
        onAlgorithmChange={handleAlgorithmChange}
        onArraySizeChange={handleArraySizeChange}
        onRandomize={handleRandomize}
        onSort={handleSort}
      />
      <Tray array={array} />
    </div>
  );
};

export default App;
