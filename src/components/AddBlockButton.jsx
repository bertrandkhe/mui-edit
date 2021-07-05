import React, { useState } from 'react';
import { Button, Menu, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const AddBlockButton = (props) => {
  const { onAddBlock, blockTypes } = props;
  const [menuState, setMenuState] = useState({
    anchorEl: null,
  });

  const handleCloseMenu = () => {
    setMenuState({ ...menuState, anchorEl: null });
  }

  const handleAddBlock = (blockType) => () => {
    onAddBlock(blockType);
    handleCloseMenu();
  };

  return (
    <>
      <Button
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
        {blockTypes.map((blockType) => {
          return (<MenuItem key={blockType.id} onClick={handleAddBlock(blockType)}>{blockType.label}</MenuItem>)
        })}
      </Menu>
    </>
  );
};

export default AddBlockButton;