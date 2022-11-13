import * as C from 'purify-ts';

type RecordString<T> = Record<string, T>;

export abstract class GraphPortType<ValueType> {
  readonly _valueType!: ValueType;
  public describe<PT extends RecordString<GraphPortTypeAny>, K extends keyof PT>(
    name: string,
    description: string
  ): GraphPort<PT, K> {
    return new GraphPort<PT, K>(name, description);
  }
}

export type GraphPortTypeAny = GraphPortType<any>;
export type GraphPortTypeSet<T extends RecordString<GraphPortTypeAny>> = {
  [K in keyof T]: {
    describe: (name: string, desc: string) => GraphPort<T, K>;
  };
};

export class GraphPortTypeString extends GraphPortType<string> {}
export class GraphPortTypeNumber extends GraphPortType<number> {}
export class GraphPortTypeBytes extends GraphPortType<Uint8Array> {}

export class GraphPort<
  T extends RecordString<GraphPortTypeAny>,
  K extends keyof T
> extends GraphPortType<T[K]['_valueType']> {
  constructor(public name: string, public description: string) {
    super();
  }
}

export type GraphPortAny<PT extends RecordString<GraphPortTypeAny>> = GraphPort<PT, any>;
export type InferInput<PT extends RecordString<GraphPortTypeAny>, I> = I extends RecordString<
  GraphPortAny<PT>
>
  ? {
      [K in keyof I]: I[K]['_valueType'];
    }
  : undefined;

class GraphNode<
  PT extends RecordString<GraphPortTypeAny>,
  Input extends RecordString<GraphPortAny<PT>>,
  Output extends RecordString<GraphPortAny<PT>> | undefined = undefined
> {
  readonly _Input!: Input;
  readonly _Output!: Output;

  constructor(
    public name: string,
    public description: string,
    public input: Input,
    public output: Output,
    public fn: (i: InferInput<PT, Input>) => Promise<InferInput<PT, Output>>
  ) {}
}

export class RootNode<
  PT extends RecordString<GraphPortTypeAny>,
  Input extends RecordString<GraphPortAny<PT>>
> extends GraphNode<PT, Input, undefined> {}

export interface InferContext<
  PT extends RecordString<GraphPortTypeAny>,
  RI extends RecordString<GraphPortAny<PT>>,
  N extends RecordString<GraphNode<PT, any, any>>
> {
  root: (i: InferInput<PT, RI>) => Promise<undefined>;
  nodes: {
    [K in keyof N]: (i: N[K]['_Input']) => Promise<N[K]['_Output']>;
  };
}

export class GraphSpec<
  Config,
  PT extends RecordString<GraphPortTypeAny>,
  RI extends RecordString<GraphPortAny<PT>>,
  N extends RecordString<GraphNode<PT, any, any>>
> {
  constructor(
    public readonly config: Config,
    public readonly portTypes: PT,
    public readonly rootNode: RootNode<PT, RI>,
    public readonly nodes: N
  ) {}

  public buildContext(): InferContext<PT, RI, N> {
    // TYPE ASSERTION: nodes potentially has extra properties, but we will assume there aren't any
    const keys = Object.keys(this.nodes) as Array<keyof N>;

    // TYPE ASSERTION: building a generic keyed struct
    const ns: any = keys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: this.nodes[key]?.fn
      }),
      {}
    );

    return {
      root: this.rootNode.fn,
      nodes: ns
    };
  }
}

// public API

export const ports = {
  string: () => new GraphPortTypeString(),
  number: () => new GraphPortTypeNumber(),
  bytes: () => new GraphPortTypeBytes()
};

// TODO: nodes should also have inputs that come from the config
// ie., choosing the input file, ref data etc

export const nodes = {
  makeRoot: <T extends RecordString<GraphPortTypeAny>, R extends RecordString<GraphPort<T, any>>>(
    name: string,
    description: string,
    inputs: R,
    fn: (input: InferInput<T, R>) => Promise<undefined>
  ): RootNode<T, R> => new RootNode(name, description, inputs, undefined, fn),
  makeNode: <
    T extends RecordString<GraphPortTypeAny>,
    R extends RecordString<GraphPortAny<T>>,
    O extends RecordString<GraphPortAny<T>>
  >(
    name: string,
    description: string,
    inputs: R,
    outputs: O,
    fn: (input: InferInput<T, R>) => Promise<InferInput<T, O>>
  ): GraphNode<T, R, O> => new GraphNode<T, R, O>(name, description, inputs, outputs, fn)
};

export const makeGraph = <
  Config,
  T extends RecordString<GraphPortTypeAny>,
  RI extends RecordString<GraphPortAny<T>>,
  N extends RecordString<GraphNode<T, any, any>>
>(
  config: Config,
  portTypes: T,
  getRoot: (pt: GraphPortTypeSet<T>) => RootNode<T, RI>,
  getNodes: (pt: GraphPortTypeSet<T>) => N
): GraphSpec<Config, T, RI, N> => {
  const rootNode = getRoot(portTypes);
  const nodes = getNodes(portTypes);
  return new GraphSpec<Config, T, RI, N>(config, portTypes, rootNode, nodes);
};

export const integrationMetadataCodec = C.Codec.interface({
  id: C.string,
  name: C.string,
  description: C.string
});

export type IntegrationMetadata = C.GetType<typeof integrationMetadataCodec>;
