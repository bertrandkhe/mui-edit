import React from 'react';
import clsx from 'clsx';
import { Block, BlockType } from '../types';

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

  const handleChange = (id: string) => (newBlock: Block) => {
    if (setData) {
      setData(data.map((block) => {
        if (block.id !== id) {
          return block;
        }
        return {
          ...newBlock,
          meta: {
            ...newBlock.meta,
            changed: Date.now(),
          },
        };
      }));
    }
  };

  return (
    <div className={clsx([className])}>
      {data.map((block) => {
        const blockType = blockTypes.find((bt) => bt.id === block.type);
        if (!blockType || !blockType.view) {
          return null;
        }
        return React.createElement(blockType.view, {
          ...block,
          onChange: handleChange(block.id),
          key: block.id,
        });
      })}
    </div>
  );
};

export default Preview;
