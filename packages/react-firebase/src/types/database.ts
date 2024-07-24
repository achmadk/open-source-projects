import type { EmulatorMockTokenOptions } from "firebase/database";

export interface ConnectDatabaseEmulatorOptions {
  host: string;
  port: number;
  options?: {
    mockUserToken?: EmulatorMockTokenOptions;
  };
}
