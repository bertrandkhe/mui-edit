import React, { useEffect, useState } from 'react';
import EditorContextProvider from './EditorContextProvider';
import Preview, { PreviewProps } from './Preview';

type Props = {
  allowedOrigin: string,
} & Omit<PreviewProps, 'data'>;

const PreviewPage: React.FC<Props> = (props) => {
  const {
    allowedOrigin, blockTypes, WrapperComponent, className,
  } = props;
  const [data, setData] = useState<PreviewProps['data']>([]);

  useEffect(() => {
    // Crash if the origin is not valid.
    const allowedUrl = new URL(allowedOrigin);
    const listener = (event: MessageEvent) => {
      if (event.origin !== allowedUrl.origin) {
        console.warn(
          `Received message from ${event.origin} but only messages from ${allowedUrl.origin} are allowed.`,
        );
        return;
      }
      if (event.data && event.data.type === 'data') {
        setData(event.data.payload);
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [allowedOrigin]);

  useEffect(() => {
    if (window.top) {
      window.top.postMessage({
        type: 'ready',
      }, '*');
    }
  }, []);

  return (
    <EditorContextProvider
      context={{
        mode: 'edit',
      }}
    >
      <Preview
        blockTypes={blockTypes}
        data={data}
        WrapperComponent={WrapperComponent}
        className={className}
      />
    </EditorContextProvider>
  );
};

export default PreviewPage;
