/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useState,
  useRef,
  MouseEventHandler,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import clsx from 'clsx';
import {
  Theme, ThemeProvider, styled,
} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import Button from '@mui/material/Button';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletIcon from '@mui/icons-material/Tablet';
import LaptopIcon from '@mui/icons-material/Laptop';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { Block, BlockType } from './types';
import Preview from './Preview';
import Sidebar from './Sidebar';
import defaultTheme from './theme';
import Iframe from './Iframe';
import { EditorContext, EditorContextProvider } from './EditorContextProvider';
import { AddBlockButtonProps } from './AddBlockButton';
import PreviewIframe, { PreviewInstance } from './PreviewIframe';
import { EDITOR_DATA, EDITOR_READY } from './EditorIframe';

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
  header: `${PREFIX}-header`,
  headerInner: `${PREFIX}-headerInner`,
  previewIframe: `${PREFIX}-previewIframe`,
  previewHeight: `${PREFIX}-previewHeight`,
  centerActions: `${PREFIX}-centerActions`,
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

  [`& .${classes.header}`]: {
    display: 'none',
    background: 'white',
    borderBottom: '1px solid #eee',
    width: '100%',
    height: headerHeight,
    position: 'sticky',
    top: 0,
    lineHeight: 1,
    fontSize: theme.typography.fontSize,
    [theme.breakpoints.up('lg')]: {
      display: 'initial',
    },
  },

  [`& .${classes.headerInner}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  [`& .${classes.previewIframe}`]: {
    boxShadow: '0 9px 10px rgba(0,0,0,0.5)',
    display: 'block',
    margin: 'auto',
    border: 'none',
    overflowY: 'auto',
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('lg')]: {
      '&.sm': {
        maxWidth: 375,
        height: 667,
        marginTop: 30,
      },
      '&.md': {
        maxWidth: 1080,
        height: 820,
        marginTop: 30,
      },
    },
  },

  [`& .${classes.previewHeight}`]: {
    height: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('lg')]: {
      height: `calc(100% - ${headerHeight}px)`,
    },
  },

  [`& .${classes.centerActions}`]: {
    marginLeft: 'auto',
    marginRight: 'auto',
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
  container?: HTMLElement,
  context?: Record<string, unknown> & Partial<EditorContext>,
  blockTypes: BlockType[],
  disableEditor?: Readonly<boolean>,
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
  previewSrc?: string,
  allowedOrigins?: string[],
  onAction?(action: { type: string, payload: any }): void,
  onPreviewInstanceLoad?(preview: PreviewInstance): void,
  defaultWidth?: 'sm' | 'md' | 'lg'
}

const headerHeight = 37;

const Editor: React.FC<EditorProps> = (props) => {
  const {
    data: propsData,
    initialData = [],
    onChange,
    onBack,
    blockTypes = [],
    disableEditor = false,
    disablePreview = false,
    editorTheme = defaultTheme,
    previewWrapperComponent,
    onFullScreen,
    onFullScreenExit,
    onPreviewIframeLoad,
    onPreviewInstanceLoad,
    isFullScreen = false,
    context = {},
    cardinality = -1,
    container,
    title,
    addBlockDisplayFormat = 'select',
    previewSrc,
    allowedOrigins,
    onAction,
    defaultWidth = 'lg',
  } = props;
  const isControlled = !!propsData;
  const [data, setData] = useState(initialData);
  const [maxWidth, setMaxWidth] = useState<'sm' | 'md' | 'lg'>(defaultWidth);
  const [preview, setPreview] = useState<PreviewInstance | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const previewIframeRef = useRef<HTMLIFrameElement | null>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const sortedBlockTypes = blockTypes.sort((a, b) => (a.label < b.label ? -1 : 1));
  const editorContext = useMemo<Partial<EditorContext>>(() => {
    return {
      ...context,
      container,
      previewIframeRef,
      mode: disableEditor ? 'view' : 'edit',
    };
  }, [context, container, disableEditor]);

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
      setData(updatedData);
    }
    if (onChange) {
      onChange(updatedData);
    }
  }, [isControlled, onChange]);

  const currentData = isControlled ? propsData as Block[] : data;

  // Setup iframe communication between parent window, editor and preview iframe
  useEffect(() => {
    if (
      !window.parent
      || !allowedOrigins
      || allowedOrigins.length === 0
      || (previewSrc && !preview)
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

  if (disableEditor && disablePreview) {
    return null;
  }

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

  if (disableEditor) {
    return (
      <Preview
        blockTypes={sortedBlockTypes}
        data={currentData}
        WrapperComponent={previewWrapperComponent}
      />
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
        const containerWidth = container ? container.offsetWidth : window.innerWidth;
        let sidebarWidth = containerWidth - mouseMoveEvent.clientX;
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

  return (
    <EditorContextProvider context={editorContext}>
      <ThemeProvider theme={editorTheme}>
        {editorTheme === defaultTheme && <CssBaseline />}
        <Root>
          <div ref={mainRef} className={classes.main}>
            <header className={classes.header}>
              <div className={clsx([classes.headerInner])}>
                <div className={classes.centerActions}>
                  <Button onClick={() => setMaxWidth('sm')}>
                    <PhoneIphoneIcon />
                  </Button>
                  <Button onClick={() => setMaxWidth('md')}>
                    <TabletIcon />
                  </Button>
                  <Button onClick={() => setMaxWidth('lg')}>
                    <LaptopIcon />
                  </Button>
                </div>
                {onFullScreen && (
                  <div>
                    {isFullScreen && (
                      <Button onClick={onFullScreenExit}>
                        <FullscreenExitIcon />
                      </Button>
                    )}
                    {!isFullScreen && (
                      <Button onClick={onFullScreen}>
                        <FullscreenIcon />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </header>
            <div className={clsx([classes.previewHeight])}>
              {!previewSrc && (
                <Iframe
                  title="preview"
                  className={clsx(classes.previewIframe, maxWidth)}
                  ref={(iframeEl) => {
                    if (iframeEl) {
                      previewIframeRef.current = iframeEl;
                      if (onPreviewIframeLoad) {
                        onPreviewIframeLoad(iframeEl);
                      }
                    }
                  }}
                >
                  <Preview
                    blockTypes={sortedBlockTypes}
                    data={currentData}
                    onChange={handleDataChange}
                    WrapperComponent={previewWrapperComponent}
                  />
                </Iframe>
              )}
              {previewSrc && (
                <PreviewIframe
                  src={previewSrc}
                  className={clsx(classes.previewIframe, maxWidth)}
                  onLoad={(previewInstance) => {
                    previewIframeRef.current = previewInstance.element;
                    setPreview(previewInstance);
                    if (onPreviewInstanceLoad) {
                      onPreviewInstanceLoad(previewInstance);
                    }
                  }}
                />
              )}
            </div>
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
    </EditorContextProvider>
  );
};

export default Editor;
