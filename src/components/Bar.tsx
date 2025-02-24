import React from "react";

interface BarProps {
  value: number;
  color: string;
}

const Bar: React.FC<BarProps> = ({ value, color }) => {
  return (
    <div
      style={{
        height: `${value}px`,
        backgroundColor: color,
        width: "20px",
        margin: "0 2px",
        display: "inline-block",
      }}
    />
  );
};

export default Bar;
