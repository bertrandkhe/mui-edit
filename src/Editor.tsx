/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {
  useState, useRef, MouseEventHandler, useMemo,
} from 'react';
import clsx from 'clsx';
import {
  Theme, ThemeProvider, styled,
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import TabletIcon from '@material-ui/icons/Tablet';
import LaptopIcon from '@material-ui/icons/Laptop';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { Block, BlockType } from './types';
import Preview from './Preview';
import Sidebar from './Sidebar';
import defaultTheme from './theme';
import Iframe from './Iframe';
import { EditorContext, EditorContextProvider } from './EditorContextProvider';

declare module '@material-ui/core/useMediaQuery' {
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
  height: '100%',
  width: '100%',
  position: 'relative',
  display: 'flex',

  [`& .${classes.main}`]: {
    flexGrow: 1,
    zIndex: 0,
  },

  [`& .${classes.header}`]: {
    background: 'white',
    borderBottom: '1px solid #eee',
    width: '100%',
    height: headerHeight,
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
  },

  [`& .${classes.previewHeight}`]: {
    height: `calc(100% - ${headerHeight}px)`,
  },

  [`& .${classes.centerActions}`]: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },

  [`& .${classes.sidebarWrapper}`]: {
    height: '100%',
    maxHeight: '100vh',
    overflowY: 'auto',
    overflowX: 'visible',
    maxWidth: 365,
    width: 365,
    top: 0,
    zIndex: 2,
    position: 'relative',
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
  context?: Record<string, unknown>,
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
  previewTheme?: Theme,
  title?: string,
  cardinality?: number,
}

const headerHeight = 37;

const Editor = (props: EditorProps): React.ReactElement | null => {
  const {
    data: propsData,
    initialData = [],
    onChange,
    onBack,
    blockTypes = [],
    disableEditor = false,
    disablePreview = false,
    editorTheme = defaultTheme,
    previewTheme = defaultTheme,
    onFullScreen,
    onFullScreenExit,
    onPreviewIframeLoad,
    isFullScreen = false,
    context = {},
    cardinality = -1,
    container,
    title,
  } = props;
  const isControlled = !!propsData;
  const [data, setData] = useState(initialData);
  const [maxWidth, setMaxWidth] = useState<'sm' | 'md' | false>(false);
  const previewIframeRef = useRef<HTMLIFrameElement|null>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement|null>(null);

  const sortedBlockTypes = blockTypes.sort((a, b) => (a.label < b.label ? -1 : 1));
  const editorContext = useMemo<Partial<EditorContext>>(() => {
    return {
      ...context,
      container,
      previewIframeRef,
      mode: disableEditor ? 'view' : 'edit',
    };
  }, [context, container, disableEditor]);
  const currentPreviewTheme = useMemo<Theme>(() => {
    return {
      ...previewTheme,
      components: {
        ...previewTheme.components,
        MuiUseMediaQuery: {
          defaultProps: {
            matchMedia: previewIframeRef.current?.contentWindow?.matchMedia,
          },
        },
      },
    };
  }, [previewTheme]);

  function handleDataChange(updatedData: Block[]): void {
    if (!isControlled) {
      setData(updatedData);
    }
    if (onChange) {
      onChange(updatedData);
    }
  }

  if (disableEditor && disablePreview) {
    return null;
  }

  const currentData = isControlled ? propsData as Block[] : data;

  const mergedSidebarProps = {
    data: currentData,
    onBack,
    setData: handleDataChange,
    blockTypes: sortedBlockTypes,
    title: title || 'Blocks',
    open: true,
    cardinality,
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
        setData={handleDataChange}
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

  return (
    <EditorContextProvider context={editorContext}>
      <Root>
        <ThemeProvider theme={editorTheme}>
          <div className={classes.main}>
            <header className={classes.header}>
              <div className={clsx([classes.headerInner])}>
                <div className={classes.centerActions}>
                  <Button onClick={() => setMaxWidth('sm')}>
                    <PhoneIphoneIcon />
                  </Button>
                  <Button onClick={() => setMaxWidth('md')}>
                    <TabletIcon />
                  </Button>
                  <Button onClick={() => setMaxWidth(false)}>
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
              <Iframe
                title="preview"
                className={classes.previewIframe}
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
                  setData={handleDataChange}
                  theme={currentPreviewTheme}
                />
              </Iframe>
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
        </ThemeProvider>
      </Root>
    </EditorContextProvider>
  );
};

export default Editor;
