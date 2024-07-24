import {
  type GenerativeModel,
  type VertexAI,
  type VertexAIOptions,
  getGenerativeModel as firebaseGetGenerativeModel,
  getVertexAI,
} from "firebase/vertexai-preview";

import {
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";

import type { DefaultGetGenerativeModelInput } from "./types";

export interface DefaultUseFirebaseVertexAIOptions
  extends DefaultReactFirebaseHooksOptions {
  vertexAIOptions?: VertexAIOptions;
}

export function useFirebaseVertexAI<
  Options extends
    DefaultUseFirebaseVertexAIOptions = DefaultUseFirebaseVertexAIOptions,
>(options?: Options): VertexAI {
  const app = useFirebaseApp(options?.context);
  return getVertexAI(app, options?.vertexAIOptions);
}

export function useFirebaseVertexAIMethods<
  Options extends
    DefaultUseFirebaseVertexAIOptions = DefaultUseFirebaseVertexAIOptions,
>(options?: Options) {
  const vertexAI = useFirebaseVertexAI(options);

  const getGenerativeModel = <
    Input extends
      DefaultGetGenerativeModelInput = DefaultGetGenerativeModelInput,
  >(
    input: Input,
  ): GenerativeModel =>
    firebaseGetGenerativeModel(
      vertexAI,
      input.modelParams,
      input?.requestOptions,
    );

  return {
    getGenerativeModel,
  };
}
