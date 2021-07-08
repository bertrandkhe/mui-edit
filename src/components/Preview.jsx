import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: (props) => props.width || '100%',
  },
}));

const Preview = (props) => {
  const { blockTypes, data, className } = props;
  const localClasses = useStyles();
  return (
    <div className={clsx([localClasses.root, className])}>
      {data.map((block) => {
        const blockType = blockTypes.find((bt) => bt.id === block.type);
        return React.createElement(blockType.view, {
          key: block.id,
          data: block.data,
          meta: block.meta,
          settings: block.settings,
        });
      })}
    </div>
  );
};

export default Preview;
