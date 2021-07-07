import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: (props) => props.width || '100%',
  },
}));

const Preview = (props) => {
  const { blockTypes, data } = props;
  const localClasses = useStyles();
  return (
    <div className={localClasses.root}>
      {data.map((block) => {
        const blockType = blockTypes.find((blockType) => blockType.id === block.type);
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