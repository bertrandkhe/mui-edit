/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useState,
  useRef,
  MouseEventHandler,
  useEffect,
  useCallback,
} from 'react';
import {
  Theme, ThemeProvider, styled,
} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Block, BlockType } from './types';
import Sidebar from './Sidebar';
import defaultTheme from './theme';
import { AddBlockButtonProps } from './AddBlockButton';
import { PreviewInstance } from './Preview/PreviewIframe';
import { EDITOR_DATA, EDITOR_READY } from './EditorIframe';
import Header from './Header';
import { useEditorStore, usePreviewStore } from './store';
import EditorPreview from './EditorPreview';

declare module '@mui/material/useMediaQuery' {
  interface Options {
    defaultMatches?: boolean;
    noSsr?: boolean;
    ssrMatchMedia?: (query: string) => { matches: boolean };
    matchMedia?: typeof window.matchMedia,
  }
}

const PREFIX = 'Editor';

const classes = {
  root: `${PREFIX}-root`,
  main: `${PREFIX}-main`,
  sidebarWrapper: `${PREFIX}-sidebarWrapper`,
  dragBar: `${PREFIX}-dragBar`,
};

const Root = styled('div')((
  {
    theme,
  },
) => ({
  '*': {
    fontSize: theme.typography.fontSize,
  },

  width: '100%',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },

  [`& .${classes.main}`]: {
    minHeight: 'calc(100vh - 200px)',
    height: '100%',
    overflow: 'auto',
    flexGrow: 1,
    zIndex: 0,
  },

  [`& .${classes.sidebarWrapper}`]: {
    minHeight: '97px',
    height: 'auto',
    width: '100%',
    top: 0,
    zIndex: 2,
    position: 'relative',
    [theme.breakpoints.up('lg')]: {
      maxWidth: 365,
      width: 365,
      height: '100%',
      maxHeight: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    },
  },

  [`& .${classes.dragBar}`]: {
    position: 'absolute',
    width: 10,
    height: '100%',
    top: 0,
    left: 0,
    userSelect: 'none',
    zIndex: 2,
    '&:hover': {
      cursor: 'col-resize',
    },
  },
}));

export interface EditorProps {
  data?: Block[],
  initialData?: Block[],
  blockTypes: BlockType[],
  disablePreview?: Readonly<boolean>,
  onBack?(): void,
  onChange?(data: Block[]): void,
  onFullScreen?(): void,
  onFullScreenExit?(): void,
  onPreviewIframeLoad?(iframe: HTMLIFrameElement): void,
  isFullScreen?: boolean,
  editorTheme?: Theme,
  previewWrapperComponent?: React.ElementType,
  title?: string,
  cardinality?: number,
  addBlockDisplayFormat?: AddBlockButtonProps['displayFormat'],
  previewSrc: string,
  allowedOrigins?: string[],
  onAction?(action: { type: string, payload: any }): void,
  onPreviewInstanceLoad?(preview: PreviewInstance): void,
  defaultWidth?: 'sm' | 'md' | 'lg'
}

