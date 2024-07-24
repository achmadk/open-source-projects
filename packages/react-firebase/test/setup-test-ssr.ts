import { JSDOM } from 'jsdom'

const jsdom = new JSDOM()

// @ts-ignore
globalThis.window = jsdom.window
globalThis.document = jsdom.window.document
globalThis.navigator = jsdom.window.navigator