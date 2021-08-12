import React, { useState } from 'react';
import clsx from 'clsx';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import DeleteIcon from '@material-ui/icons/Delete';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
} from '@material-ui/core';
import { FileItem } from './index';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
  },
  content: {
    flex: 1,
    padding: theme.spacing(1),
    minHeight: 106 - theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  col: {
    marginRight: theme.spacing(2),
  },
  cover: {
    width: 106,
  },
  actions: {
    width: '100%',
    borderBottom: '1px solid #eee',
    alignItems: 'center',
    padding: theme.spacing(0.25),
  },
  actionsBtn: {
    minWidth: 0,
    padding: theme.spacing(0.25),
    lineHeight: 0,
  },
  actionsRight: {
    marginLeft: 'auto !important',
  },
  dragAction: {
    cursor: 'grab',
  },
  deleteActions: {
    display: 'flex',
    marginTop: 'auto',
  },
  cancelAction: {
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
  const classes = useStyles();
  const [isDeleting, setDeleting] = useState(false);
  return (
    <Card
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
    </Card>
  );
};

export default FileImage;
