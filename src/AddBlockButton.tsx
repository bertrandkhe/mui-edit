/* eslint-disable */
import React, { useRef, useState } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import Autocomplete from '@mui/material/Autocomplete';
import { Block, BlockType } from './types';
import { useEditorContext } from './EditorContextProvider';
import { DialogContent } from '@mui/material';
import TextField from '@mui/material/TextField';

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
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const autocompleteRef = useRef<HTMLDivElement|null>(null);
  const editorContext = useEditorContext();
  const { container } = editorContext;

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

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        size="large"
        color="primary"
        startIcon={<AddIcon />}
        onClick={openDialog}
        disabled={disabled}
      >
        Add block
      </Button>
      <Dialog
        PaperProps={{
          sx: {
            alignSelf: 'self-start',
            marginTop: 15,
          },
        }}
        open={open}
        container={container}
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
    </>
  );
};

export default AddBlockButton;
