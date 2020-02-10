import { run, makeComponent, M } from "../kit";

/**
 * Async Effect
 */
const runPromise = run(
  v => Promise.resolve(v), // of
  (arg, f) => arg.then(f) // chain
);

export const Component = makeComponent(runPromise);

// hooks
export const useDelay = (value: string, delay = 1000) =>
  M(new Promise(rs => setTimeout(() => rs(value), delay)));
