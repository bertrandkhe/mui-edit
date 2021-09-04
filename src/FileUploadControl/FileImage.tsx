import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { FileItem } from './index';

const PREFIX = 'FileImage';

const classes = {
  root: `${PREFIX}-root`,
  content: `${PREFIX}-content`,
  col: `${PREFIX}-col`,
  cover: `${PREFIX}-cover`,
  actions: `${PREFIX}-actions`,
  actionsBtn: `${PREFIX}-actionsBtn`,
  actionsRight: `${PREFIX}-actionsRight`,
  dragAction: `${PREFIX}-dragAction`,
  deleteActions: `${PREFIX}-deleteActions`,
  cancelAction: `${PREFIX}-cancelAction`,
};

const StyledCard = styled(Card)((
  {
    theme,
  },
) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },

  [`& .${classes.content}`]: {
    flex: 1,
    padding: theme.spacing(1),
    minHeight: `calc(106px - ${theme.spacing(2)})`,
    display: 'flex',
    flexDirection: 'column',
  },

  [`& .${classes.col}`]: {
    marginRight: theme.spacing(2),
  },

  [`& .${classes.cover}`]: {
    width: 106,
  },

  [`& .${classes.actions}`]: {
    width: '100%',
    borderBottom: '1px solid #eee',
    alignItems: 'center',
    padding: theme.spacing(0.25),
  },

  [`& .${classes.actionsBtn}`]: {
    minWidth: 0,
    padding: theme.spacing(0.25),
    lineHeight: 0,
  },

  [`& .${classes.actionsRight}`]: {
    marginLeft: 'auto !important',
  },

  [`& .${classes.dragAction}`]: {
    cursor: 'grab',
  },

  [`& .${classes.deleteActions}`]: {
    display: 'flex',
    marginTop: 'auto',
  },

  [`& .${classes.cancelAction}`]: {
    marginRight: theme.spacing(1),
  },
}));

const FileImage = (
  props: {
    file: FileItem,
    onChange(file: FileItem): void,
    onDelete(): void,
    disableHandle: boolean
  },
): React.ReactElement => {
  const {
    file, onChange, onDelete, disableHandle,
  } = props;

  const [isDeleting, setDeleting] = useState(false);
  return (
    <StyledCard
      className={clsx(['file file-image'])}
      classes={{
        root: classes.root,
      }}
      key={file.id}
      data-id={file.id}
    >
      <CardActions className={classes.actions}>
        {!disableHandle && (
          <div className={clsx([classes.actionsBtn, classes.dragAction])}>
            <DragIndicatorIcon />
          </div>
        )}
        <div className={classes.actionsRight}>
          <Button
            className={classes.actionsBtn}
            variant="text"
            onClick={() => {
              setDeleting(true);
            }}
            disabled={isDeleting}
          >
            <DeleteIcon />
          </Button>
        </div>
      </CardActions>
      <div className={classes.root}>
        {!isDeleting && (
          <CardContent className={classes.content}>
            <TextField
              label="Title"
              size="small"
              defaultValue={file.title}
            />
            <TextField
              label="Alternative text"
              size="small"
              defaultValue={file.alt}
            />
          </CardContent>
        )}
        {isDeleting && (
          <CardContent className={classes.content}>
            <div>Are you sure you want to delete this file?</div>
            <div className={classes.deleteActions}>
              <Button
                onClick={() => {
                  setDeleting(false);
                }}
                variant="outlined"
                className={classes.cancelAction}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onDelete();
                }}
                variant="contained"
              >
                Delete
              </Button>
            </div>
          </CardContent>
        )}
        <CardMedia
          className={classes.cover}
          image={file.url}
          title={file.title}
        />
      </div>
    </StyledCard>
  );
};

export default FileImage;
