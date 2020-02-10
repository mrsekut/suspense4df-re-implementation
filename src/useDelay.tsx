import React from "react";
import { M, Component } from "./kit";

const useDelay = (value: string, delay = 1000) =>
  M(new Promise(rs => setTimeout(() => rs(value), delay)));

// ex Component
const Delay = Component(() => {
  const m1 = useDelay("hello");
  const m2 = useDelay("world", 3000);

  return (
    <div>
      <h1>
        {m1}, {m2}
      </h1>
    </div>
  );
});

export default Delay;
