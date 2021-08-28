import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { Block, BlockType } from './types';
import BlockView from './BlockView';
import { useEditorContext } from './EditorContextProvider';

export interface PreviewProps {
  blockTypes: BlockType[]
  data: Block[]
  className?: string,
  setData?(data: Block[]): void,
}

const Preview: React.FunctionComponent<PreviewProps> = (props) => {
  const {
    blockTypes,
    data,
    className,
    setData,
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
