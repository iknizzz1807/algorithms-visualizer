import React, { useEffect, useState } from "react";
import "../styles/Form.css";
import { DataContext } from "../contexts/DataContext";
import Tray from "./Tray";

function Form() {
  const [number, setNumber] = useState(100);
  const [algorithm, setAlgorithm] = useState("BubbleSort");
  const [data, setData] = useState<number[]>([]);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(Number(e.target.value));
  };

  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAlgorithm(e.target.value);
  };

  const generateSample = (number: number) => {
    const isSortedElement = document.getElementById("isSorted");
    if (isSortedElement) {
      (isSortedElement as HTMLInputElement).value = "0";
    }

    if (number <= 1) {
      window.alert("The minimum array size is 2.");
      return;
    }

    if (number > 200) {
      window.alert("The max array size is 200.");
      return;
    }

    const newData: number[] = [];
    let dataCounter: number = 0;
    let randomElement: number;

    while (dataCounter < number) {
      randomElement = Math.floor(Math.random() + number + 1);
      if (!newData.includes(randomElement)) {
        newData[dataCounter] = randomElement;
        dataCounter++;
      }
    }
    setData(newData);
  };

  useEffect(() => {
    generateSample(number);
  }, []);

  return (
    <React.Fragment>
      <div>
        <select
          name="SortingAlgorithm"
          id="SortingAlgorithm"
          className="formElement"
          value={algorithm}
          onChange={handleAlgorithmChange}
        >
          <option value="BubbleSort">Bubble Sort</option>
          <option value="SelectionSort">Selection Sort</option>
          <option value="InsertionSort">Insertion Sort</option>
          <option value="CocktailShakerSort">Cocktail Shaker Sort</option>
        </select>
        <input
          type="text"
          id="count"
          placeholder="Array Size"
          className="formElement"
          autoComplete="off"
          value={number}
          onChange={handleCountChange}
        />
        <button
          className="formElement"
          onClick={() => {
            generateSample(number);
          }}
          id="generateButton"
        >
          Generate Sample
        </button>
        <DataContext.Provider value={data}>
          <Tray algorithm={algorithm} data={data} setData={setData} />
        </DataContext.Provider>
      </div>
    </React.Fragment>
  );
}

export default Form;
