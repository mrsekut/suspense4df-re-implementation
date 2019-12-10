import React from "react";
import "./App.css";
import { M, Component } from "./kit";

const useDelay = (value: string, delay = 1000) =>
  M(new Promise(rs => setTimeout(() => rs(value), delay)));

const App = Component(() => {
  const m1 = useDelay("hello");
  const m2 = useDelay("world");
  return (
    <div className="App">
      <h1>
        {m1}, {m2}
      </h1>
    </div>
  );
});

export default App;