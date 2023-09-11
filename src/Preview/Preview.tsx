import React, { HTMLAttributes, useEffect, useState } from "react";
import clsx from "clsx";
import { EDITOR_DATA } from "../EditorIframe";
import { usePreviewStore } from "../store";
import type { Block, BlockType } from "../types";
import BlockView from "../BlockView";
import { PREVIEW_DATA, PREVIEW_READY } from "./PreviewIframe";

export type PreviewProps<Wrapper extends React.ElementType, Data> = {
  blockTypes: BlockType[];
  className?: string;
  WrapperComponent?: Wrapper;
  wrapperProps?: Wrapper extends React.ElementType<infer WrapperProps>
    ? WrapperProps
    : Wrapper extends Element
    ? HTMLAttributes<Wrapper>
    : undefined;
  allowedOrigins?: Data extends Block[] ? never : string[];
  onAction?(
    action: { type: string; payload: any },
    methods: {
      setViewContext(context: React.SetStateAction<Record<string, any>>): void;
    }
  ): void;
  context?: Record<string, any>;
};

const Preview = <Wrapper extends React.ElementType, Data>(
  props: PreviewProps<Wrapper, Data>
) => {
  const {
    blockTypes,
    className,
    WrapperComponent = "div",
    wrapperProps = {},
    allowedOrigins,
    onAction,
    context = {},
  } = props;
  const setMode = usePreviewStore((state) => state.setMode);
  const setData = usePreviewStore((state) => state.setData);
  const getData = usePreviewStore((state) => state.getData);
  const [viewContext, setViewContext] = useState(context);

  useEffect(() => {
    setMode("edit");
  }, [setMode]);

  const onBlockChange = (block: Block) => {
    if (window.parent === window) {
      return;
    }
    const data = getData();
    const newData = data.map((b) => {
      if (b.id === block.id) {
        return block;
      }
      return b;
    });
    window.parent.postMessage(
      {
        type: EDITOR_DATA,
        payload: newData,
      },
      "*"
    );
  };

  // Listen for messages from parent window
  useEffect(() => {
    // Not in iframe mode, do nothing
    if (!allowedOrigins || window.parent === window) {
      return undefined;
    }
    const safeAllowedOrigins = allowedOrigins.map(
      (origin) => new URL(origin).origin
    );
    // Crash if the origin is not valid.
    const listener = (
      event: MessageEvent<{
        type: string;
        payload: any;
      }>
    ) => {
      if (!safeAllowedOrigins.includes(event.origin)) {
        console.warn(
          `Received message from ${
            event.origin
          } but only messages from ${safeAllowedOrigins.join(
            ", "
          )} are allowed.`
        );
        return;
      }
      if (event.data && event.data.type) {
        const { type, payload } = event.data;
        if (!type.startsWith("editor/")) {
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
          onAction(
            { type, payload },
            {
              setViewContext,
            }
          );
        }
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, [allowedOrigins, setData, onAction]);

  // Tell parent window preview is ready to receive data.
  useEffect(() => {
    // Not in iframe mode, do nothing
    if (!allowedOrigins || window.parent === window) {
      return;
    }
    window.parent.postMessage(
      {
        type: PREVIEW_READY,
      },
      "*"
    );
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
            context={viewContext}
          />
        );
      })}
    </WrapperComponent>
  );
};

export default Preview;
