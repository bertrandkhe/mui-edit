import React, {
  useState, memo, useRef, useEffect,
} from 'react';
import clsx from 'clsx';
import DragHandle from '@mui/icons-material/DragHandle';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import {
  Block,
  BlockType,
} from './types';

interface BlockFormInitialState {
  showEditForm?: boolean,
  showSettingsForm?: boolean,
  showDeleteForm?: boolean,
  moreAnchorEl?: HTMLElement,
}

export interface BlockFormProps {
  block: Block,
  blockType: BlockType,
  initialState?: BlockFormInitialState,
  onChange(block: Block): void,
  onClone(withData: boolean): void,
  onDelete(): void,
}

const PREFIX = 'BlockForm';
const classes = {
  root: `${PREFIX}-root`,
  headerActions: `${PREFIX}-headerActions`,
  labelDragIcon: `${PREFIX}-labelDragIcon`,
  label: `${PREFIX}-label`,
  form: `${PREFIX}-form`,
  actions: `${PREFIX}-actions`,
  listItemIcon: `${PREFIX}-listItemIcon`,
  deleteActions: `${PREFIX}-deleteActions`,
  cancelBtn: `${PREFIX}-cancelBtn`,
  iconBtn: `${PREFIX}-iconBtn`,
};

const Root = styled('div')((
  {
    theme,
  },
) => ({
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  padding: theme.spacing(1.5),
  [`& .${classes.headerActions}`]: {
    display: 'flex',
  },
  [`& .${classes.form}`]: {
    marginTop: theme.spacing(2),
  },
  [`& .${classes.labelDragIcon}`]: {
    marginRight: theme.spacing(0.25),
    marginLeft: theme.spacing(-0.5),
  },
  [`& .${classes.label}`]: {
    justifyContent: 'flex-start',
    padding: 0,
    maxWidth: 170,
    '& .MuiButton-label': {
      padding: 0,
      display: 'block',
    },
  },
  [`& .${classes.actions}`]: {
    marginLeft: 'auto',
    lineHeight: 1,
    fontSize: theme.typography.fontSize,
  },
  [`& .${classes.iconBtn}`]: {
    minWidth: 0,
  },
  [`& .${classes.listItemIcon}`]: {
    width: 32,
    minWidth: 32,
  },
  [`& .${classes.deleteActions}`]: {
    display: 'flex',
  },
  [`& .${classes.cancelBtn}`]: {
    marginRight: theme.spacing(1),
  },
}));

const BlockForm: React.FunctionComponent<BlockFormProps> = (props) => {
  const {
    block,
    blockType,
    onChange,
    onDelete,
    onClone,
    initialState = {},
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
  const rootRef = useRef<HTMLDivElement|null>(null);

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
      meta: {
        ...block.meta,
        changed: Date.now(),
      },
    });
  };

  const handleSettingsChange = (newSettings: typeof block.settings) => {
    onChange({
      ...block,
      settings: newSettings,
      meta: {
        ...block.meta,
        changed: Date.now(),
      },
    });
  };

  useEffect(() => {
    if (state.showEditForm || state.showSettingsForm) {
      setTimeout(() => {
        if (!rootRef.current) {
          return;
        }
        const firstInput = rootRef.current.querySelector('input, textarea') as HTMLInputElement | null;
        if (!firstInput) {
          return;
        }
        firstInput.focus();
      }, 50);
    }
  }, [state.showEditForm, state.showSettingsForm]);

  return (
    <Root
      ref={rootRef}
      key={id}
      data-id={id}
      className={clsx(['sortable-item'])}
    >
      <div>
        <div className={classes.headerActions}>
          <DragHandle className={clsx(['sortable-handle', classes.labelDragIcon])} />
          <Typography className={classes.label} variant="button">
            {blockType.blockLabel(data)}
          </Typography>
          {!blockType.disabled && (
            <div className={classes.actions}>
              {state.showEditForm && (
                <Button onClick={toggleShowEditForm} className={classes.iconBtn}>
                  <RemoveIcon
                    fontSize="small"
                  />
                </Button>
              )}
              {!state.showEditForm && (
                <Button
                  onClick={toggleShowEditForm}
                  className={classes.iconBtn}
                  disabled={!blockType.editForm}
                >
                  <EditIcon
                    fontSize="small"
                  />
                </Button>
              )}
              {state.showSettingsForm
              && (
                <Button onClick={toggleShowSettingsForm} className={classes.iconBtn}>
                  <RemoveIcon
                    fontSize="small"
                  />
                </Button>
              )}
              {!state.showSettingsForm
              && (
                <Button
                  onClick={toggleShowSettingsForm}
                  className={classes.iconBtn}
                  disabled={!blockType.settingsForm}
                >
                  <SettingsIcon fontSize="small" />
                </Button>
              )}
              <Button
                className={classes.iconBtn}
                onClick={handleClickMoreBtn}
              >
                <MoreVertIcon fontSize="small" />
              </Button>
              <Menu
                open={Boolean(state.moreAnchorEl)}
                anchorEl={state.moreAnchorEl}
                transformOrigin={{
                  vertical: 0,
                  horizontal: 'left',
                }}
                onClose={handleCloseMoreMenu}
              >
                <MenuItem onClick={handleCloneBlock()}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <FileCopyIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    Clone
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteBlock}>
                  <ListItemIcon className={classes.listItemIcon}>
                    <DeleteIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>
                    Delete
                  </ListItemText>
                </MenuItem>
              </Menu>
            </div>
          )}
        </div>
      </div>
      {state.showEditForm && blockType.editForm
      && (
        <div className={classes.form}>
          {React.createElement(blockType.editForm, {
            id,
            type,
            data,
            meta,
            settings,
            onChange: handleDataChange,
            onClose: toggleShowEditForm,
          })}
        </div>
      )}
      {blockType.settingsForm && state.showSettingsForm
      && (
        <div className={classes.form}>
          {React.createElement(blockType.settingsForm, {
            id,
            type,
            data,
            meta,
            settings,
            onChange: handleSettingsChange,
          })}
        </div>
      )}
      {state.showDeleteForm
      && (
        <div className={clsx([classes.form])}>
          <Box mb={2}>
            Are you sure you want to delete this block?
          </Box>
          <div className={classes.deleteActions}>
            <Button
              variant="outlined"
              onClick={handleDeleteCancel}
              className={classes.cancelBtn}
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
    </Root>
  );
};

export default memo(BlockForm, (prevProps, props) => {
  const { block: prevBlock, initialState: prevState } = prevProps;
  const { block, initialState: state } = props;
  if (block.meta.changed !== prevBlock.meta.changed) {
    return false;
  }
  if (prevState?.showEditForm !== state?.showEditForm) {
    return false;
  }
  return true;
});
