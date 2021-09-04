import React from 'react';
import { styled } from '@mui/material/styles';

const PREFIX = 'Toolbar';

const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled('aside')((
  {
    theme,
  },
) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    borderBottom: '2px solid #eee',
    marginBottom: theme.spacing(1),
  },
}));

type ToolbarProps = {
  children: React.ReactNode,
};

const Toolbar: React.FunctionComponent<ToolbarProps> = (props) => {
  const { children } = props;

  return (
    <Root className={classes.root}>
      {children}
    </Root>
  );
};

export default Toolbar;
