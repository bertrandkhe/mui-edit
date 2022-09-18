import React, { useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Editor from 'mui-edit/Editor';
import Iframe from 'mui-edit/Iframe';
import Section from './Section';

const App = (): React.ReactElement => {
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);
  return (
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
  );
};

export default App;
