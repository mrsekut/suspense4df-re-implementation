import React from "react";
import { Component, useDelay } from "../hooks/useDelay";

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
