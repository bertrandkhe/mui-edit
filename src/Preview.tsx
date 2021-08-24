import React from 'react';
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

  const context = useEditorContext();

  const handleChange = (id: string) => (newBlock: Block) => {
    if (setData) {
      setData(data.map((block) => {
        if (block.id !== id) {
          return block;
        }
        return newBlock;
      }));
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
