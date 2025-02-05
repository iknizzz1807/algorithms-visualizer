import React from "react";

interface TrayProps {
  algorithm: string;
  data: number[];
  setData: React.Dispatch<React.SetStateAction<number[]>>;
}

const Tray: React.FC<TrayProps> = ({ algorithm, data, setData }) => {
  return (
    <div>
      <h3>Algorithm: {algorithm}</h3>
      <p>Data: {data.join(", ")}</p>
      <button onClick={() => setData([])}>Clear Data</button>
    </div>
  );
};

export default Tray;
