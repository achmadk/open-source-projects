import type {
  AnalyticsCallOptions,
  CustomEventName,
  CustomParams,
} from "firebase/analytics";

export interface LogEventOptions<EventName extends string = string> {
  eventName: CustomEventName<EventName>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  eventParams?: { [key: string]: any };
  options?: AnalyticsCallOptions;
}

export interface SetUserIDOptions {
  id: string | null;
  options?: AnalyticsCallOptions;
}

export interface SetUserPropertiesOptions {
  properties: CustomParams;
  options?: AnalyticsCallOptions;
}
