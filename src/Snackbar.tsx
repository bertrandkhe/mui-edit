import React from 'react';
import { Alert, Box, Snackbar as MuiSnackbar } from '@mui/material';
import { useEditorStore } from './store';

const Snackbar: React.FC = () => {
  const alertMessages = useEditorStore((state) => state.alertMessages);
  const removeMessage = useEditorStore((state) => state.removeAlertMessage);
  return (
    <>
      {alertMessages.map((m) => {
        return (
          <MuiSnackbar
            key={m.id}
            open={true}
            onClose={() => {
              removeMessage(m.id);
            }}
          >
            <Alert severity={m.severity}>
              {Array.isArray(m.message) && (
                <Box
                  component="ul"
                  sx={{
                    marginTop: 0,
                    marginBottom: 0,
                    padding: 0,
                    listStylePosition: 'inside',
                  }}
                >
                  {m.message.map((line) => <li>{line}</li>)}
                </Box>
              )}
              {typeof m.message === 'string' && m.message}
            </Alert>
          </MuiSnackbar>
        );
      })}
    </>
  );
};

export default Snackbar;
