import type { FirebasePerformance } from "firebase/performance";

export interface DefaultOptionsOnlyPerformance {
  /**
   * @description used firebase performance instance, either from {@link useFirebasePerformance} or {@link useInitializePerformance}.
   * @author Achmad Kurnianto
   * @date 02/08/2024
   * @type {FirebasePerformance}
   * @memberof DefaultOptionsOnlyPerformance
   */
  performance?: FirebasePerformance;
}
