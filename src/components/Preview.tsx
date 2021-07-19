import React from 'react';
import clsx from 'clsx';
import { PreviewProps } from '../types/PreviewProps';

const Preview: React.FunctionComponent<PreviewProps> = (props) => {
  const {
    blockTypes,
    data,
    className,
  } = props;
  return (
    <div className={clsx([className])}>
      {data.map((block) => {
        const blockType = blockTypes.find((bt) => bt.id === block.type);
        if (!blockType || !blockType.view) {
          return null;
        }
        return React.createElement(blockType.view, {
          ...block,
          key: block.id,
        });
      })}
    </div>
  );
};

export default Preview;
