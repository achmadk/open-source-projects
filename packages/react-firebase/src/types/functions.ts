import type { HttpsCallableOptions } from "firebase/functions";

export interface DefaultConnectFunctionsEmulatorOptions {
  host: string;
  port: number;
}

export interface DefaultHttpsCallableOptions {
  name: string;
  options?: HttpsCallableOptions;
}

export interface DefaultHttpsCallableFromURLOptions {
  url: string;
  options?: HttpsCallableOptions;
}
