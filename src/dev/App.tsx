import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider, StyledEngineProvider, createTheme,
} from '@mui/material/styles';
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
          context={{
            isEditMode: true,
          }}
          container={container}
          initialData={[]}
          blockTypes={[Section]}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
