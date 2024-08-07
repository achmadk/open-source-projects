# `@achmadk/react-loading-overlay`

[![npm version](https://badgen.net/npm/v/@achmadk/react-loading-overlay)](https://www.npmjs.com/package/@achmadk/react-loading-overlay)
![minified + gzipped](https://badgen.net/bundlephobia/minzip/@achmadk/react-loading-overlay)
[![downloads](https://badgen.net/npm/dw/@achmadk/react-loading-overlay)](https://www.npmjs.com/package/@achmadk/react-loading-overlay)

<a href="https://www.buymeacoffee.com/achmadkurnianto"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee &emoji=😁&slug=achmadkurnianto&button_colour=5F7FFF&font_colour=ffffff&font_family=Lato&outline_colour=000000&coffee_colour=FFDD00"></a>

A customizable, simple loading overlay with spinner, transitions.

Comparing to `react-loading-overlay`, this library support ES Module and Typescript friendly, and also have another features like ref forwarding and using latest version of `@emotion/css` instead `emotion`.

![](https://github.com/derrickpelletier/react-loading-overlay/blob/master/docs/rlo-example.gif?raw=true)

-------

- [Quick start :running_woman:](#quick-start-running_woman)
- [Usage in nextjs](#usage-in-nextjs)
- [Props :hammer_and_wrench:](#props-hammer_and_wrench)
- [Custom Spinner :recycle:](#custom-spinner-recycle)
- [Custom styling :nail_care:](#custom-styling-nail_care)
  - [Styles with emotion :woman_singer:](#styles-with-emotion-woman_singer)
  - [Styles with css](#styles-with-css)
  - [Styles with styled-components :nail_care:](#styles-with-styled-components-nail_care)

-------

## Quick start :running_woman:

Install this library and its peer dependencies using your favorite package manager (npm/yarn/pnpm)
```sh
# npm
npm i @achmadk/react-loading-overlay react @emotion/css react-transition-group
# yarn
yarn add @achmadk/react-loading-overlay react @emotion/css react-transition-group
# pnpm
pnpm add @achmadk/react-loading-overlay react @emotion/css react-transition-group
```

Wrap your components in it and toggle the `active` prop as necessary.

```jsx
import { useState, useCallback } from 'react';
import { LoadingOverlay } from '@achmadk/react-loading-overlay';

const Sample = () => {
  const [isActive, setActive] = useState(true)
  const handleButtonClicked = useCallback(() => {
    setActive(value => !value)
  }, [])
  return (
    <LoadingOverlay
      active={isActive}
      spinner
      text='Loading your content...'
    >
      <div style={{ height: 200 }}>
        <p>Some content or children or something.</p>
        <button onClick={handleButtonClick}>Toggle active</button>
      </div>
    </LoadingOverlay>
  )
}
```

## Usage in nextjs
This library has built-in support for nextjs. You can import `LoadingOverlay` component from `@achmadk/react-loading-overlay/nextjs`

```diff
import { useState, useCallback } from 'react';
- import { LoadingOverlay } from '@achmadk/react-loading-overlay';
+ import { LoadingOverlay } from '@achmadk/react-loading-overlay/nextjs';

const Sample = () => {
  const [isActive, setActive] = useState(true)
  const handleButtonClicked = useCallback(() => {
    setActive(value => !value)
  }, [])
  return (
    <LoadingOverlay
      active={isActive}
      spinner
      text='Loading your content...'
    >
      <div style={{ height: 200 }}>
        <p>Some content or children or something.</p>
        <button onClick={handleButtonClick}>Toggle active</button>
      </div>
    </LoadingOverlay>
  )
}
```

## Props :hammer_and_wrench:
|**props name** | data type | default value | description |
|---|---|---|---|
| *`active` | `boolean` | true | whether the loader is visible. |
| `fadeSpeed` | `number` (millisecond) | 500 | the transition speed for fading out the overlay. |
| `onClick` | `(event?: MouseEvent<HTMLDivElement>) => void OR Promise<void>` OR `undefined` | `undefined` | click handler for the overlay when active.
| `className` | `string` OR `undefined` | `undefined` | the class name for the wrapping `<div />` that is present whether active or not.
| `classNamePrefix` | `string` | `_loading_overlay_` | the prefix for all classNames on the generated elements. see [Styling](#styles-with-css) for more info. |
| `spinner` | `boolean` or `ReactNode` | `false` | renders the default spinner when `true` (and when the loader is `active`). Otherwise you can provide any valid react node to [use your own spinner](#custom-spinner). |
| `text` | `ReactNode` or `undefined` | `undefined` | the text or react node to render in the loader overlay when active. |
| `styles` | object or `undefined` | `undefined` | see [Styling](#styles-with-emotion) for more info. |
| `ref` | `HTMLDivElement` or `undefined` | `undefined` | this will refer to wrapper element (see [here](#styles-with-emotion-woman_singer)), if you use it with either `useRef` or `createRef`. |

## Custom Spinner :recycle:

Adding a custom spinner is super easy, here's an example:

Acquire the spinner you want to use. Doesn't matter where you get it, as long as you're rendering a valid React node. It can be a custom svg in your codebase if you want. For this example let's use [`react-spinners`](https://www.npmjs.com/package/react-spinners).

```
npm install react-spinners
```

Then simply provide it to the spinner prop for your loader.

```jsx
import { LoadingOverlay } from '@achmadk/react-loading-overlay'
import BounceLoader from 'react-spinners/BounceLoader'

export default function MyLoader({ active, children }) {
  return (
    <LoadingOverlay
      active={active}
      spinner={<BounceLoader />}
    >
      {children}
    </LoadingOverlay>
  )
}
```

## Custom styling :nail_care:

Previous versions were difficult to customize because of limited configuration props. This iteration uses a form of styling heavily inspired by Style configuration was inspired by [`react-select`](https://github.com/JedWatson/react-select). Internally using [`emotion`](https://github.com/emotion-js/emotion) to style elements and providing a `styles` interface to either extend the base styling or completely overwrite it. Additionally, a `classNamePrefix` prop is available to customize the classNames used on each element, allowing you to define your own styles with your own regular css setup.

Keep reading for details on each option.

### Styles with emotion :woman_singer:

The styles prop accepts an object where each key represents one of the following elements:

- `wrapper` - main wrapping element, always present.
- `overlay` - the overlay positioned over top of the children.
- `content` - element inside the overlay containing the spinner and text.
- `spinner` - default spinner element.

Each value must be an object or a function (where the first parameter is the base default styles) that returns an object. In either case, the resulting object will be applied as the final set of styles via emotion.css. See examples below.

+ <details><summary>Custom overlay background (extending base styles)</summary>
  <p>

  ```jsx
  export default function MyLoader({ active, children }) {
    return (
      <LoadingOverlay
        active={active}
        styles={{
          overlay: (base) => ({
            ...base,
            background: 'rgba(255, 0, 0, 0.5)'
          })
        }}
      >
        {children}
      </LoadingOverlay>
    )
  }
  ```
  </p>
  </details>
+ <details><summary>Custom spinner size + color (extending base styles)</summary>
  <p>

  ```jsx
  export default function MyLoader({ active, children }) {
    return (
      <LoadingOverlay
        active={active}
        styles={{
          spinner: (base) => ({
            ...base,
            width: '100px',
            '& svg circle': {
              stroke: 'rgba(255, 0, 0, 0.5)'
            }
          })
        }}
      >
        {children}
      </LoadingOverlay>
    )
  }
  ```
  </p>
  </details>
+ <details><summary>Custom wrapper (non-extended)</summary>
  <p>

  ```jsx
  export default function MyLoader({ active, children }) {
    return (
      <LoadingOverlay
        active={active}
        styles={{
          wrapper: {
            width: '400px',
            height: '400px',
            overflow: active ? 'hidden' : 'scroll'
          }
        }}
      >
        {children}
      </LoadingOverlay>
    )
  }
  ```
  </p>
  </details>

### Styles with css

Every element has a classname you can target via your own css configuration.

- `_loading_overlay_wrapper`
- `_loading_overlay_overlay`
- `_loading_overlay_content`
- `_loading_overlay_spinner`

You can also specify your own `classNamePrefix` if you wish. For example, if using: `classNamePrefix="MyLoader_"`:

- `MyLoader_wrapper`
- `MyLoader_overlay`
- `MyLoader_content`
- `MyLoader_spinner`

The base styles will still be applied, but you could negate all of these using the styles prop:

+ <details><summary>Remove all default styles</summary>
  <p>

  ```jsx
  export default function MyLoader({ active, children }) {
    return (
      <LoadingOverlay
        active={active}
        styles={{
          wrapper: {},
          overlay: {},
          content: {},
          spinner: {}
        }}
        classNamePrefix='MyLoader_'
      >
        {children}
      </LoadingOverlay>
    )
  }
  ```
  </p>
  </details>

### Styles with styled-components :nail_care:

You can style the loader using [`styled-component`](https://github.com/styled-components/styled-components) as you might expect.

Simply include the nested elements in your style definition:

+ <details><summary>styled-components example</summary>
  <p>

  ```jsx
  import styled from 'styled-components'

  const StyledLoader = styled(LoadingOverlay)`
    width: 250px;
    height: 400px;
    overflow: scroll;
    .MyLoader_overlay {
      background: rgba(255, 0, 0, 0.5);
    }
    &.MyLoader_wrapper--active {
      overflow: hidden;
    }
  `

  export default function MyLoader({ active, children }) {
    return (
      <StyledLoader
        active={active}
        classNamePrefix='MyLoader_'
      >
        {children}
      </StyledLoader>
    )
  }
  ```
  </p>
  </details>

## Migrate from `react-loading-overlay-ts`
This library is improvement of existing `react-loading-overlay-ts` in order to:
- support React 19, which no longer use `Component` or `PureComponent` class anymore.
- wrap my open source libraries into one repository instead of multi repository.
- use `vite` and `vitest` for faster development.

Here is a few steps to migrate `react-loading-overlay-ts` to `@achmadk/react-loading-overlay`:
1. install peer dependencies of `@achmadk/react-loading-overlay`, because `@emotion/css` and `react-transition-group` have been moved from dependencies into peer ones instead:
```bash
npm i @emotion/css react-transition-group # npm
yarn add @emotion/css react-transition-group # yarn
pnpm add @emotion/css react-transition-group # pnpm
```
2. Use named component instead of default one to use loading overlay component.
```diff
- import LoadingOverlay from 'react-loading-overlay-ts'
+ import { LoadingOverlay } from '@achmadk/react-loading-overlay'
```
You can still use default component but it was deprecated in this version and will be deleted in the next major version (v4).