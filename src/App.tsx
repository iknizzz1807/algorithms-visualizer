import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Form from "./components/Form";

function App() {
  const [count, setCount] = useState(0);
  const [val, setVal] = useState(0);

  const addCount = () => {
    setCount(count + val);
  };

  return (
    <>
      <Header />
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
      <Form />
    </>
  );
}

export default App;
