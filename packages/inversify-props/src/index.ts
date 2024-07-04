import { setContainer } from "./lib/container";

export const container = setContainer({ skipBaseClassChecks: true });

export { idsCache as cid } from "./lib/id.helper";
export * from "./lib/container";
export * from "./lib/id.helper";
export * from "./lib/inject.helper";
export * from "./lib/mocks.helper";
export * from "./lib/parameters.helper";
