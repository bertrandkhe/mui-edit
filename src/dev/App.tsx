import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import CssBaseline from '@material-ui/core/CssBaseline';
import Section from './Section';
import Editor from '../Editor';

const App = (props: { container: HTMLElement }): React.ReactElement => {
  const { container } = props;
  return (
    <>
      <CssBaseline />
      <Editor
        container={container}
        initialData={[]}
        blockTypes={[Section]}
      />
    </>
  );
};

export default App;
