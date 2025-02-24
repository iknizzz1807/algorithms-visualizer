import React from "react";
import Bar from "./Bar";
import { Bar as BarType } from "../types";

interface TrayProps {
  array: BarType[];
}

const Tray: React.FC<TrayProps> = ({ array }) => {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", marginTop: "20px" }}>
      {array.map((bar, index) => (
        <Bar key={index} value={bar.value} color={bar.color} />
      ))}
    </div>
  );
};

export default Tray;
