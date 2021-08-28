import React, { MutableRefObject, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { Theme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache, { EmotionCache } from '@emotion/cache';

import type { Block, BlockType } from './types';
import BlockView from './BlockView';
import { useEditorContext } from './EditorContextProvider';

export interface PreviewProps {
  blockTypes: BlockType[]
  data: Block[]
  className?: string,
  setData?(data: Block[]): void,
  theme?: Theme,
}

const Preview: React.FunctionComponent<PreviewProps> = (props) => {
  const {
    blockTypes,
    data,
    className,
    setData,
    theme,
  } = props;
  const dataRef = useRef<Block[]>(data);
  const context = useEditorContext();
  const emotionCacheRef = useRef<EmotionCache>(createCache({
    key: 'preview',
    prepend: true,
    container: (context.previewIframeRef as MutableRefObject<HTMLIFrameElement|null>)?.current?.contentDocument?.head
      || window.document.head,
  }));

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const handleChange = (id: string) => (newBlock: Block) => {
    if (setData) {
      const newData = dataRef.current.map((block) => {
        if (block.id !== id) {
          return block;
        }
        return newBlock;
      });
      setData(newData);
    }
  };

  if (theme) {
    return (
      <CacheProvider value={emotionCacheRef.current}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className={clsx([className])}>
            {data.map((block) => {
              return (
                <BlockView
                  block={block}
                  blockTypes={blockTypes}
                  onChange={handleChange(block.id)}
                  key={block.id}
                  context={context}
                />
              );
            })}
          </div>
        </ThemeProvider>
      </CacheProvider>
    );
  }

  return (
    <div className={clsx([className])}>
      {data.map((block) => {
        return (
          <BlockView
            block={block}
            blockTypes={blockTypes}
            onChange={handleChange(block.id)}
            key={block.id}
            context={context}
          />
        );
      })}
    </div>
  );
};

export default Preview;
