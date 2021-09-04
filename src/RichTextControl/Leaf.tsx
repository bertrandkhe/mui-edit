/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { styled } from '@mui/material/styles';
import { RenderLeafProps } from 'slate-react';
import clsx from 'clsx';

const PREFIX = 'Leaf';

const classes = {
  bold: `${PREFIX}-bold`,
  italic: `${PREFIX}-italic`,
  underlined: `${PREFIX}-underlined`,
};

const Root = styled('span')({
  [`&.${classes.bold}`]: {
    fontWeight: 600,
  },
  [`&.${classes.italic}`]: {
    fontStyle: 'italic',
  },
  [`&.${classes.underlined}`]: {
    textDecoration: 'underline',
  },
});

const Leaf: React.FunctionComponent<RenderLeafProps> = (props) => {
  const {
    leaf, children, attributes,
  } = props;

  const className = clsx({
    [classes.bold]: leaf.bold,
    [classes.italic]: leaf.italic,
    [classes.underlined]: leaf.underlined,
  });
  return <Root className={className} {...attributes}>{children}</Root>;
};

export default Leaf;
