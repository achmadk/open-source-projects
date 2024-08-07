import { render, screen } from "@testing-library/react";
// @vitest-environment jsdom
import { describe, expect, test } from "vitest";

import { LoadingOverlay } from "./LoadingOverlay";

describe("test LoadingOverlay.tsx file", () => {
  test("rendered successfully", () => {
    const { unmount } = render(<LoadingOverlay />);
    const elClassNames = screen.getByTestId("wrapper").className;
    console.log(elClassNames);
    expect(elClassNames.includes("wrapper--active")).toBeTruthy();
    unmount();
  });

  test("rendered successfully with active value is false", () => {
    const { unmount } = render(<LoadingOverlay active={false} />);
    const elClassNames = screen.getByTestId("wrapper").className;
    console.log(elClassNames);
    expect(!elClassNames.includes("wrapper--active")).toBeTruthy();
    unmount();
  });

  test("rendered successfully with custom spinner", () => {
    const { unmount } = render(<LoadingOverlay spinner="Loading..." />);
    expect(screen.getByTestId("wrapper")).not.toBeUndefined();
    unmount();
  });
});
