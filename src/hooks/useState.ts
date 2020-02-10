import { Thunk, run, M, makeComponent } from "../kit";

// Async Effect
const runCont = (thunk: Thunk) =>
  run(
    value => (cont: any) => cont(value),
    (arg, next) => (cont: any) => arg((value: any) => next(value)(cont))
  )(thunk)((v: any) => {});

// hooks
export const useState = (initial: any): [any, any] =>
  M((cont: any) =>
    cont([
      initial,
      function next(value: any) {
        cont([value, next]);
      }
    ])
  );

export const Component = makeComponent(runCont);
