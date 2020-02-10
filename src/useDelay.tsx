import React from "react";
import { M, run, makeComponent } from "./kit";

/**
 * Async Effect
 */
const runPromise = run(
  v => Promise.resolve(v), // of
  (arg, f) => arg.then(f) // chain
);

const Component = makeComponent(runPromise);

// hooks
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
