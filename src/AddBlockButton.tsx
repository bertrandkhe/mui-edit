import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import { DialogContent } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Block, BlockType } from './types';

export interface AddBlockButtonProps {
  data: Block[],
  blockTypes: BlockType[],
  onAddBlock(blockType: BlockType): void,
  disabled?: boolean,
  displayFormat: 'autocomplete' | 'select'
}

const AddBlockButton: React.FunctionComponent<AddBlockButtonProps> = (props) => {
  const {
    data,
    onAddBlock,
    blockTypes,
    disabled,
    displayFormat,
  } = props;
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const autocompleteRef = useRef<HTMLDivElement|null>(null);

  const closeDialog = () => {
    setOpen(false);
  };

  const openDialog = () => {
    setOpen(true);
    if (buttonRef.current) {
      buttonRef.current.blur();
    }
    setTimeout(() => {
      if (!autocompleteRef.current) {
        return;
      }
      const input = autocompleteRef.current.querySelector('input');
      if (input) {
        input.focus();
      }
    }, 100);
  };

  const openMenu = () => {
    setOpen(true);
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
        ref={buttonRef}
        type="button"
        size="large"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => {
          if (displayFormat === 'autocomplete') {
            openDialog();
            return;
          }
          openMenu();
        }}
        disabled={disabled}
      >
        Add block
      </Button>
      {displayFormat === 'autocomplete' && (
        <Dialog
          PaperProps={{
            sx: {
              alignSelf: 'self-start',
              marginTop: 15,
            },
          }}
          open={open}
          onClose={closeDialog}
        >
          <DialogContent
            sx={{
              p: 2,
            }}
          >
            <Autocomplete
              ref={autocompleteRef}
              autoHighlight
              openOnFocus
              onChange={(e, blockType) => {
                if (!blockType) {
                  return;
                }
                closeDialog();
                onAddBlock(blockType);
              }}
              getOptionDisabled={(blockType) => {
                const { cardinality = -1 } = blockType;
                const limitReached = cardinality > 0
                  ? count[blockType.id] >= cardinality
                  : false;
                return blockType.disabled || limitReached;
              }}
              renderInput={(params) => (
                <TextField
                  sx={{
                    width: 400,
                  }}
                  focused
                  placeholder="Type to search"
                  label="Add block"
                  {...params}
                />
              )}
              options={blockTypes}
            />
          </DialogContent>
        </Dialog>
      )}
      {displayFormat === 'select' && (
        <Menu
          open={open}
          anchorEl={buttonRef.current}
          onClose={() => {
            closeDialog();
          }}
        >
          {blockTypes.map((blockType) => {
            return (
              <MenuItem
                onClick={() => {
                  closeDialog();
                  onAddBlock(blockType);
                }}
                key={blockType.id}
              >
                {blockType.label}
              </MenuItem>
            );
          })}
        </Menu>
      )}
    </>
  );
};

export default AddBlockButton;
