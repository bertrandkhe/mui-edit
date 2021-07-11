import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import { PreviewPropsInterface } from '@/types/components/PreviewPropsInterface';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

const Preview: React.FunctionComponent<PreviewPropsInterface> = (props) => {
  const { blockTypes, data, className } = props;
  const localClasses = useStyles();
  return (
    <div className={clsx([localClasses.root, className])}>
      {data.map((block) => {
        const blockType = blockTypes.find((bt) => bt.id === block.type);
        if (!blockType) {
          return null;
        }
        return React.createElement(blockType.view, {
          ...block,
          key: block.id,
        });
      })}
    </div>
  );
};

export default Preview;
