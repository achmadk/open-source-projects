import {
  type ConnectorConfig,
  type DataConnect,
  connectDataConnectEmulator as firebaseConnectDataConnectEmulator,
  getDataConnect,
  mutationRef as firebaseMutationRef,
  queryRef as firebaseQueryRef,
  terminate as firebaseTerminate,
} from "firebase/data-connect";
import {
  useFirebaseApp,
  type DefaultReactFirebaseHooksOptions,
} from "./Context";
import { useMemo } from "react";
import type {
  DefaultConnectDataConnectEmulatorOptions,
  DefaultMutationRefOptions,
  DefaultQueryRefOptions,
} from "./types";

export interface DefaultUseFirebaseDataConnectOptions
  extends DefaultReactFirebaseHooksOptions {
  dataConnectOptions: ConnectorConfig;
}

export function useFirebaseDataConnect<
  Options extends
    DefaultUseFirebaseDataConnectOptions = DefaultUseFirebaseDataConnectOptions,
>(options: Options): DataConnect {
  const app = useFirebaseApp(options?.context);
  return useMemo(
    () => getDataConnect(app, options.dataConnectOptions),
    [app, options.dataConnectOptions],
  );
}

export function useFirebaseDataConnectMethods<
  Options extends
    DefaultUseFirebaseDataConnectOptions = DefaultUseFirebaseDataConnectOptions,
>(options: Options) {
  const dataConnect = useFirebaseDataConnect(options);

  const connectDataConnectEmulator = <
    Opts extends
      DefaultConnectDataConnectEmulatorOptions = DefaultConnectDataConnectEmulatorOptions,
  >(
    opts: Opts,
  ) =>
    firebaseConnectDataConnectEmulator(
      dataConnect,
      opts.host,
      opts?.port,
      opts?.sslEnabled,
    );

  const mutationRef = <
    Data = unknown,
    Variable = unknown,
    Opts extends
      DefaultMutationRefOptions<Variable> = DefaultMutationRefOptions<Variable>,
  >(
    opts: Opts,
  ) => {
    const variables = opts?.variables ?? null;
    if (variables !== null) {
      return firebaseMutationRef<Data, Variable>(
        dataConnect,
        opts.mutationName,
        variables,
      );
    }
    return firebaseMutationRef<Data>(dataConnect, opts.mutationName);
  };

  const queryRef = <
    Data = unknown,
    Variable = unknown,
    Opts extends
      DefaultQueryRefOptions<Variable> = DefaultQueryRefOptions<Variable>,
  >(
    opts: Opts,
  ) => {
    const variables = opts?.variables ?? null;
    if (variables !== null) {
      return firebaseQueryRef<Data, Variable>(
        dataConnect,
        opts.queryName,
        variables,
      );
    }
    return firebaseQueryRef<Data>(dataConnect, opts.queryName);
  };

  const terminate = async () => await firebaseTerminate(dataConnect);

  return {
    connectDataConnectEmulator,
    mutationRef,
    queryRef,
    terminate,
  };
}
