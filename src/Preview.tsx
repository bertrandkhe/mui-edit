import React, {
  HTMLAttributes,
  useEffect, useRef, useState,
} from 'react';
import clsx from 'clsx';
import type { Block, BlockType } from './types';
import BlockView from './BlockView';
import { useEditorContext } from './EditorContextProvider';
import { PREVIEW_DATA, PREVIEW_READY } from './PreviewIframe';

export type PreviewProps<Wrapper extends React.ElementType, Data> = {
  blockTypes: BlockType[]
  data?: Data extends Block[] ? Data : never,
  className?: string,
  WrapperComponent?: Wrapper,
  wrapperProps?: Wrapper extends React.ElementType<infer WrapperProps> ? WrapperProps : (
    Wrapper extends Element ? HTMLAttributes<Wrapper> : undefined
  ),
  allowedOrigins?: Data extends Block[] ? never : string[],
  onAction?(action: { type: string, payload: any }): void,
  onChange?(data: Block[]): void,
};

const Preview = <Wrapper extends React.ElementType, Data>(props: PreviewProps<Wrapper, Data>) => {
  const {
    blockTypes,
    data: dataProp = [],
    className,
    WrapperComponent = 'div',
    wrapperProps = {},
    allowedOrigins,
    onAction,
    onChange,
  } = props;
  const [data, setData] = useState(dataProp);
  const dataRef = useRef<Block[]>(data);
  dataRef.current = data;
  const context = useEditorContext();

  const handleChange = (id: string) => (newBlock: Block) => {
    if (onChange) {
      const newData = dataRef.current.map((block) => {
        if (block.id !== id) {
          return block;
        }
        return newBlock;
      });
      onChange(newData);
    }
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

  return (
    <WrapperComponent className={clsx([className])} {...wrapperProps}>
      {data.map((block) => {
        return (
          <BlockView
            block={block}
            blockTypes={blockTypes}
            onChange={handleChange(block.id)}
            key={block.id}
            context={context}
          />
        );
      })}
    </WrapperComponent>
  );
};

export default Preview;
