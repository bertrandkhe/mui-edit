/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { RenderLeafProps } from 'slate-react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
  bold: {
    fontWeight: 600,
  },
  italic: {
    fontStyle: 'italic',
  },
  underlined: {
    textDecoration: 'underline',
  },
});

const Leaf: React.FunctionComponent<RenderLeafProps> = (props) => {
  const {
    leaf, children, attributes,
  } = props;
  const classes = useStyles();
  const className = clsx({
    [classes.bold]: leaf.bold,
    [classes.italic]: leaf.italic,
    [classes.underlined]: leaf.underlined,
  });
  return (
    <span className={className} {...attributes}>{children}</span>
  );
};

export default Leaf;
