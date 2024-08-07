import { css, cx } from "@emotion/css";
import type { CSSInterpolation } from "@emotion/css/create-instance";
import { forwardRef, useEffect, useRef, useState } from "react";
import { CSSTransition, type TransitionStatus } from "react-transition-group";
import { Spinner, type SpinnerProps } from "./Spinner";
import { type Styles, styles as defaultStyles } from "./styles";
import type { LoadingOverlayProps, OverflowCSS } from "./types";

const LoadingOverlayBase = <
  PropType extends LoadingOverlayProps = LoadingOverlayProps,
>(
  props: PropType,
) => {
  const {
    innerRef,
    children,
    className,
    onClick,
    spinner = true,
    fadeSpeed = 500,
    active = true,
    styles = {},
    classNamePrefix = "_loading_overlay_",
    text,
  } = props;

  const [overflowCSS, setOverflowCSS] = useState<OverflowCSS | undefined>(
    undefined,
  );
  const wrapperEl = useRef<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  const context = (
    names: string | Array<string | false | undefined>,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ...args: any
  ) => {
    const arr = Array.isArray(names) ? names : ([names] as string[]);
    return cx(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      arr.map((name) =>
        typeof name === "string" ? `${classNamePrefix}${name}` : "",
      ),
      ...args,
    );
  };
  const getStyles = (
    key: keyof Styles,
    providedState?: OverflowCSS | TransitionStatus,
  ) => {
    const base = defaultStyles?.[key]?.(providedState, props);
    const custom: Styles[keyof Styles] | boolean =
      (styles as Styles)?.[key] ?? false;
    if (!custom) return base;
    return (typeof custom === "function" ? custom(base, props) : custom) as
      | CSSInterpolation
      | TemplateStringsArray;
  };

  useEffect(() => {
    wrapperEl.current = overlayRef.current?.parentElement ?? null;
    if (wrapperEl.current !== null) {
      const wrapperStyle = window.getComputedStyle(wrapperEl.current);
      const overflowCSS = (
        ["overflow", "overflowX", "overflowY"] as Array<keyof OverflowCSS>
      ).reduce<OverflowCSS>((m, i) => {
        if (wrapperStyle[i] !== "visible") m[i] = "hidden";
        return m;
      }, {} as OverflowCSS);
      setOverflowCSS(overflowCSS);
    }
  }, []);

  useEffect(() => {
    if (active && wrapperEl.current) {
      wrapperEl.current.scrollTop = 0;
    }
  }, [active]);

  return (
    <div
      data-testid="wrapper"
      ref={innerRef}
      className={context(
        ["wrapper", active && "wrapper--active"],
        css(
          getStyles(
            "wrapper",
            active ? overflowCSS : undefined,
          ) as CSSInterpolation,
        ),
        className,
      )}
    >
      <CSSTransition
        in={active}
        classNames="_loading-overlay-transition"
        timeout={fadeSpeed}
        unmountOnExit
        nodeRef={overlayRef}
      >
        {(state) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            ref={overlayRef}
            data-testid="overlay"
            className={context(
              "overlay",
              css(getStyles("overlay", state) as CSSInterpolation),
            )}
            onClick={onClick}
          >
            <div
              className={context(
                "content",
                css(getStyles("content") as CSSInterpolation),
              )}
            >
              {spinner &&
                (typeof spinner === "boolean" ? (
                  <Spinner
                    cx={context}
                    getStyles={getStyles as SpinnerProps["getStyles"]}
                  />
                ) : (
                  spinner
                ))}
              {text}
            </div>
          </div>
        )}
      </CSSTransition>
      {children}
    </div>
  );
};

export const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (props, ref) => <LoadingOverlayBase innerRef={ref} {...props} />,
);
