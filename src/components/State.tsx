import React from "react";
import { Component, useState } from "../hooks/useState";

// ex Component
const State = Component(() => {
  const [s, set] = useState(0);
  return (
    <div>
      <h1>{s}</h1>
      <button onClick={() => set(s + 1)}>inc</button>
    </div>
  );
});

export default State;
