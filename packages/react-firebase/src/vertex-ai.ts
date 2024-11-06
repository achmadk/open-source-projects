import {
  type GenerativeModel,
  type VertexAI,
  type VertexAIOptions,
  getGenerativeModel as firebaseGetGenerativeModel,
  getVertexAI,
} from "firebase/vertexai";

import {
  type DefaultReactFirebaseHooksOptions,
  useFirebaseApp,
} from "./Context";

import { useMemo } from "react";
import type { DefaultGetGenerativeModelInput } from "./types";

/**
 * @description data type options for {@link useFirebaseVertexAI} hooks
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @interface DefaultUseFirebaseVertexAIOptions
 * @extends {DefaultReactFirebaseHooksOptions}
 */
export interface DefaultUseFirebaseVertexAIOptions
  extends DefaultReactFirebaseHooksOptions {
  /**
   * @description second parameter when using {@link getVertexAI}
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {VertexAIOptions}
   * @memberof DefaultUseFirebaseVertexAIOptions
   */
  vertexAIOptions?: VertexAIOptions;
}

/**
 * @description get firebase vertex AI instance easily in your react app.
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}  {VertexAI}
 */
export function useFirebaseVertexAI<
  Options extends
    DefaultUseFirebaseVertexAIOptions = DefaultUseFirebaseVertexAIOptions,
>(options?: Options): VertexAI {
  const app = useFirebaseApp(options?.context);
  return useMemo(
    () => getVertexAI(app, options?.vertexAIOptions),
    [app, options],
  );
}

/**
 * @description get methods which depends on firebase vertex AI instance
 * @author Achmad Kurnianto
 * @date 02/08/2024
 * @export
 * @template Options
 * @param {Options} [options]
 * @returns {*}
 */
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
