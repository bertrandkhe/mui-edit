import React, { useEffect } from 'react';
import { EDITOR_DATA, EDITOR_READY } from './EditorIframe';
import { useEditorStore } from './store';

const MessageBus: React.FC<{
  onAction?(action: { type: string, payload: unknown }): void,
}> = (props) => {
  const { onAction } = props;
  const data = useEditorStore((state) => state.data);
  const setEditorData = useEditorStore((state) => state.setData);
  const allowedOrigins = useEditorStore((state) => state.allowedOrigins);
  const preview = useEditorStore((state) => state.previewInstance);

  // Setup iframe communication between parent window, editor and preview iframe
  useEffect(() => {
    if (
      !window.parent
      || !preview
      || !allowedOrigins
      || allowedOrigins.length === 0
    ) {
      return undefined;
    }
    const safeAllowedOrigins = [
      ...allowedOrigins,
    ].map((origin) => (new URL(origin).origin));
    window.parent.postMessage({
      type: EDITOR_READY,
    }, '*');
    const listener = (event: MessageEvent<{
      type?: string,
      payload?: any,
    }>) => {
      if (!safeAllowedOrigins.includes(origin)) {
        console.warn(
          `Received message from ${event.origin} but only messages from ${safeAllowedOrigins.join(', ')} are allowed.`,
        );
        return;
      }
      if (event.data && event.data.type) {
        const { type, payload } = event.data;
        if (!type.startsWith('editor/')) {
          return;
        }
        switch (type) {
          case EDITOR_DATA:
            setEditorData(payload);
            break;

          default:
            preview.dispatch({ type, payload });
            break;
        }
        if (onAction) {
          onAction({
            type,
            payload,
          });
        }
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [allowedOrigins, preview, onAction, setEditorData]);

  // Forward data change to preview iframe and to top window.
  useEffect(() => {
    if (!preview) {
      return;
    }
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: EDITOR_DATA,
        payload: data,
      }, '*');
    }
    preview.setData(data);
  }, [preview, data]);

  return null;
};

export default MessageBus;
