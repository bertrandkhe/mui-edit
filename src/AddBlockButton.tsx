import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import { Block, BlockType } from './types';
import { useEditorContext } from './EditorContextProvider';

type MenuState = {
  anchorEl: null | HTMLElement
};

export interface AddBlockButtonProps {
  data: Block[],
  blockTypes: BlockType[],
  onAddBlock(blockType: BlockType): void,
  disabled?: boolean,
}

const AddBlockButton: React.FunctionComponent<AddBlockButtonProps> = (props) => {
  const {
    data,
    onAddBlock,
    blockTypes,
    disabled,
  } = props;
  const [menuState, setMenuState] = useState<MenuState>({
    anchorEl: null,
  });
  const editorContext = useEditorContext();
  const { container } = editorContext;

  const handleCloseMenu = () => {
    setMenuState({ ...menuState, anchorEl: null });
  };

  const handleAddBlock = (blockType: BlockType) => () => {
    onAddBlock(blockType);
    handleCloseMenu();
  };

  const count: Record<string, number> = {};

  data.forEach((b) => {
    if (!count[b.type]) {
      count[b.type] = 1;
    } else {
      count[b.type] += 1;
    }
  });

  return (
    <>
      <Button
        size="large"
        color="primary"
        startIcon={<AddIcon />}
        onClick={(e) => setMenuState({
          ...menuState,
          anchorEl: e.currentTarget,
        })}
        disabled={disabled}
      >
        Add block
      </Button>
      <Menu
        open={Boolean(menuState.anchorEl)}
        anchorEl={menuState.anchorEl}
        onClose={handleCloseMenu}
        container={container?.ownerDocument.body}
      >
        {blockTypes.map((blockType) => {
          const { cardinality = -1 } = blockType;
          const limitReached = cardinality > 0
            ? count[blockType.id] >= cardinality
            : false;
          return (
            <MenuItem
              key={blockType.id}
              onClick={handleAddBlock(blockType)}
              disabled={blockType.disabled || limitReached}
            >
              {blockType.label}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default AddBlockButton;