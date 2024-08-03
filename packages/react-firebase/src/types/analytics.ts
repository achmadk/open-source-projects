import {
  getAnalytics,
  initializeAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
} from "firebase/analytics";

import type {
  Analytics,
  AnalyticsCallOptions,
  CustomEventName,
  CustomParams,
} from "firebase/analytics";

/**
 * @description attributes for {@link logEvent} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface LogEventOptions
 * @template EventName
 */
export interface LogEventOptions<EventName extends string = string> {
  /**
   * @description second parameter when use {@link logEvent} method
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {CustomEventName<EventName>}
   * @memberof LogEventOptions
   */
  eventName: CustomEventName<EventName>;

  /**
   * @description third parameter when use {@link logEvent} method
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {{ [key: string]: any }}
   * @memberof LogEventOptions
   */
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  eventParams?: { [key: string]: any };

  /**
   * @description last parameter when use {@link logEvent} method
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {AnalyticsCallOptions}
   * @memberof LogEventOptions
   */
  options?: AnalyticsCallOptions;
}

/**
 * @description attributes for {@link setUserId} method
 * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
 * @date 30/07/2024
 * @export
 * @interface SetUserIDOptions
 */
export interface SetUserIDOptions {
  /**
   * @description second parameter when use {@link setUserId} method
   * @default null
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {(string | null)}
   * @memberof SetUserIDOptions
   */
  id?: string | null;

  /**
   * @description third parameter when use {@link setUserId} method
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {AnalyticsCallOptions}
   * @memberof SetUserIDOptions
   */
  options?: AnalyticsCallOptions;
}

/**
 * @description attributes for {@link setUserProperties} method
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface SetUserPropertiesOptions
 */
export interface SetUserPropertiesOptions {
  /**
   * @description second parameter when use {@link setUserProperties} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {CustomParams}
   * @memberof SetUserPropertiesOptions
   */
  properties: CustomParams;

  /**
   * @description third parameter when use {@link setUserProperties} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {AnalyticsCallOptions}
   * @memberof SetUserPropertiesOptions
   */
  options?: AnalyticsCallOptions;
}

export interface DefaultOptionsOnlyAnalytics {
  /**
   * @description firebase analytics instance, either from {@link getAnalytics} or {@link initializeAnalytics} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {Analytics}
   * @memberof DefaultOptionsOnlyAnalytics
   */
  analytics?: Analytics;
}
