export interface DefaultConnectDataConnectEmulatorOptions {
  host: string;
  port?: number;
  sslEnabled?: boolean;
}

export interface DefaultMutationRefOptions<Variable = unknown> {
  mutationName: string;
  /**
   * @default null
   */
  variables?: Variable | null;
}

export interface DefaultQueryRefOptions<Variable = unknown> {
  queryName: string;
  /**
   * @default null
   */
  variables?: Variable | null;
}
