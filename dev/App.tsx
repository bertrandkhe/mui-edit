import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Editor from 'mui-edit/Editor';
import Preview from 'mui-edit/Preview';
import Section from './Section';
import { StorageAdapter } from 'mui-edit/types/StorageAdapter';

const blockTypes = [Section];

const App = (props: {
  preview?: boolean,
  storage: StorageAdapter,
}): React.ReactElement => {
  const { preview, storage } = props;
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
      format='full'
      previewWidth="sm"
      blockTypes={blockTypes}
      previewSrc="http://localhost:9001/preview"
      storageAdapter={storage}
    />
  );
};

export default App;
