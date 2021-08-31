import React, {
  useEffect, useRef,
} from 'react';
import clsx from 'clsx';
import { Theme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import type { Block, BlockType } from './types';
import BlockView from './BlockView';
import { useEditorContext } from './EditorContextProvider';

export interface PreviewProps {
  blockTypes: BlockType[]
  data: Block[]
  className?: string,
  setData?(data: Block[]): void,
  theme?: Theme,
  WrapperComponent?: React.ElementType,
}

const Preview: React.FunctionComponent<PreviewProps> = (props) => {
  const {
    blockTypes,
    data,
    className,
    setData,
    theme,
    WrapperComponent = 'div',
  } = props;
  const dataRef = useRef<Block[]>(data);
  const context = useEditorContext();

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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WrapperComponent className={clsx([className])}>
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
        </WrapperComponent>
      </ThemeProvider>
    );
  }

  return (
    <WrapperComponent className={clsx([className])}>
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
    </WrapperComponent>
  );
};

export default Preview;
