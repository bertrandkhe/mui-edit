import { Box, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, ModalProps } from '@mui/material';
import { useEditorStore } from 'mui-edit/store';
import React, { useRef, useState } from 'react';

const ImportDataDialog: React.FC<DialogProps> = (props) => {
  const { ...dialogProps } = props;
  const editorImportData = useEditorStore((state) => state.importData);
  const addAlertMessages = useEditorStore((state) => state.addAlertMessages);
  const closeDialog: ModalProps['onClose'] = (ev, reason) => {
    if (dialogProps.onClose) {
      dialogProps.onClose(ev, reason);
    }
  }
  const importData = async (data: string) => {
    const result = await editorImportData(data);
    if (result.success) {
      closeDialog({}, 'escapeKeyDown');
      addAlertMessages([{
        severity: 'success',
        message: 'Data imported successfully',
      }])
      return;
    }
    const errMessages: string[] = [];
    result.errors.forEach((err) => {
      err.issues.forEach((issue) => {
        errMessages.push(`Code: ${issue.code}. ${issue.message}`);
      });
    });
    addAlertMessages([{
      severity: 'error',
      message: errMessages,
      autoHideDuration: 10000,
    }]);
  };
  return (
    <Dialog
      {...dialogProps}
    >
      <DialogTitle>
        Import data
      </DialogTitle>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          const form = ev.currentTarget;
          const textarea = form.elements.item(0) as HTMLTextAreaElement;
          importData(textarea.value);
        }}
      >
        <DialogContent
          sx={{
            pt: 0,
          }}
        >
          <Box
            name='data'
            rows={10}
            component="textarea"
            sx={{
              padding: 1,
              minWidth: 320,
              minHeight: 200,
              width: 540,
              maxWidth: '100%',
              fontSize: (theme) => theme.typography.fontSize * 0.85,
            }}
            contentEditable={false}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            sx={{
              fontWeight: 500,
            }}
          >
            Import data
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
      </form>
    </Dialog>
  );
};

export default ImportDataDialog;
