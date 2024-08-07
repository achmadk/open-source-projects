import { css } from "@emotion/css";
import type { FC } from "react";

export type SpinnerProps = {
  getStyles: (key: string) => TemplateStringsArray;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  cx: (name: string, arg2: any) => string;
};

export const Spinner: FC<SpinnerProps> = ({ cx, getStyles }) => (
  <div className={cx("spinner", css(getStyles("spinner")))}>
    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
    <svg viewBox="25 25 50 50">
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  </div>
);
