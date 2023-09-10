import React, { useRef, MouseEventHandler, useEffect } from "react";
import { Theme, ThemeProvider, styled } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Block, BlockType } from "./types";
import Sidebar from "./Sidebar";
import defaultTheme from "./theme";
import { AddBlockButtonProps } from "./AddBlockButton";
import { PreviewInstance } from "./Preview/PreviewIframe";
import Header from "./Header";
import { Provider, EditorState } from "./store";
import EditorPreview from "./EditorPreview";
import MessageBus from "./MessageBus";
import Snackbar from "./Snackbar";

declare module "@mui/material/useMediaQuery" {
  interface Options {
    defaultMatches?: boolean;
    noSsr?: boolean;
    ssrMatchMedia?: (query: string) => { matches: boolean };
    matchMedia?: typeof window.matchMedia;
  }
}

const PREFIX = "Editor";

const classes = {
  root: `${PREFIX}-root`,
  main: `${PREFIX}-main`,
  sidebarWrapper: `${PREFIX}-sidebarWrapper`,
  dragBar: `${PREFIX}-dragBar`,
};

const Root = styled("div")(({ theme }) => ({
  "*": {
    fontSize: theme.typography.fontSize,
  },

  width: "100%",
  height: "100%",
  overflow: "none",
  position: "relative",
  display: "flex",
  flexDirection: "row",

  [`& .${classes.main}`]: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
    flexGrow: 1,
    zIndex: 0,
  },

  [`& .${classes.sidebarWrapper}`]: {
    top: 0,
    zIndex: 2,
    position: "relative",
    maxWidth: 365,
    width: "100%",
    height: "100%",
    minHeight: "97px",
    maxHeight: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
  },

  [`& .${classes.dragBar}`]: {
    width: 0,
    height: "100%",
    top: 0,
    left: 0,
    position: 'relative',
    userSelect: "none",
    zIndex: 10,
    cursor: "col-resize",
    "&::before": {
      content: "''",
      display: 'block',
      position: 'absolute',
      left: -5,
      width: 10,
      height: '100%',
    }
  },
}));

type EditorBaseProps = {
  data?: Block[];
  blockTypes: BlockType[];
  onChange?(data: Block[]): void;
  title?: string;
  cardinality?: number;
  addBlockDisplayFormat?: AddBlockButtonProps["displayFormat"];
  storage?: EditorState["storage"];
};

type FullEditorProps = EditorBaseProps & {
  format: "full";
  editorTheme?: Theme;
  isFullScreen?: boolean;
  onFullScreen?(): void;
  onFullScreenExit?(): void;
  onPreviewIframeLoad?(iframe: HTMLIFrameElement): void;
  previewWrapperComponent?: React.ElementType;
  previewSrc?: string;
  previewWidth?: "sm" | "md" | "lg";
  onAction?(action: { type: string; payload: any }): void;
  onPreviewInstanceLoad?(preview: PreviewInstance): void;
  allowedOrigins?: string[];
};

type EditorOnlyProps = EditorBaseProps & {
  format: "sidebar";
  onBack?(): void;
};

type InlineEditorProps = EditorBaseProps & {
  format: "inline";
};

export type EditorProps = FullEditorProps | EditorOnlyProps | InlineEditorProps;

const Editor: React.FC<EditorProps> = (props) => {
  const {
    data,
    onChange,
    blockTypes = [],
    cardinality = -1,
    title,
    addBlockDisplayFormat = "select",
    storage,
  } = props;
  const mainRef = useRef<HTMLDivElement | null>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement | null>(null);

  const mergedSidebarProps = {
    title: title || "Blocks",
    cardinality,
    addBlockDisplayFormat,
    onChange,
  };

  if (props.format === "inline") {
    return null;
  }

  if (props.format === "sidebar") {
    const { onBack } = props;
    return (
      <Provider
        blockTypes={blockTypes}
        isFullScreen={false}
        data={props.data}
        storage={storage}
        isNested
      >
        <Sidebar onBack={onBack} {...mergedSidebarProps} />
      </Provider>
      // eslint-disable-next-line react/jsx-props-no-spreading
    );
  }

  const handleDragSidebar: MouseEventHandler<HTMLDivElement> = (e) => {
    const dragBarEl = e.target as HTMLDivElement;
    const stopDrag = () => {
      requestAnimationFrame(() => {
        dragBarEl.style.width = "0px";
        dragBarEl.style.position = "relative";
      });
      dragBarEl.removeEventListener("mouseleave", stopDrag);
      dragBarEl.removeEventListener("mouseup", stopDrag);
      dragBarEl.removeEventListener("mousemove", handleMove);
    };
    let animationId = 0;
    const handleMove = (mouseMoveEvent: MouseEvent) => {
      window.cancelAnimationFrame(animationId);
      animationId = window.requestAnimationFrame(() => {
        let sidebarWidth = window.innerWidth - mouseMoveEvent.clientX;
        const sidebarMaxWidth = Math.floor(window.innerWidth * 0.66);
        if (sidebarWidth < 200) {
          sidebarWidth = 200;
        }
        if (sidebarWidth > sidebarMaxWidth) {
          sidebarWidth = sidebarMaxWidth;
        }
        if (sidebarWrapperRef.current) {
          sidebarWrapperRef.current.style.maxWidth = `${sidebarWidth}px`;
        }
      });
    };
    dragBarEl.style.width = "100vw";
    dragBarEl.style.position = "fixed";
    dragBarEl.addEventListener("mouseleave", stopDrag);
    dragBarEl.addEventListener("mouseup", stopDrag);
    dragBarEl.addEventListener("mousemove", handleMove);
  };

  const {
    editorTheme = defaultTheme,
    onFullScreen,
    onFullScreenExit,
    onPreviewInstanceLoad,
    isFullScreen = false,
    previewSrc,
    allowedOrigins = [],
    onAction,
    previewWidth,
  } = props;

  return (
    <ThemeProvider theme={editorTheme}>
      {editorTheme === defaultTheme && <CssBaseline />}
      <Provider
        allowedOrigins={allowedOrigins}
        blockTypes={blockTypes}
        data={data}
        isFullScreen={isFullScreen}
        previewSrc={previewSrc}
        previewWidth={previewWidth}
        storage={storage}
      >
        <MessageBus onAction={onAction} />
        <Root>
          <div ref={mainRef} className={classes.main}>
            <Header
              isFullScreen={isFullScreen}
              onExitFullScreen={onFullScreenExit}
              onFullScreen={onFullScreen}
            />
            <EditorPreview
              onPreviewInstanceLoad={(instance) => {
                if (onPreviewInstanceLoad) {
                  onPreviewInstanceLoad(instance);
                }
              }}
            />
          </div>
          <div 
            className={classes.dragBar} 
            onMouseDown={handleDragSidebar} 
          />
          <div className={classes.sidebarWrapper} ref={sidebarWrapperRef}>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Sidebar {...mergedSidebarProps} />
          </div>
          <Snackbar />
        </Root>
      </Provider>
    </ThemeProvider>
  );
};

export default Editor;
