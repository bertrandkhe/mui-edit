import React, { useEffect, useMemo, useState } from 'react';
import { EDITOR_DATA } from '../EditorIframe';
import { Block } from '../types';

export const PREVIEW_DATA = 'editor/previewData';
export const PREVIEW_READY = 'editor/previewReady';

export type PreviewInstance = {
  element: HTMLIFrameElement | null,
  setData(data: Block[]): void,
  dispatch(action: { type: string, payload: any }): void,
};

type Props = {
  src: string,
  className?: string,
  onLoad?(preview: PreviewInstance): void,
  onChange?(newData: Block[]): void,
};

export const PreviewIframe: React.FC<Props> = (props) => {
  const {
    src,
    onLoad,
    onChange,
    className,
  } = props;
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
      iframeWindow.postMessage({
        ...action,
        type: action.type.startsWith('editor/') ? action.type : `editor/${action.type}`,
      }, previewUrl.origin);
    };
    const setData = (data: Block[]) => {
      dispatch({
        type: PREVIEW_DATA,
        payload: data,
      });
    };
    const listener = (event: MessageEvent<{ type: string, payload: any }>) => {
      if (event.origin === previewUrl.origin) {
        if (event.data && event.data.type) {
          const { type, payload } = event.data;
          if (type === PREVIEW_READY && onLoad) {
            onLoad({
              element: previewIframeEl,
              setData,
              dispatch,
            });
          }
          if (type === EDITOR_DATA && onChange) {
            onChange(payload);
          }
        }
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [previewIframeEl, onLoad, previewUrl, onChange]);

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