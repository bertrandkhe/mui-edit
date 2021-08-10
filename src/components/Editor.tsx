import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import { makeStyles, Theme, ThemeProvider } from '@material-ui/core/styles';
import { Button, CssBaseline } from '@material-ui/core';
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import TabletIcon from '@material-ui/icons/Tablet';
import LaptopIcon from '@material-ui/icons/Laptop';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import { Block, BlockType } from '../types';
import Preview from './Preview';
import Sidebar from './Sidebar';
import defaultTheme from '../theme';
import Iframe from './Iframe';
import { EditorContextProvider } from './EditorContextProvider';

export interface EditorProps {
  initialData: Block[],
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
const sidebarWidth = 365;

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
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
  previewWidth: {
    width: `calc(100% - ${sidebarWidth}px)`,
  },
  previewHeight: {
    height: `calc(100% - ${headerHeight}px)`,
  },
  centerActions: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

const Editor = (props: EditorProps): React.ReactElement | null => {
  const {
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
  const [data, setData] = useState(initialData);
  const [maxWidth, setMaxWidth] = useState<'sm' | 'md' | false>(false);
  const previewIframeRef = useRef<HTMLIFrameElement|null>(null);
  const localClasses = useStyles({ maxWidth });
  const sortedBlockTypes = blockTypes.sort((a, b) => (a.label < b.label ? -1 : 1));

  function handleDataChange(updatedData: Block[]): void {
    setData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  }

  if (disableEditor && disablePreview) {
    return null;
  }

  const mergedSidebarProps = {
    data,
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
        data={data}
      />
    );
  }

  return (
    <EditorContextProvider
      context={{
        ...context,
        container,
        previewIframeRef,
      }}
    >
      <div className={clsx([localClasses.root])}>
        <ThemeProvider theme={editorTheme}>
          <header className={localClasses.header}>
            <div className={clsx([localClasses.previewWidth, localClasses.headerInner])}>
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
          <div className={clsx([localClasses.previewWidth, localClasses.previewHeight])}>
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
              <ThemeProvider theme={previewTheme}>
                <CssBaseline />
                <Preview
                  blockTypes={sortedBlockTypes}
                  data={data}
                  setData={handleDataChange}
                />
              </ThemeProvider>
            </Iframe>
          </div>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Sidebar {...mergedSidebarProps} />
        </ThemeProvider>
      </div>
    </EditorContextProvider>
  );
};

export default Editor;
