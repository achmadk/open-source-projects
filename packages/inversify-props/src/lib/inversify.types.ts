// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type Constructor<T = any> =
  | {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      new (...args: any[]): T;
    }
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  | any;

export type Id = string | symbol;

export type IdsCache = {
  [key: string]: Id;
};
