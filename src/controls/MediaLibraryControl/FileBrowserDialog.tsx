import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogProps,
  CircularProgress,
  Box, DialogContent,
} from '@mui/material';
import FileBrowser, {
  Object as BrowserObject,
  Permissions,
} from '@bertrandkhe/file-browser';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import { css } from '@emotion/react';
import { grey } from '@mui/material/colors';
import { useObjectStorage } from '../../store';

const PREFIX = 'FileBrowserDialog';

const classes = {
  root: `${PREFIX}-root`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  dialogContent: `${PREFIX}-dialogContent`,
};

const Root = styled(Dialog)(({ theme }) => css`
  & {

  }

  .${classes.dialogTitle} {
    border-bottom: 1px solid ${grey[300]};
  }

  .${classes.dialogContent} {
    padding: 0;
  }

  .FileBrowser-main {
    padding: 0;
    .FileBrowserActions-root,
    .Header-root {
      padding-left: ${theme.spacing(2)};
      padding-right: ${theme.spacing(2)};
    }
  }
`);

export type FileBrowserDialogProps = {
  open: boolean,
  onClose(): void,
  onSelect(files: BrowserObject[]): void,
  permissions: Permissions,
  cardinality: number,
  container?: DialogProps['container'],
  allowedExtensions: string[],
};

const FileBrowserDialog: React.FC<FileBrowserDialogProps> = (props) => {
  const {
    open,
    onClose,
    container,
    onSelect,
    cardinality,
    permissions,
    allowedExtensions,
  } = props;
  const [selectedFiles, setSelectedFiles] = useState([] as BrowserObject[]);
  const [loading, setLoading] = useState(false);
  const storage = useObjectStorage();


  const handleChooseFiles = async (chosenObjects: BrowserObject[]) => {
    onSelect(chosenObjects.slice(0, cardinality));
    onClose();
  };

  useEffect(() => {
    if (!open) {
      setSelectedFiles([]);
      setLoading(false);
    }
  }, [open]);

  if (!storage) {
    return (
      <Root
        className={classes.root}
        open={open}
        onClose={onClose}
        container={container}
        PaperProps={{
          sx: {
            position: 'relative',
            width: '80vw',
            maxWidth: '90vw',
            height: '80%',
          },
        }}
      >
        <DialogTitle className={classes.dialogTitle}>
          Unable to add or select media. No storage adapter provided.
        </DialogTitle>
      </Root>
    );
  }

  return (
    <Root
      className={classes.root}
      open={open}
      onClose={onClose}
      container={container}
      PaperProps={{
        sx: {
          position: 'relative',
          width: '80vw',
          maxWidth: '90vw',
          height: '80%',
        },
      }}
    >
      <DialogTitle className={classes.dialogTitle}>
        Add or select media
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {open && selectedFiles.length === 0 && (
          <FileBrowser
            portalContainer={container}
            onClose={onClose}
            allowedExtensions={allowedExtensions}
            onChooseFiles={handleChooseFiles}
            adapter={storage}
            viewMode='grid'
            permissions={permissions}
          />
        )}
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255 255 255 / 0.5)',
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </DialogContent>
    </Root>
  );
};

export default FileBrowserDialog;
