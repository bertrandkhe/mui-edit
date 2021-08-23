import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

type ToolbarProps = {
  children: React.ReactNode,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    borderBottom: '2px solid #eee',
    marginBottom: theme.spacing(1),
  },
}));

const Toolbar: React.FunctionComponent<ToolbarProps> = (props) => {
  const { children } = props;
  const classes = useStyles();
  return (
    <aside className={classes.root}>
      {children}
    </aside>
  );
};

export default Toolbar;
