import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider, StyledEngineProvider, createTheme,
} from '@mui/material/styles';
import Editor from 'mui-edit/Editor';
import Iframe from 'mui-edit/Iframe';
import Section from './Section';

const theme = createTheme();

const App = (): React.ReactElement => {
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Iframe
          style={{
            width: '80vw',
            height: '80vh',
            border: 'none',
            margin: '10vh auto',
            display: 'block',
          }}
          onBodyMount={(body) => {
            setIframeBody(body);
          }}
        >
          <CssBaseline />
          {iframeBody && (
            <Editor
              context={{
                isEditMode: true,
              }}
              container={iframeBody}
              initialData={[]}
              blockTypes={[Section]}
            />
          )}
        </Iframe>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
