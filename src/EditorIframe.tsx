import React, {
  useMemo, useState, useEffect, HTMLAttributes,
} from 'react';
import { Block } from './types';

export const EDITOR_READY = 'editor/editorReady';
export const EDITOR_DATA = 'editor/editorData';
export const EDITOR_BLOCK_UPDATE = 'editor/blockUpdate';
export const EDITOR_BLOCK_DELETE = 'editor/blockDelete';
export const EDITOR_BLOCK_ADD = 'editor/blockAdd'

export type EditorInstance = {
  element: HTMLIFrameElement | null,
  setData(data: Block[]): void,
  dispatch(action: { type: string, payload: any }): void,
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
    const dispatch: EditorInstance['dispatch'] = (action) => {
      iframeWindow.postMessage({
        ...action,
        type: action.type.startsWith('editor/') ? action.type : `editor/${action.type}`,
      }, editorUrl.origin);
    };
    const sendData = (data: Block[]) => {
      dispatch({
        type: EDITOR_DATA,
        payload: data,
      });
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
            dispatch,
          });
          break;
        case EDITOR_DATA:
          onChange(payload);
          break;
        default:
          // Ignore unsupported events.
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
