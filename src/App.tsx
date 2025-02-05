import { useState } from "react";
import "./App.css";
import Header from "./components/Header";

function App() {
  const [count, setCount] = useState(0);
  const [val, setVal] = useState(0);

  const addCount = () => {
    setCount(count + val);
  };

  return (
    <>
      <Header></Header>
      <h3>Hello world!</h3>
      <input
        type="text"
        placeholder="Value"
        onChange={(e) => {
          setVal(Number(e.target.value));
        }}
      />
      <p>{count}</p>
      <button onClick={() => addCount()}>Increase</button>
    </>
  );
}

export default App;