const Editor: React.FC<EditorProps> = (props) => {
  const {
    data: propsData,
    initialData = [],
    onChange,
    onBack,
    blockTypes = [],
    disablePreview = false,
    editorTheme = defaultTheme,
    onFullScreen,
    onFullScreenExit,
    onPreviewInstanceLoad,
    isFullScreen = false,
    cardinality = -1,
    title,
    addBlockDisplayFormat = 'select',
    previewSrc,
    allowedOrigins,
    onAction,
    defaultWidth = 'lg',
  } = props;
  const isControlled = !!propsData;
  const initialDataRef = useRef(initialData);
  const [preview, setPreview] = useState<PreviewInstance | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sortedBlockTypes = blockTypes.sort((a, b) => (a.label < b.label ? -1 : 1));

  const setPreviewWidth = usePreviewStore((state) => state.setWidth);
  useEffect(() => {
    setPreviewWidth(defaultWidth);
  }, [defaultWidth, setPreviewWidth]);

  const setEditorState = useEditorStore((state) => state.setState);
  useEffect(() => {
    setEditorState({
      isFullScreen,
      enterFullScreen: onFullScreen,
      exitFullScreen: onFullScreenExit,
    });
  }, [setEditorState, isFullScreen, onFullScreen, onFullScreenExit]);

  const setEditorData = useEditorStore((state) => state.setData);
  useEffect(() => {
    setEditorData(initialDataRef.current);
  }, []);

  const setPreviewSrc = usePreviewStore((state) => state.setIframeSrc);
  useEffect(() => {
    setPreviewSrc(previewSrc);
  }, [previewSrc]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1200px)');
    const onMediaQueryChange = () => {
      setIsMobile(!mediaQuery.matches);
    };
    onMediaQueryChange();
    mediaQuery.addEventListener(
      'change',
      onMediaQueryChange,
    );
    return () => {
      mediaQuery.removeEventListener(
        'change',
        onMediaQueryChange,
      );
    };
  }, []);

  // Handle switch between desktop and mobile editor
  useEffect(() => {
    if (!isMobile || !sidebarWrapperRef.current || !mainRef.current) {
      return undefined;
    }
    const prevWidth = sidebarWrapperRef.current.style.width;
    const prevMaxWidth = sidebarWrapperRef.current.style.maxWidth;
    const prevMinHeight = mainRef.current.style.minHeight;
    sidebarWrapperRef.current.style.width = '100%';
    sidebarWrapperRef.current.style.maxWidth = '100%';
    mainRef.current.style.minHeight = `${window.innerHeight - 150}px`;
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (!sidebarWrapperRef.current || !mainRef.current) {
        return;
      }
      sidebarWrapperRef.current.style.width = prevWidth;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      sidebarWrapperRef.current.style.maxWidth = prevMaxWidth;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      mainRef.current.style.minHeight = prevMinHeight;
    };
  }, [isMobile]);

  const handleDataChange = useCallback((updatedData: Block[]) => {
    if (!isControlled) {
      setEditorData(updatedData);
    }
    if (onChange) {
      onChange(updatedData);
    }
  }, [isControlled, onChange, setEditorData]);

  const editorData = useEditorStore((state) => state.data)
  const currentData = isControlled ? propsData as Block[] : editorData;

  // Setup iframe communication between parent window, editor and preview iframe
  useEffect(() => {
    if (
      !window.parent
      || !allowedOrigins
      || allowedOrigins.length === 0
      || !preview
    ) {
      return undefined;
    }
    const safeAllowedOrigins = allowedOrigins.map((origin) => (new URL(origin).origin));
    window.parent.postMessage({
      type: EDITOR_READY,
    }, '*');
    const listener = (event: MessageEvent<{
      type?: string,
      payload?: any,
    }>) => {
      if (!safeAllowedOrigins.includes(origin)) {
        console.warn(
          `Received message from ${event.origin} but only messages from ${safeAllowedOrigins.join(', ')} are allowed.`,
        );
        return;
      }
      if (event.data && event.data.type) {
        const { type, payload } = event.data;
        if (!type.startsWith('editor/')) {
          return;
        }
        switch (type) {
          case EDITOR_DATA:
            handleDataChange(payload);
            break;

          default:
            preview?.dispatch({ type, payload });
            break;
        }
        if (onAction) {
          onAction({
            type,
            payload,
          });
        }
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [allowedOrigins, preview, previewSrc, onAction, handleDataChange]);

  // Forward data change to preview iframe and to top window.
  useEffect(() => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: EDITOR_DATA,
        payload: currentData,
      }, '*');
    }
    if (preview) {
      preview.setData(currentData);
    }
  }, [preview, currentData]);

  const mergedSidebarProps = {
    data: currentData,
    onBack,
    setData: handleDataChange,
    blockTypes: sortedBlockTypes,
    title: title || 'Blocks',
    open: true,
    cardinality,
    addBlockDisplayFormat,
  };

  if (disablePreview) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Sidebar {...mergedSidebarProps} />
    );
  }

  const handleDragSidebar: MouseEventHandler<HTMLDivElement> = (e) => {
    const dragBarEl = e.target as HTMLDivElement;
    const stopDrag = () => {
      requestAnimationFrame(() => {
        dragBarEl.style.width = '10px';
        dragBarEl.style.position = 'absolute';
      });
      dragBarEl.removeEventListener('mouseleave', stopDrag);
      dragBarEl.removeEventListener('mouseup', stopDrag);
      dragBarEl.removeEventListener('mousemove', handleMove);
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
          sidebarWrapperRef.current.style.width = `${sidebarWidth}px`;
          sidebarWrapperRef.current.style.maxWidth = `${sidebarWidth}px`;
        }
      });
    };
    dragBarEl.style.width = '100vw';
    dragBarEl.style.position = 'fixed';
    dragBarEl.addEventListener('mouseleave', stopDrag);
    dragBarEl.addEventListener('mouseup', stopDrag);
    dragBarEl.addEventListener('mousemove', handleMove);
  };

  console.log('render');

  return (
    <ThemeProvider theme={editorTheme}>
      {editorTheme === defaultTheme && <CssBaseline />}
      <Root>
        <div ref={mainRef} className={classes.main}>
          <Header
            isFullScreen={isFullScreen}
            onExitFullScreen={onFullScreenExit}
            onFullScreen={onFullScreen}
          />
          <EditorPreview
            onPreviewInstanceLoad={(instance) => {
              setPreview(instance);
              if (onPreviewInstanceLoad) {
                onPreviewInstanceLoad(instance);
              }
            }}
          />
        </div>
        <div className={classes.sidebarWrapper} ref={sidebarWrapperRef}>
          <div
            className={classes.dragBar}
            onMouseDown={handleDragSidebar}
          />
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Sidebar {...mergedSidebarProps} />
        </div>
      </Root>
    </ThemeProvider>
  );
};

export default Editor;
