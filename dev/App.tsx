import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Editor from 'mui-edit/Editor';
import PreviewPage from 'mui-edit/PreviewPage';
import Section from './Section';

const blockTypes = [Section];

const App = (props: {
  preview?: boolean,
}): React.ReactElement => {
  const { preview } = props;
  if (preview) {
    return (
      <PreviewPage
        allowedOrigins={['http://localhost:9001']}
        blockTypes={blockTypes}
      />
    );
  }
  return (
    <Editor
      context={{
        isEditMode: true,
      }}
      initialData={[]}
      blockTypes={blockTypes}
      previewSrc="http://localhost:9001/preview"
    />
  );
};

export default App;
