import React from 'react';
import clsx from 'clsx';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    padding: theme.spacing(2),
  },
  blockForm: {

  },
  label: {
    marginBottom: theme.spacing(1),
    display: 'flex',
  },
  labelDragIcon: {
    marginRight: theme.spacing(0.25),
    marginLeft: theme.spacing(-0.5),
  },
  labelTitle: {
    whiteSpace: 'nowrap',
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }
}))

const BlockForm = (props) => {
  const { block, blockType, onChange } = props;
  const { data, id } = block;
  const localClasses = useStyles();
  return (
    <div key={id} data-id={id} className={clsx(['sortable-item', localClasses.root])}>
      <div className={localClasses.label}>
        <DragIndicatorIcon className={clsx(['sortable-handle', localClasses.labelDragIcon])} />
        <Typography component="div" className={localClasses.labelTitle} variant="button">
          {blockType.blockLabel(data)}
        </Typography>
      </div>
      <div>
        {React.createElement(blockType.editForm, {
          data,
          onChange,
        })}
      </div>
    </div>
  );
};

export default BlockForm;