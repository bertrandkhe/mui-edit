import React, { useEffect, useState } from 'react';
import EditorContextProvider, { EditorContext } from './EditorContextProvider';
import Preview, { PreviewProps } from './Preview';

type Props<Wrapper extends React.ElementType> = {
  allowedOrigins: string[],
  onContextData?(data: Partial<EditorContext>): void,
} & Omit<PreviewProps<Wrapper>, 'data'>;

export const PREVIEW_READY = 'PREVIEW_READY';
export const PREVIEW_DATA = 'PREVIEW_DATA';
export const PREVIEW_CONTEXT = 'PREVIEW_CONTEXT';

const PreviewPage = <Wrapper extends React.ElementType>(props: Props<Wrapper>) => {
  const {
    allowedOrigins,
    blockTypes,
    WrapperComponent,
    className,
    onContextData,
  } = props;
  const [data, setData] = useState<PreviewProps<Wrapper>['data']>([]);
  const [contextData, setContextData] = useState<Partial<EditorContext>>({
    mode: 'edit',
  });

  useEffect(() => {
    const safeAllowedOrigins = allowedOrigins.map((origin) => (new URL(origin)).origin);
    // Crash if the origin is not valid.
    const listener = (event: MessageEvent) => {
      if (!safeAllowedOrigins.includes(event.origin)) {
        console.warn(
          `Received message from ${event.origin} but only messages from ${safeAllowedOrigins.join(', ')} are allowed.`,
        );
        return;
      }
      if (event.data && event.data.type) {
        const { type } = event.data;
        switch (type) {
          case PREVIEW_DATA:
            setData(event.data.payload);
            break;
          case PREVIEW_CONTEXT: {
            const newContextData = {
              ...event.data.payload,
              mode: 'edit',
            };
            setContextData(newContextData);
            if (onContextData) {
              onContextData(newContextData);
            }
            break;
          }
          default:
            // Ignore unsupportted event
            break;
        }
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [allowedOrigins, onContextData]);

  useEffect(() => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: PREVIEW_READY,
      }, '*');
    }
  }, []);

  return (
    <EditorContextProvider context={contextData}>
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
