import type {
  EmulatorMockTokenOptions,
  Transaction,
  TransactionOptions,
} from "firebase/firestore";

export interface DefaultRunTransactionOptions<T = unknown> {
  updateFunction(transaction: Transaction): Promise<T>;
  options?: TransactionOptions;
}

export interface DefaultConnectFirestoreEmulatorOptions {
  host: string;
  port: number;
  options: {
    mockUserToken?: string | EmulatorMockTokenOptions;
  };
}

export interface DefaultCollectionOptions {
  path: string;
  pathSegments: string[];
}

export interface DefaultDocOptions extends DefaultCollectionOptions {}
