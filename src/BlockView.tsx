import React, { useState, useEffect, useRef } from 'react';
import type { Block, BlockType } from './types';
import { useEditorContext } from './EditorContextProvider';

type BlockViewProps = {
  block: Block,
  blockTypes: BlockType[],
  onChange?(block: Block): void,
};

const BlockView: React.FunctionComponent<BlockViewProps> = (props) => {
  const { block, blockTypes, onChange } = props;
  const blockType = blockTypes.find((bt) => bt.id === block.type);
  const changed = useRef(block.meta.changed);
  const loadTimeoutId = useRef<number>(0);
  const [initialState, setInitialState] = useState(block.initialState);
  const context = useEditorContext();

  useEffect(() => {
    let active = true;
    if (!blockType || !blockType.getInitialState) {
      return undefined;
    }
    if (!initialState || block.meta.changed !== changed.current) {
      changed.current = block.meta.changed;
      clearTimeout(loadTimeoutId.current);
      loadTimeoutId.current = window.setTimeout(async () => {
        if (blockType && blockType.getInitialState) {
          const newState = await blockType.getInitialState(block, context);
          if (!active) {
            return;
          }
          setInitialState(newState);
        }
      }, 400);
    }
    return () => {
      active = false;
    };
  }, [block, blockType, context, initialState]);

  if (!blockType || !blockType.view) {
    return null;
  }

  const handleDataChange = (newData: typeof block.data) => {
    if (onChange) {
      onChange({
        ...block,
        data: newData,
      });
    }
  };

  const handleSettingsChange = (newSettings: typeof block.settings) => {
    if (onChange) {
      onChange({
        ...block,
        settings: newSettings,
      });
    }
  };

  if (!blockType.getInitialState || initialState) {
    return React.createElement(blockType.view, {
      ...block,
      onDataChange: handleDataChange,
      onSettingsChange: handleSettingsChange,
      key: block.id,
      initialState,
    });
  }

  if (blockType.loader) {
    return React.createElement(blockType.loader);
  }

  return (
    <div className="block-view-loader">
      Loading
    </div>
  );
};

export default BlockView;
