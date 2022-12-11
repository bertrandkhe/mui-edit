import React, { useEffect, useMemo, useState } from 'react';
import { PREVIEW_CONTEXT, PREVIEW_DATA, PREVIEW_READY } from './PreviewPage';
import { Block } from './types';

export type PreviewInstance = {
  element: HTMLIFrameElement | null,
  setData(data: Block[]): void,
  setContextData(data: Record<string, any>): void,
};

type Props = {
  src: string,
  className?: string,
  onLoad(preview: PreviewInstance): void,
};

const PreviewIframe: React.FC<Props> = (props) => {
  const { src, onLoad, className } = props;
  const previewUrl = useMemo(() => {
    return new URL(src);
  }, [src]);
  const [previewIframeEl, setPreviewIframeEl] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!previewIframeEl) {
      return undefined;
    }
    const iframeWindow = previewIframeEl.contentWindow;
    if (!iframeWindow) {
      return undefined;
    }
    const sendData = (data: Block[]) => {
      iframeWindow.postMessage({
        type: PREVIEW_DATA,
        payload: data,
      }, previewUrl.origin);
    };
    const sendContextData = (data: Record<string, any>) => {
      iframeWindow.postMessage({
        type: PREVIEW_CONTEXT,
        payload: data,
      }, previewUrl.origin);
    };
    const listener = (event: MessageEvent) => {
      if (event.origin === previewUrl.origin) {
        if (event.data && event.data.type === PREVIEW_READY) {
          onLoad({
            element: previewIframeEl,
            setData(data) {
              sendData(data);
            },
            setContextData(data) {
              sendContextData(data);
            },
          });
        }
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [previewIframeEl, onLoad, previewUrl]);

  return (
    <iframe
      className={className}
      ref={(node) => {
        if (!node || !node.contentDocument) {
          return;
        }
        if (node.contentDocument.readyState === 'complete') {
          setPreviewIframeEl(node);
        } else {
          node.addEventListener('load', () => setPreviewIframeEl(node));
        }
      }}
      src={src}
    />
  );
};

export default PreviewIframe;
