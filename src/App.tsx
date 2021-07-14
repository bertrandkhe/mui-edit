import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from 'react-hot-loader/root';
import { CssBaseline } from '@material-ui/core';
import Editor from './components/Editor';

const App = (props: { container: HTMLElement }): React.ReactElement => {
  const { container } = props;
  return (
    <>
      <CssBaseline />
      <Editor
        sidebarProps={{
          container,
        }}
        initialData={[]}
        blockTypes={[]}
      />
    </>
  );
};

export default hot(App);
