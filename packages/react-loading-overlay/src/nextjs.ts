"use client";

// eslint-disable-next-line react-refresh/only-export-components
export * from "./types";

export { LoadingOverlay } from "./LoadingOverlay";

import { LoadingOverlay } from "./LoadingOverlay";

/**
 * @deprecated please use named export {@link LoadingOverlay} instead
 * ## MIGRATION GUIDE
 * ```diff
 * - import LoadingOverlay from 'react-loading-overlay-ts'
 * + import { LoadingOverlay } from '@achmadk/react-loading-overlay'
 * ```
 */
// eslint-disable-next-line react-refresh/only-export-components
export default LoadingOverlay;
