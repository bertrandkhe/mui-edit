import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { BlockType } from '../types';
import { useEditorContext } from './EditorContextProvider';

type MenuState = {
  anchorEl: null | HTMLElement
};

export interface AddBlockButtonProps {
  blockTypes: BlockType[],
  onAddBlock(blockType: BlockType): void,
}

const AddBlockButton: React.FunctionComponent<AddBlockButtonProps> = (props) => {
  const { onAddBlock, blockTypes } = props;
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
      >
        Add block
      </Button>
      <Menu
        open={Boolean(menuState.anchorEl)}
        anchorEl={menuState.anchorEl}
        onClose={handleCloseMenu}
        container={container?.ownerDocument.body}
      >
        {blockTypes.map((blockType) => (
          <MenuItem
            key={blockType.id}
            onClick={handleAddBlock(blockType)}
          >
            {blockType.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AddBlockButton;
