import { DeleteForever } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import React, { useEffect, useRef, useState } from 'react';
import ExportDataDialog from './ExportDataDialog';
import ImportDataDialog from './ImportDataDialog';
import SaveTemplateDialog from './SaveTemplateDialog';
import { ConfigTemplate, useConfigStorageQueryClient, useEditorStore } from '../store';

const TemplateMenuItem: React.FC<{
  id: string,
  onSelect(config: ConfigTemplate): void,
  onDelete(config: ConfigTemplate): void,
}> = (props) => {
  const { id, onSelect, onDelete } = props;
  const configClient = useConfigStorageQueryClient();
  const configQuery = configClient.useGetQuery(id);
  const config = configQuery.data as ConfigTemplate;
  if (configQuery.isLoading || !config) {
    return (
      <MenuItem
        disabled
      >
        {id}
      </MenuItem>
    );
  }
  return (
    <Grid2
      container
      spacing={1}
    >
      <Grid2 sx={{ minWidth: 150 }} alignItems="center">
        <ButtonBase
          onClick={() => {
            onSelect(config);
          }}
          sx={{
            width: '100%',
            textAlign: 'left',
            px: 1,
            mx: 1,
            flexDirection: 'column',
            alignItems: 'start',
          }}
        >
          <span>
            {config.data.name}
          </span>
          <Typography
            variant="caption"
            sx={{
              lineHeight: 1,
              color: grey[600]
            }}
          >
            { config.id.slice(9) }
          </Typography>
        </ButtonBase>
      </Grid2>
      <Grid2>
        <IconButton
          size="small"
          onClick={() => {
            onDelete(config);
          }}
        >
          <DeleteForever
            width={12}
            height={12}
          />
        </IconButton>
      </Grid2>
    </Grid2>
  );
};

const ImportTemplateMenuItem: React.FC<{
  onClose(): void,
}> = (props) => {
  const { onClose } = props;
  const rootRef = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false);
  const [editorData, setEditorData] = useEditorStore((state) => [state.data, state.setData]);
  const configClient = useConfigStorageQueryClient();
  const configListQuery = configClient.useListQuery({
    enabled: open,
  });
  const configList = configListQuery.data || [];
  const templateList = configList.filter((configId) => configId.startsWith('template.'));
  const [action, setAction] = useState<{
    type: 'select',
    payload: ConfigTemplate,
  } | {
    type: 'delete',
    payload: ConfigTemplate,
  } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const close = () => {
    setDialogOpen(false);
    setAction(null);
    setOpen(false);
  };
  const closeDialog = () => {
    close();
    onClose();
  }
  const deleteMutation = configClient.useDeleteMutation({
    onSuccess() {
      closeDialog();
    }
  });

  useEffect(() => {
    if (action?.type === 'select') {
      if (editorData.length === 0) {
        setEditorData(action.payload.data.blocks);
        close();
        return;
      }
      setDialogOpen(true);
    }
    if (action?.type === 'delete') {
      setDialogOpen(true);
    }
  }, [action]);

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => {
          if (!deleteMutation.isLoading) onClose();
        }}
      >
        {action?.type === 'select' && (
          <>
            <DialogTitle>Import data from template "{action.payload.data.name}"</DialogTitle>
            <DialogContent dividers>
              <p>
                Are you sure you want to import data from template "{action.payload.data.name}"?
              </p>
              <p>
                You will lose your current data.
              </p>
            </DialogContent>
            <DialogActions>
              <Button
                variant='contained'
                sx={{ mr: 0.5 }}
                onClick={() => {
                  setEditorData(action.payload.data.blocks);
                  closeDialog();
                }}
              >
                Confirm
              </Button>
              <Button
                variant='outlined'
                onClick={closeDialog}
              >
                Cancel
              </Button>
            </DialogActions>
          </>
        )}
        {action?.type === 'delete' && (
          <>
            <DialogTitle>Delete template "{action.payload.data.name}"</DialogTitle>
            <DialogContent dividers>
              <p>
                Are you sure you want to delete template "{action.payload.data.name}"?
              </p>
              <p>
                Data will be lost permanently.
              </p>
            </DialogContent>
            <DialogActions>
              <LoadingButton
                loading={deleteMutation.isLoading}
                variant='contained'
                sx={{ mr: 0.5 }}
                onClick={() => {
                  deleteMutation.mutate(action.payload.id);
                }}
              >
                Delete
              </LoadingButton>
              <Button
                variant='outlined'
                onClick={closeDialog}
                disabled={deleteMutation.isLoading}
              >
                Cancel
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <MenuItem
        ref={rootRef}
        onClick={() => {
          setOpen(true);
        }}
      >
        Import from template
      </MenuItem>
      <Menu
        MenuListProps={{
          dense: true,
        }}
        onClose={close}
        open={open}
        anchorEl={rootRef.current}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {templateList.length === 0 && (
          <MenuItem disabled>
            No templates found.
          </MenuItem>
        )}
        {templateList.map((configId) => {
          return (
            <TemplateMenuItem
              onSelect={(config) => {
                setAction({
                  type: 'select',
                  payload: config,
                });
              }}
              onDelete={(config) => {
                setAction({
                  type: 'delete',
                  payload: config,
                });
              }}
              id={configId}
              key={configId}
            />
          );
        })}
      </Menu>
    </>
  );
}

const FileMenu: React.FC = () => {
  const editorHasData = useEditorStore((state) => state.data.length > 0);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const menuOpen = Boolean(anchorEl);
  const [action, setAction] = useState<
    'export_data'
    | 'import_data'
    | 'save_template'
    | ''
  >('');

  useEffect(() => {
    if (action.length > 0) {
      setAnchorEl(undefined);
    }
  }, [action]);

  const closeDialog = () => setAction('');

  return (
    <div>
      <Button
        onClick={(ev) => {
          setAnchorEl(ev.currentTarget);
        }}
      >
        File
      </Button>
      <Menu
        onClose={() => setAnchorEl(undefined)}
        marginThreshold={0}
        anchorEl={anchorEl}
        open={menuOpen}
        MenuListProps={{
          dense: true,
        }}
      >
        <ImportTemplateMenuItem
          onClose={() => {
            setAnchorEl(undefined);
          }}
        />
        <MenuItem
          disabled={!editorHasData}
          onClick={() => {
            setAction('save_template');
          }}
        >
          Save as template
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAction('import_data');
          }}
        >
          Import data
        </MenuItem>
        <MenuItem
          disabled={!editorHasData}
          onClick={() => {
            setAction('export_data');
          }}
        >
          Export data
        </MenuItem>
      </Menu>
      <ExportDataDialog
        open={action === 'export_data'}
        onClose={closeDialog}
      />
      <ImportDataDialog
        open={action === 'import_data'}
        onClose={closeDialog}
      />
      <SaveTemplateDialog
        open={action === 'save_template'}
        onClose={closeDialog}
      />
    </div>
  );
};

export default FileMenu;
