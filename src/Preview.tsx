import React, {
  HTMLAttributes,
  useEffect, useRef,
} from 'react';
import clsx from 'clsx';
import type { Block, BlockType } from './types';
import BlockView from './BlockView';
import { useEditorContext } from './EditorContextProvider';

export type PreviewProps<Wrapper extends React.ElementType> = {
  blockTypes: BlockType[]
  data: Block[]
  className?: string,
  setData?(data: Block[]): void,
  WrapperComponent?: Wrapper,
  wrapperProps?: Wrapper extends React.ElementType<infer WrapperProps> ? WrapperProps : (
    Wrapper extends Element ? HTMLAttributes<Wrapper> : undefined
  ),
}

const Preview = <Wrapper extends React.ElementType>(props: PreviewProps<Wrapper>) => {
  const {
    blockTypes,
    data,
    className,
    setData,
    WrapperComponent = 'div',
    wrapperProps = {},
  } = props;
  const dataRef = useRef<Block[]>(data);
  const context = useEditorContext();

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const handleChange = (id: string) => (newBlock: Block) => {
    if (setData) {
      const newData = dataRef.current.map((block) => {
        if (block.id !== id) {
          return block;
        }
        return newBlock;
      });
      setData(newData);
    }
  };

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
