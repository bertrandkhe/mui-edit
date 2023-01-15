import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Editor from 'mui-edit/Editor';
import Preview from 'mui-edit/Preview';
import Section from './Section';

const blockTypes = [Section];

const App = (props: {
  preview?: boolean,
}): React.ReactElement => {
  const { preview } = props;
  if (preview) {
    return (
      <Preview
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
      defaultWidth="sm"
      blockTypes={blockTypes}
      previewSrc="http://localhost:9001/preview"
    />
  );
};

export default App;
