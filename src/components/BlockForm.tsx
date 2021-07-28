import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import EditIcon from '@material-ui/icons/Edit';
import RemoveIcon from '@material-ui/icons/Remove';
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BlockFormProps } from '../types/BlockFormProps';

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    padding: theme.spacing(1.5),
  },
  header: {},
  headerActions: {
    display: 'flex',
  },
  labelDragIcon: {
    marginRight: theme.spacing(0.25),
    marginLeft: theme.spacing(-0.5),
  },
  label: {
    justifyContent: 'flex-start',
    padding: 0,
    maxWidth: 170,
    '& .MuiButton-label': {
      padding: 0,
      display: 'block',
    },
  },
  actions: {
    marginLeft: 'auto',
  },
  iconBtn: {
    minWidth: 0,
  },
  listItemIcon: {
    width: 32,
    minWidth: 32,
  },
  deleteActions: {
    display: 'flex',
  },
  cancelBtn: {
    marginRight: theme.spacing(1),
  },
}));

const BlockForm: React.FunctionComponent<BlockFormProps> = (props) => {
  const {
    container,
    block,
    blockType,
    onChange,
    onDelete,
    onClone,
    initialState = {},
    context,
  } = props;
  const {
    data,
    settings,
    meta,
    id,
    type,
  } = block;

  const [state, setState] = useState({
    showEditForm: false,
    showSettingsForm: false,
    showDeleteForm: false,
    moreAnchorEl: null,
    ...initialState,
  });
  const localClasses = useStyles();

  const toggleShowEditForm = () => {
    setState({
      ...state,
      showEditForm: !state.showEditForm,
      showDeleteForm: false,
      showSettingsForm: false,
    });
  };

  const toggleShowSettingsForm = () => {
    setState({
      ...state,
      showEditForm: false,
      showDeleteForm: false,
      showSettingsForm: !state.showSettingsForm,
    });
  };

  const handleClickMoreBtn = (e: React.MouseEvent<HTMLElement>) => {
    setState({
      ...state,
      showEditForm: false,
      showSettingsForm: false,
      showDeleteForm: false,
      moreAnchorEl: e.currentTarget,
    });
  };

  const handleCloseMoreMenu = () => {
    setState({
      ...state,
      moreAnchorEl: null,
    });
  };

  const handleCloneBlock = (withData = true) => () => {
    handleCloseMoreMenu();
    onClone(withData);
  };

  const handleDeleteBlock = () => {
    setState({
      ...state,
      showEditForm: false,
      showSettingsForm: false,
      showDeleteForm: true,
      moreAnchorEl: null,
    });
  };

  const handleDeleteCancel = () => {
    setState({
      ...state,
      showDeleteForm: false,
    });
  };

  const handleDataChange = (newData: typeof block.data) => {
    onChange({
      ...block,
      data: newData,
    });
  };

  const handleSettingsChange = (newSettings: typeof block.settings) => {
    onChange({
      ...block,
      settings: newSettings,
    });
  };

  return (
    <div key={id} data-id={id} className={clsx(['sortable-item', localClasses.root])}>
      <div className={localClasses.header}>
        <div className={localClasses.headerActions}>
          <DragIndicatorIcon className={clsx(['sortable-handle', localClasses.labelDragIcon])} />
          <Typography className={localClasses.label} variant="button">
            {blockType.blockLabel(data)}
          </Typography>
          <div className={localClasses.actions}>
            {state.showEditForm && (
              <Button onClick={toggleShowEditForm} className={localClasses.iconBtn}>
                <RemoveIcon
                  fontSize="small"
                />
              </Button>
            )}
            {!state.showEditForm && (
              <Button onClick={toggleShowEditForm} className={localClasses.iconBtn}>
                <EditIcon
                  fontSize="small"
                />
              </Button>
            )}
            {state.showSettingsForm
            && (
              <Button onClick={toggleShowSettingsForm} className={localClasses.iconBtn}>
                <RemoveIcon
                  fontSize="small"
                />
              </Button>
            )}
            {!state.showSettingsForm
            && (
              <Button
                onClick={toggleShowSettingsForm}
                className={localClasses.iconBtn}
                disabled={!blockType.hasSettings}
              >
                <SettingsIcon fontSize="small" />
              </Button>
            )}
            <Button
              className={localClasses.iconBtn}
              onClick={handleClickMoreBtn}
            >
              <MoreVertIcon fontSize="small" />
            </Button>
            <Menu
              open={Boolean(state.moreAnchorEl)}
              anchorEl={state.moreAnchorEl}
              // anchorOrigin={{
              //   vertical: 'bottom',
              //   horizontal: 'right',
              // }}
              transformOrigin={{
                vertical: -48,
                horizontal: 'left',
              }}
              onClose={handleCloseMoreMenu}
              container={container?.ownerDocument.body}
            >
              <MenuItem onClick={handleCloneBlock()}>
                <ListItemIcon className={localClasses.listItemIcon}>
                  <FileCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  Clone
                </ListItemText>
              </MenuItem>
              <MenuItem onClick={handleDeleteBlock}>
                <ListItemIcon className={localClasses.listItemIcon}>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>
                  Delete
                </ListItemText>
              </MenuItem>
            </Menu>
          </div>
        </div>
      </div>
      {state.showEditForm && blockType.editForm
      && (
        <div>
          {React.createElement(blockType.editForm, {
            id,
            type,
            data,
            meta,
            settings,
            onChange: handleDataChange,
            onClose: toggleShowEditForm,
            container,
            context,
          })}
        </div>
      )}
      {blockType.hasSettings && blockType.settingsForm && state.showSettingsForm
      && (
        <div>
          {React.createElement(blockType.settingsForm, {
            id,
            type,
            data,
            meta,
            settings,
            onChange: handleSettingsChange,
            context,
          })}
        </div>
      )}
      {state.showDeleteForm
      && (
        <div className={clsx([])}>
          <Box mb={2}>
            Are you sure you want to delete this block?
          </Box>
          <div className={localClasses.deleteActions}>
            <Button
              variant="outlined"
              onClick={handleDeleteCancel}
              className={localClasses.cancelBtn}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={onDelete}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </div>

        </div>
      )}
    </div>
  );
};

export default BlockForm;
