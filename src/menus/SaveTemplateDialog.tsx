import React, { useState } from 'react';
import { Checkbox, Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, FormControlLabel, ModalProps, TextField, Autocomplete } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { ConfigTemplate, useConfigStorageQueryClient, useEditorStore } from '../store';
import { toId } from '../utils/strings';
import { LoadingButton } from '@mui/lab';

const initialFormData = {
  name: '',
  id: '',
};

const initialFormState = {
  id: {
    open: false,
    dirty: false,
  },
};

const SaveTemplateDialog: React.FC<DialogProps> = (props) => {
  const { ...dialogProps } = props;
  const data = useEditorStore((state) => state.data);
  const addAlertMessages = useEditorStore((state) => state.addAlertMessages);
  const [formData, setFormData] = useState(initialFormData);
  const [formState, setFormState] = useState(initialFormState);
  const configClient = useConfigStorageQueryClient();
  const configListQuery = configClient.useListQuery();
  const templateList = (configListQuery.data || []).filter((configId) => configId.startsWith('template.'));
  const closeDialog: ModalProps['onClose'] = (ev, reason) => {
    if (dialogProps.onClose) {
      dialogProps.onClose(ev, reason);
    }
    setTimeout(() => {
      setFormData(initialFormData);
      setFormState(initialFormState);
    }, 200);
  };
  const { mutate: save, isLoading } = configClient.useSaveMutation({
    onSuccess(config: ConfigTemplate) {
      closeDialog({}, 'escapeKeyDown');
      addAlertMessages([{
        severity: 'success',
        message: `Template "${config.data.name}" saved successfully.`,
      }])
    },
  });
  const newConfig: ConfigTemplate = {
    id: `template.${formData.id}`,
    revisionId: 0,
    data: {
      name: formData.name,
      blocks: data,
    },
  }
  const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    save(newConfig);
  }


  return (
    <Dialog
      {...dialogProps}
      onClose={closeDialog}
      PaperProps={{
        sx: {
          maxWidth: 480,
        },
      }}
    >
      <form
        autoComplete='off'
        onSubmit={handleFormSubmit}
      >
        <DialogTitle>
          Save as template
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid xs={12}>
              <TextField
                label="Template name"
                name="name"
                value={formData.name}
                onChange={(ev) => {
                  setFormData({
                    id: formState.id.dirty
                      ? formData.id
                      : toId(ev.currentTarget.value),
                    name: ev.currentTarget.value,
                  })
                }}
                required
                fullWidth
              />
            </Grid>
            <Grid xs={12}>
              <Grid container p={0} alignItems="stretch">
                <Grid flexGrow={1}>
                  <TextField
                    size='small'
                    label="Template id"
                    name="Id"
                    disabled={!formState.id.open}
                    value={formData.id}
                    inputProps={{
                      maxLength: 128,
                    }}
                    InputLabelProps={{
                      shrink: formData.id.length > 0,
                    }}
                    onChange={(ev) => {
                      setFormData({
                        ...formData,
                        id: toId(ev.target.value),
                      });
                      setFormState({
                        ...formState,
                        id: {
                          ...formState.id,
                          dirty: true,
                        },
                      });
                    }}
                    required
                    fullWidth
                  />
                </Grid>
                {!formState.id.open && (
                  <Grid>
                    <Button
                      variant='outlined'
                      onClick={() => {
                        setFormState({
                          ...formState,
                          id: {
                            ...formState.id,
                            open: true,
                          }
                        })
                      }}
                      sx={{
                        height: '100%',
                      }}
                    >
                      Edit
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Grid>
            {templateList.includes(newConfig.id) && (
              <Grid xs={12}>
                <FormControlLabel
                  label={`A template with the id "${formData.id}" already exists. Overwrite existing template.`}
                  control={<Checkbox required />}
                />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            variant="contained"
            type="submit"
            loading={!configListQuery.data || isLoading}
            disabled={!configListQuery.data}
            sx={{
              fontWeight: 500,
            }}
          >
            Save
          </LoadingButton>
          <Button
            variant="outlined"
            disabled={isLoading}
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

export default SaveTemplateDialog;
