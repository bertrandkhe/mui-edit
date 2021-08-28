import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  ThemeProvider, StyledEngineProvider, createTheme,
} from '@material-ui/core/styles';
import Section from './Section';
import Editor from '../Editor';

const theme = createTheme();

const App = (props: { container: HTMLElement }): React.ReactElement => {
  const { container } = props;
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Editor
          container={container}
          initialData={[]}
          blockTypes={[Section]}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
