import indexedDB from 'fake-indexeddb'

/**
 * use `fake-indexeddb` library in order to access indexedDB global
 * variable when testing.
 */
globalThis.indexedDB = indexedDB
