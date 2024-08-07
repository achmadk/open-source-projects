import { Suspense, lazy, useState } from "react";
import viteLogo from "/vite.svg";
// import { LoadingOverlay } from '@achmadk/react-loading-overlay'
import reactLogo from "./assets/react.svg";
import "./App.css";

const LoadingOverlay = lazy(() => import("@achmadk/react-loading-overlay"));

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Suspense>
      <LoadingOverlay active={loading}>
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </LoadingOverlay>
      <h1>Vite + React</h1>
      <div className="card">
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button onClick={() => setLoading((prevValue) => !prevValue)}>
          {`loading: ${loading}, toggle it!`}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </Suspense>
  );
}

export default App;
