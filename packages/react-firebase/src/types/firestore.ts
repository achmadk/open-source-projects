import {
  collection,
  connectFirestoreEmulator,
  doc,
  getFirestore,
  runTransaction,
} from "firebase/firestore";

import type {
  EmulatorMockTokenOptions,
  Firestore,
  FirestoreError,
  Transaction,
  TransactionOptions,
} from "firebase/firestore";

export type DefaultObserverType =
  | (() => void)
  | {
      // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
      next?: (value: void) => void;
      error?: (error: FirestoreError) => void;
      complete?: () => void;
    };

/**
 * @description attributes for {@link runTransaction} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultRunTransactionOptions
 * @template T
 */
export interface DefaultRunTransactionOptions<T = unknown> {
  /**
   * @description second parameter of {@link runTransaction} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @param {Transaction} transaction
   * @returns {*}  {Promise<T>}
   * @memberof DefaultRunTransactionOptions
   */
  updateFunction(transaction: Transaction): Promise<T>;

  /**
   * @description third parameter of {@link runTransaction} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {TransactionOptions}
   * @memberof DefaultRunTransactionOptions
   */
  options?: TransactionOptions;
}

/**
 * @description attributes for {@link connectFirestoreEmulator} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultConnectFirestoreEmulatorOptions
 */
export interface DefaultConnectFirestoreEmulatorOptions {
  /**
   * @description second parameter of {@link connectFirestoreEmulator} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultConnectFirestoreEmulatorOptions
   */
  host: string;

  /**
   * @description third parameter of {@link connectFirestoreEmulator} method
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {number}
   * @memberof DefaultConnectFirestoreEmulatorOptions
   */
  port: number;

  /**
   * @description fourth parameter of {@link connectFirestoreEmulator} method
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {({
   *     mockUserToken?: string | EmulatorMockTokenOptions;
   *   })}
   * @memberof DefaultConnectFirestoreEmulatorOptions
   */
  options: {
    mockUserToken?: string | EmulatorMockTokenOptions;
  };
}

/**
 * @description attributes for {@link collection} and {@link doc} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultCollectionOptions
 */
export interface DefaultCollectionOptions {
  /**
   * @description second parameter of {@link collection} method.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string}
   * @memberof DefaultCollectionOptions
   */
  path: string;

  /**
   * @description third and next parameters of {@link collection} method, wrapped in array of strings.
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {string[]}
   * @memberof DefaultCollectionOptions
   */
  pathSegments: string[];
}

/**
 * @description attributes for {@link doc} method.
 * @author Achmad Kurnianto
 * @date 30/07/2024
 * @export
 * @interface DefaultDocOptions
 * @extends {DefaultCollectionOptions}
 */
export interface DefaultDocOptions extends DefaultCollectionOptions {}

/**
 * @description option data type which contains only {@link firestore}
 * @author Achmad Kurnianto
 * @date 01/08/2024
 * @export
 * @interface DefaultOptionsOnlyFirestore
 */
export interface DefaultOptionsOnlyFirestore {
  /**
   * @description firebase firestore instance. by default get from {@link getFirestore}
   * @author Achmad Kurnianto
   * @date 30/07/2024
   * @type {FireStore}
   * @memberof DefaultOptionsOnlyFirestore
   */
  firestore?: Firestore;
}
