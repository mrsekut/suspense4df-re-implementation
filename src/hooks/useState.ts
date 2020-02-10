import { Thunk, run, M, makeComponent } from "../kit";

// Async Effect
const runCont = (thunk: Thunk) =>
  run(
    value => (cont: any) => cont(value),
    (arg, next) => (cont: any) => arg((value: any) => next(value)(cont))
  )(thunk)((v: any) => {});

type Cont<T> = (a: [T, Cont<T>]) => any;

// hooks
export const useState = <T>(initial: T): [T, (s: T) => T] =>
  M((cont: Cont<T>) =>
    cont([
      initial,
      function next(value: any) {
        cont([value, next]);
      }
    ])
  );

export const Component = makeComponent(runCont);
