/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, MouseEventHandler } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
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
import { EditorContextProvider } from './EditorContextProvider';

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

const maxHeight = (props: { maxWidth: 'sm' | 'md' | false }) => {
  const { maxWidth } = props;
  switch (maxWidth) {
    case 'sm':
      return 790;

    case 'md':
      return 768;

    default:
      return '100%';
  }
};

const headerHeight = 37;

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
    display: 'flex',
  },
  main: {
    flexGrow: 1,
    zIndex: 0,
  },
  header: {
    background: 'white',
    borderBottom: '1px solid #eee',
    width: '100%',
    height: headerHeight,
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewIframe: {
    boxShadow: '0 9px 10px rgba(0,0,0,0.5)',
    display: 'block',
    margin: 'auto',
    border: 'none',
    marginTop: (props: { maxWidth: 'sm' | 'md' | false }) => {
      const { maxWidth } = props;
      switch (maxWidth) {
        case 'sm':
        case 'md':
          return theme.spacing(3);

        default:
          return 0;
      }
    },
    height: maxHeight,
    maxHeight,
    overflowY: 'auto',
    maxWidth: '100%',
    width: (props: { maxWidth: 'sm' | 'md' | false }) => {
      const { maxWidth } = props;
      switch (maxWidth) {
        case 'sm':
          return 480;

        case 'md':
          return theme.breakpoints.values[maxWidth];

        default:
          return '100%';
      }
    },
  },
  previewHeight: {
    height: `calc(100% - ${headerHeight}px)`,
  },
  centerActions: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sidebarWrapper: {
    height: '100%',
    overflowY: 'auto',
    overflowX: 'visible',
    width: 365,
    top: 0,
    zIndex: 2,
    position: 'relative',
  },
  dragBar: {
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
  const localClasses = useStyles({ maxWidth });
  const sortedBlockTypes = blockTypes.sort((a, b) => (a.label < b.label ? -1 : 1));

  function getData(): Block[] {
    if (isControlled) {
      return propsData as Block[];
    }
    return data;
  }

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

  const mergedSidebarProps = {
    data: getData(),
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
        data={getData()}
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
    <EditorContextProvider
      context={{
        ...context,
        container,
        previewIframeRef,
        mode: disableEditor ? 'view' : 'edit',
      }}
    >
      <div className={clsx([localClasses.root])}>
        <ThemeProvider theme={editorTheme}>
          <div className={localClasses.main}>
            <header className={localClasses.header}>
              <div className={clsx([localClasses.headerInner])}>
                <div className={localClasses.centerActions}>
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
            <div className={clsx([localClasses.previewHeight])}>
              <Iframe
                title="preview"
                className={localClasses.previewIframe}
                ref={(iframeEl) => {
                  if (iframeEl) {
                    previewIframeRef.current = iframeEl;
                    if (onPreviewIframeLoad) {
                      onPreviewIframeLoad(iframeEl);
                    }
                  }
                }}
              >
                <ThemeProvider
                  theme={{
                    ...previewTheme,
                    props: {
                      ...previewTheme.props,
                      MuiUseMediaQuery: {
                        matchMedia: previewIframeRef.current?.contentWindow?.matchMedia,
                      },
                    },
                  }}
                >
                  <CssBaseline />
                  <Preview
                    blockTypes={sortedBlockTypes}
                    data={getData()}
                    setData={handleDataChange}
                  />
                </ThemeProvider>
              </Iframe>
            </div>
          </div>
          <div className={localClasses.sidebarWrapper} ref={sidebarWrapperRef}>
            <div
              className={localClasses.dragBar}
              onMouseDown={handleDragSidebar}
            />
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Sidebar {...mergedSidebarProps} />
          </div>
        </ThemeProvider>
      </div>
    </EditorContextProvider>
  );
};

export default Editor;
