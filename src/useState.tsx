import React from "react";
import { M, run, makeComponent, Thunk } from "./kit";

// Async Effect
const runCont = (thunk: Thunk) =>
  run(
    value => (cont: any) => cont(value),
    (arg, next) => (cont: any) => arg((value: any) => next(value)(cont))
  )(thunk)((v: any) => {});

// hooks
const useState = (initial: any): [any, any] =>
  M((cont: any) =>
    cont([
      initial,
      function next(value: any) {
        cont([value, next]);
      }
    ])
  );

const Component = makeComponent(runCont);

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
