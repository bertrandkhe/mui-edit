import React, {
  useState,
  useRef,
  MouseEventHandler,
  useEffect,
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
import Header from './Header';
import { Provider } from './store';
import EditorPreview from './EditorPreview';
import MessageBus from './MessageBus';
import Snackbar from './Snackbar';
import { StorageAdapter } from './types/StorageAdapter';

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
  overflow: 'none',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.up('lg')]: {
    flexDirection: 'row',
  },

  [`& .${classes.main}`]: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
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

type EditorBaseProps = {
  data?: Block[],
  blockTypes: BlockType[],
  onChange?(data: Block[]): void,
  title?: string,
  cardinality?: number,
  addBlockDisplayFormat?: AddBlockButtonProps['displayFormat'],
  storageAdapter?: StorageAdapter,
}

type FullEditorProps = EditorBaseProps & {
  format: 'full',
  editorTheme?: Theme,
  isFullScreen?: boolean,
  onFullScreen?(): void,
  onFullScreenExit?(): void,
  onPreviewIframeLoad?(iframe: HTMLIFrameElement): void,
  previewWrapperComponent?: React.ElementType,
  previewSrc?: string,
  previewWidth?: 'sm' | 'md' | 'lg'
  onAction?(action: { type: string, payload: any }): void,
  onPreviewInstanceLoad?(preview: PreviewInstance): void,
  allowedOrigins?: string[],
}

type EditorOnlyProps = EditorBaseProps & {
  format: 'sidebar',
  onBack?(): void,
}

type InlineEditorProps = EditorBaseProps & {
  format: 'inline',
};

type EditorProps = FullEditorProps | EditorOnlyProps | InlineEditorProps;

const Editor: React.FC<EditorProps> = (props) => {
  const {
    data,
    onChange,
    blockTypes = [],
    cardinality = -1,
    title,
    addBlockDisplayFormat = 'select',
    storageAdapter,
  } = props;
  const mainRef = useRef<HTMLDivElement | null>(null);
  const sidebarWrapperRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  const mergedSidebarProps = {
    title: title || 'Blocks',
    cardinality,
    addBlockDisplayFormat,
    onChange,
  };

  if (props.format === 'inline') {
    return null;
  }

  if (props.format === 'sidebar') {
    const {
      onBack,
    } = props;
    return (
      <Provider
        blockTypes={blockTypes}
        isFullScreen={false}
        data={props.data}
        storage={storageAdapter}
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
        storage={storageAdapter}
      >
        <MessageBus
          onAction={onAction}
        />
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
          <div className={classes.sidebarWrapper} ref={sidebarWrapperRef}>
            <div
              className={classes.dragBar}
              onMouseDown={handleDragSidebar}
            />
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
