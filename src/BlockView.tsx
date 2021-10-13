import React, { memo } from 'react';
import type { Block, BlockType } from './types';
import { EditorContext } from './EditorContextProvider';

type BlockViewProps = {
  block: Block,
  blockTypes: BlockType[],
  onChange?(block: Block): void,
  context: EditorContext,
};

const BlockView: React.FunctionComponent<BlockViewProps> = (props) => {
  const {
    block,
    blockTypes,
    onChange,
    context,
  } = props;
  const blockType = blockTypes.find((bt) => bt.id === block.type);

  if (!blockType || !blockType.view) {
    return null;
  }

  const handleDataChange = (newData: typeof block.data) => {
    if (onChange) {
      onChange({
        ...block,
        data: newData,
        meta: {
          ...block.meta,
          changed: Date.now(),
        },
      });
    }
  };

  const handleSettingsChange = (newSettings: typeof block.settings) => {
    if (onChange) {
      onChange({
        ...block,
        settings: newSettings,
        meta: {
          ...block.meta,
          changed: Date.now(),
        },
      });
    }
  };

  return React.createElement(blockType.view, {
    ...block,
    contentEditable: context.mode === 'edit',
    onDataChange: handleDataChange,
    onSettingsChange: handleSettingsChange,
    key: block.id,
  });
};

export default memo(BlockView, (prevProps, props) => {
  const { block: prevBlock } = prevProps;
  const { block } = props;
  return block.meta.changed === prevBlock.meta.changed;
});
