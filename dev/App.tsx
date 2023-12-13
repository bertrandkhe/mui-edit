import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Editor from 'mui-edit/Editor';
import Preview from 'mui-edit/Preview';
import { StorageProvider } from './Storage';
import Section from './Section';
import { ObjectStorageAdapter } from 'mui-edit/types/ObjectStorageAdapter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const blockTypes = [Section];

const queryClient = new QueryClient();

const App = (props: {
  preview?: boolean,
  storage: ObjectStorageAdapter,
}): React.ReactElement => {
  const { preview, storage } = props;
  if (preview) {
    return (
      <StorageProvider storage={storage}>
        <QueryClientProvider client={queryClient}>
          <Preview
            allowedOrigins={['http://localhost:9001']}
            blockTypes={blockTypes}
            onAction={(action, methods) => {
              methods.setViewContext({
                asd: 'asd'
              }); 
            }}
          />
        </QueryClientProvider>
      </StorageProvider>
    );
  }
  return (
    <Editor
      format='full'
      previewWidth="sm"
      blockTypes={blockTypes}
      previewSrc="http://localhost:9001/preview"
      storage={{
        object: storage,
      }}
    />
  );
};

export default App;
