import {
  AlertProps,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  ModalProps,
} from '@mui/material';
import React, { useMemo } from 'react';
import { grey } from '@mui/material/colors';
import { useEditorStore } from '../store';

const allMessages = {
  copySuccess: {
    id: 'copySuccess',
    message: 'Data copied to your clipboard.',
    severity: 'info' as AlertProps['severity'],
  },
};

const ExportDataDialog: React.FC<DialogProps> = (props) => {
  const { ...dialogProps } = props;
  const data = useEditorStore((state) => state.data);
  const addAlertMessages = useEditorStore((state) => state.addAlertMessages);
  const json = useMemo(() => {
    return JSON.stringify(data);
  }, [data]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(json);
    addAlertMessages([{
      ...allMessages.copySuccess,
    }]);
  };

  const closeDialog: ModalProps['onClose'] = (ev, reason) => {
    if (dialogProps.onClose) {
      dialogProps.onClose(ev, reason);
    }
  };

  return (
    <Dialog
      {...dialogProps}
      onClose={closeDialog}
    >
      <DialogTitle>
        Export data
      </DialogTitle>
      <DialogContent>
        <Box
          onChange={(ev) => ev.preventDefault()}
          onClick={(ev) => {
            const element = ev.currentTarget;
            window.requestAnimationFrame(() => {
              element.select();
              copyToClipboard();
            });
          }}
          rows={10}
          component="textarea"
          sx={{
            background: grey[100],
            padding: 1,
            width: 540,
            maxWidth: '100%',
            fontSize: (theme) => theme.typography.fontSize * 0.85,
          }}
          contentEditable={false}
          value={json}
        />
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            fontWeight: 500,
          }}
          onClick={copyToClipboard}
        >
          Copy to clipboard
        </Button>
        <Button
          sx={{
            fontWeight: 500,
          }}
          onClick={(ev) => {
            closeDialog(ev, 'backdropClick');
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDataDialog;
