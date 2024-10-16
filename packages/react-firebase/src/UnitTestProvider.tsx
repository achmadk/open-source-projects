import type { FirebaseOptions } from "firebase/app";

import { FirebaseProvider, type FirebaseProviderProps } from "./app";

export interface UnitTestProviderProps
  extends Omit<FirebaseProviderProps, "options"> {
  options?: FirebaseOptions;
}

export const UnitTestProvider = <
  Props extends UnitTestProviderProps = UnitTestProviderProps,
>({
  children,
  options = JSON.parse(firebaseConfig) as FirebaseOptions,
  context,
}: Props) => {
  return (
    <FirebaseProvider options={options} context={context}>
      {children}
    </FirebaseProvider>
  );
};
