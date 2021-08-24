import React, {
  useState, useEffect, useRef, memo,
} from 'react';
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
  const changed = useRef(block.meta.changed);
  const loadTimeoutId = useRef<number>(0);
  const [initialState, setInitialState] = useState(block.initialState);

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

  if (!blockType.getInitialState || initialState) {
    return React.createElement(blockType.view, {
      ...block,
      contentEditable: context.mode === 'edit',
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

export default memo(BlockView, (prevProps, props) => {
  const { block: prevBlock } = prevProps;
  const { block } = props;
  return block.meta.changed === prevBlock.meta.changed;
});
