import type { ModelParams, RequestOptions } from "firebase/vertexai-preview";

export interface DefaultGetGenerativeModelInput {
  modelParams: ModelParams;
  requestOptions?: RequestOptions;
}
