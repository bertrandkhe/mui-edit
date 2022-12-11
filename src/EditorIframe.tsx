import React, { useMemo, useState, useEffect, HTMLAttributes } from 'react';
import { Block } from './types';

export const EDITOR_READY = 'EDITOR_READY';
export const EDITOR_DATA = 'EDITOR_DATA';
export const EDITOR_CONTEXT_DATA = 'EDITOR_CONTEXT_DATA';

export type EditorInstance = {
  element: HTMLIFrameElement | null,
  setData(data: Block[]): void,
  setContextData(data: Record<string, any>): void,
};

type Props = Omit<HTMLAttributes<HTMLIFrameElement>, 'onLoad' | 'src' | 'className'> & {
  src: string,
  className?: string,
  onLoad(editor: EditorInstance): void,
  onChange(data: Block[]): void,
};

const EditorIframe: React.FC<Props> = (props) => {
  const { 
    src, 
    onLoad, 
    className, 
    onChange,
    ...otherProps
  } = props;
  const editorUrl = useMemo(() => {
    return new URL(src);
  }, [src]);
  const [editorIframeEl, setEditorIframeEl] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (!editorIframeEl) {
      return undefined;
    }
    const iframeWindow = editorIframeEl.contentWindow;
    if (!iframeWindow) {
      return undefined;
    }
    const sendData = (data: Block[]) => {
      iframeWindow.postMessage({
        type: EDITOR_DATA,
        payload: data,
      }, editorUrl.origin);
    };
    const sendContextData = (data: Record<string, any>) => {
      iframeWindow.postMessage({
        type: EDITOR_CONTEXT_DATA,
        payload: data,
      }, editorUrl.origin);
    };

    const listener = (event: MessageEvent<{
      type?: string,
      payload?: any,
    }>) => {
      if (event.origin !== editorUrl.origin) {
        return;
      }
      const { type, payload } = event.data;
      switch (type) {
        case EDITOR_READY:
          onLoad({
            element: editorIframeEl,
            setData(data) {
              sendData(data);
            },
            setContextData(data) {
              sendContextData(data);
            },
          });
          break;
        
        case EDITOR_DATA:
          onChange(payload);
          break;
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [editorIframeEl, onLoad, editorUrl, onChange]);

  return (
    <iframe
      {...otherProps}
      className={className}
      ref={(node) => {
        if (!node || !node.contentDocument) {
          return;
        }
        if (node.contentDocument.readyState === 'complete') {
          setEditorIframeEl(node);
        } else {
          node.addEventListener('load', () => setEditorIframeEl(node));
        }
      }}
      src={src}
    />
  );
};

export default EditorIframe;
