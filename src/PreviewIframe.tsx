import React, { useEffect, useMemo, useState } from 'react';
import { Block } from './types';

export const PREVIEW_DATA = 'PREVIEW_DATA';
export const PREVIEW_READY = 'PREVIEW_READY';

export type PreviewInstance = {
  element: HTMLIFrameElement | null,
  setData(data: Block[]): void,
  dispatch(action: { type: string, payload: any }): void,
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
    const dispatch: PreviewInstance['dispatch'] = (action) => {
      iframeWindow.postMessage(action, previewUrl.origin);
    };
    const setData = (data: Block[]) => {
      dispatch({
        type: PREVIEW_DATA,
        payload: data,
      });
    };
    const listener = (event: MessageEvent) => {
      if (event.origin === previewUrl.origin) {
        if (event.data && event.data.type === PREVIEW_READY) {
          onLoad({
            element: previewIframeEl,
            setData,
            dispatch,
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
