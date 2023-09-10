import React, { memo } from "react";
import type { Block, BlockType } from "./types";

type BlockViewProps = {
  block: Block;
  blockTypes: BlockType[];
  onChange?(block: Block): void;
  context?: Record<string, any>;
};

const BlockView: React.FunctionComponent<BlockViewProps> = (props) => {
  const { block, blockTypes, onChange, context } = props;
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

  const viewNode = React.createElement(blockType.view, {
    ...block,
    onDataChange: handleDataChange,
    onSettingsChange: handleSettingsChange,
    key: block.id,
    context,
  });
  if (blockType.suspense) {
    return (
      <React.Suspense fallback={blockType.suspense.fallback}>
        {viewNode}
      </React.Suspense>
    );
  }
  return viewNode;
};

export default memo(BlockView, (prevProps, props) => {
  const { block: prevBlock } = prevProps;
  const { block } = props;
  return block.meta.changed === prevBlock.meta.changed;
});
