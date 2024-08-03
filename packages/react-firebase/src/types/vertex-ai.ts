import { getGenerativeModel } from "firebase/vertexai-preview";
import type { ModelParams, RequestOptions } from "firebase/vertexai-preview";

export interface DefaultGetGenerativeModelInput {
  /**
   * @description second parameter when using firebase {@link getGenerativeModel} method
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {ModelParams}
   * @memberof DefaultGetGenerativeModelInput
   */
  modelParams: ModelParams;

  /**
   * @description third parameter when using firebase {@link getGenerativeModel} method
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {RequestOptions}
   * @memberof DefaultGetGenerativeModelInput
   */
  requestOptions?: RequestOptions;
}
