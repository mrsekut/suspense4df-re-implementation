import React from "react";

/** effectful expression throws this object if it requires suspension */
const token = {};

/** Pointer to mutable data used to record effectful computations */
let context: any;

export type Thunk = any;
type ThunkFn = (thunk: Thunk) => any;
type Component = () => JSX.Element;
type Of<R> = (v: ThunkFn) => R;
type Chain<R> = (arg: any, f: Fn) => R;

type Fn = (a: any) => any;

type CTX = {
  trace: string[];
  pos: number;
  effect: Promise<string>;
};

/**
 * 抽象的なrunner
 * これがモナドになる
 */
export const run = <R>(of: Of<R>, chain: Chain<R>) => (thunk: Thunk) => {
  /** here it caches effects requests */
  const trace: string[] = [];
  const ctx = { trace } as CTX;
  return step();

  function step(): R {
    const savedContext = context;
    ctx.pos = 0;
    try {
      context = ctx;
      return of(thunk());
    } catch (e) {
      /** re-throwing other exceptions */
      if (e !== token) throw e;
      const { pos, effect } = ctx;
      return chain(effect, value => {
        trace.length = pos;
        /* recording the resolved value */
        trace[pos] = value;
        ctx.pos = pos + 1;
        /** replay */
        // return step(value);
        return step();
      });
    } finally {
      context = savedContext;
    }
  }
};

/** marks effectful expression */
export const M = <T>(eff: T) => {
  /* if the execution is in a replay stage the value will be cached */
  if (context.pos < context.trace.length) return context.trace[context.pos++];
  /* saving the expression to resolve in `run` */
  context.effect = eff;
  throw token;
};

type State = {
  control: JSX.Element | null;
};
/** converts effectful component function to React component  */
export const makeComponent = (run: ThunkFn) => (component: Component) =>
  class Wrapper extends React.PureComponent<{}, State> {
    mounted: boolean;

    constructor(props: {}) {
      super(props);
      this.mounted = false;
      this.state = { control: null };

      run(() => {
        const control = component();
        this.mounted ? this.setState({ control }) : (this.state = { control });
      });
    }

    componentDidMount() {
      this.mounted = true;
    }

    render() {
      return this.state.control;
    }
  };
