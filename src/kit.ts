import React from "react";

/** effectful expression throws this object if it requires suspension */
const token = {};

/** Pointer to mutable data used to record effectful computations */
let context: any;

type Run = (of: Of, chain: Chain) => (thunk: any) => any;
type Of = (v: any) => any;
type Chain = (arg: any, f: any) => any;

/**
 * 抽象的なrunner
 * これがモナドになる
 */
export const run: Run = (of, chain) => thunk => {
  /** here it caches effects requests */
  const trace: any[] = [];
  const ctx: any = { trace };
  return step();
  function step() {
    const savedContext = context;
    ctx.pos = 0;
    try {
      context = ctx;
      return of(thunk());
    } catch (e) {
      /** re-throwing other exceptions */
      if (e !== token) throw e;
      const { pos } = ctx;
      return chain(ctx.effect, (value: any) => {
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
export const M = (eff: any) => {
  /* if the execution is in a replay stage the value will be cached */
  if (context.pos < context.trace.length) return context.trace[context.pos++];
  /* saving the expression to resolve in `run` */
  context.effect = eff;
  throw token;
};

/** converts effectful component function to React component  */
export const makeComponent = (run: (thunk: any) => any) => (
  fun: () => JSX.Element
) =>
  class Wrapper extends React.PureComponent<any, any> {
    mounted: any;
    constructor(props: any) {
      super(props);
      this.state = { control: null };
      run(() => {
        const control = fun();
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
