import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { AddBlockButtonPropsInterface } from '@/types/components/AddBlockButtonPropsInterface';
import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';
import { BlockDataInterface, BlockSettingsInterface } from '@/types/components/BlockInterface';

const AddBlockButton: React.FunctionComponent<AddBlockButtonPropsInterface> = (props) => {
  const { onAddBlock, blockTypes } = props;
  const [menuState, setMenuState] = useState({
    anchorEl: null,
  });

  const handleCloseMenu = () => {
    setMenuState({ ...menuState, anchorEl: null });
  };

  const handleAddBlock = (blockType: BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>) => () => {
    onAddBlock(blockType);
    handleCloseMenu();
  };

  return (
    <>
      <Button
        size="large"
        color="primary"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={(e) => setMenuState({
          ...menuState,
          anchorEl: e.currentTarget,
        })}
      >
        Add
      </Button>
      <Menu
        open={Boolean(menuState.anchorEl)}
        anchorEl={menuState.anchorEl}
        onClose={handleCloseMenu}
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
