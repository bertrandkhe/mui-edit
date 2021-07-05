import React from 'react';

const Preview = (props) => {
  const { blockTypes, data } = props;
  return (
    <div>
      {data.map((block) => {
        const blockType = blockTypes.find((blockType) => blockType.id === block.type);
        return React.createElement(blockType.view, {
          key: block.id,
          data: block.data,
        });
      })}
    </div>
  );
};

export default Preview;