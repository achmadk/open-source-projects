import {
  type Container,
  container,
  getContainer,
} from "@achmadk/inversify-props";
import {
  type Context,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
} from "react";

export {
  Inject,
  inject,
  injectable,
  Container,
  cid,
  resetContainer,
  mockRequest,
  mockSingleton,
  mockTransient,
  container,
  setContainer,
  getContainer,
} from "@achmadk/inversify-props";

/**
 * @deprecated please use combination
 * of {@link ContainerProvider} and {@link useContainerGet} instead
 * ## MIGRATION GUIDE
 * ```diff
 * function containerBuilder() {
 *   container.addSingleton<ISample>(Sample, SAMPLE)
 * + return container // MUST RETURN VALUE
 * }
 * - const [sample] = useInject<ISample>(SAMPLE)
 * + // add `ContainerProvider` component into root first
 * + <ContainerProvider value={containerBuilder()}>
 * + // then use `useContainerGet` into child component
 * + const sample = useContainerGet<ISample>(SAMPLE)
 * ```
 *
 * @export
 * @template T
 * @param {(string | symbol)} id
 * @return {*}  {T[]}
 *
 */
export function useInject<T>(id: string | symbol): T[] {
  return [getContainer().get<T>(id)];
}

export const ContainerContext = createContext(container);

export interface ContainerProviderProps {
  children: ReactNode;
  value: Container;
  context?: Context<Container>;
}

export const ContainerProvider = <
  PropType extends ContainerProviderProps = ContainerProviderProps,
>({
  children,
  value,
  context: Context = ContainerContext,
}: PropType) => {
  useEffect(() => {
    return () => {
      value.unbindAll();
    };
  }, [value.unbindAll]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useContainer<C extends Container = Container>(
  context = ContainerContext,
) {
  return useContext<C>(context as unknown as Context<C>);
}

export function useContainerGet<T = unknown, C extends Container = Container>(
  id: string | symbol,
  context = ContainerContext,
) {
  const container = useContainer<C>(context);
  return container.get<T>(id);
}
