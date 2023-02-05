import React, {
  HTMLAttributes,
  useEffect,
} from 'react';
import clsx from 'clsx';
import type { Block, BlockType } from '../types';
import BlockView from '../BlockView';
import { PREVIEW_DATA, PREVIEW_READY } from './PreviewIframe';
import { EDITOR_DATA } from 'mui-edit/EditorIframe';
import { usePreviewStore } from 'mui-edit/store';

export type PreviewProps<Wrapper extends React.ElementType, Data> = {
  blockTypes: BlockType[]
  className?: string,
  WrapperComponent?: Wrapper,
  wrapperProps?: Wrapper extends React.ElementType<infer WrapperProps> ? WrapperProps : (
    Wrapper extends Element ? HTMLAttributes<Wrapper> : undefined
  ),
  allowedOrigins?: Data extends Block[] ? never : string[],
  onAction?(action: { type: string, payload: any }): void,
};

const Preview = <Wrapper extends React.ElementType, Data>(props: PreviewProps<Wrapper, Data>) => {
  const {
    blockTypes,
    className,
    WrapperComponent = 'div',
    wrapperProps = {},
    allowedOrigins,
    onAction,
  } = props;
  const setMode = usePreviewStore((state) => state.setMode);
  const setData = usePreviewStore((state) => state.setData);
  const getData = usePreviewStore((state) => state.getData);

  useEffect(() => {
    setMode('edit');
  }, []);

  const onBlockChange = (block: Block) => {
    if (window.parent === window) {
      console.log('Do nothing');
      return;
    }
    const data = getData();
    const newData = data.map((b) => {
      if (b.id === block.id) {
        return block;
      }
      return b;
    });
    window.parent.postMessage({
      type: EDITOR_DATA,
      payload: newData,
    }, '*');
  };

  // Listen for messages from parent window
  useEffect(() => {
    // Not in iframe mode, do nothing
    if (!allowedOrigins || window.parent === window) {
      return undefined;
    }
    const safeAllowedOrigins = allowedOrigins.map((origin) => (new URL(origin)).origin);
    // Crash if the origin is not valid.
    const listener = (event: MessageEvent<{
      type: string,
      payload: any,
    }>) => {
      if (!safeAllowedOrigins.includes(event.origin)) {
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
          case PREVIEW_DATA:
            setData(event.data.payload);
            break;
          default:
            // Ignore unsupported event
            break;
        }
        if (onAction) {
          onAction({ type, payload });
        }
      }
    };
    window.addEventListener('message', listener);
    return () => {
      window.removeEventListener('message', listener);
    };
  }, [allowedOrigins, setData, onAction]);

  // Tell parent window preview is ready to receive data.
  useEffect(() => {
    // Not in iframe mode, do nothing
    if (!allowedOrigins || window.parent === window) {
      return;
    }
    window.parent.postMessage({
      type: PREVIEW_READY,
    }, '*');
  }, [allowedOrigins]);

  const data = usePreviewStore((state) => state.data);
  return (
    <WrapperComponent className={clsx([className])} {...wrapperProps}>
      {data.map((block) => {
        return (
          <BlockView
            block={block}
            blockTypes={blockTypes}
            key={block.id}
            onChange={onBlockChange}
          />
        );
      })}
    </WrapperComponent>
  );
};

export default Preview;
