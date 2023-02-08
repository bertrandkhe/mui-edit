import React, { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { styled } from '@mui/material';
import { yellow } from '@mui/material/colors';
import clsx from 'clsx';
import { createBlock } from '../utils/block';
import { BlockType } from '..';
import { Block } from '../types/Block';
import BlockForm from '../BlockForm';
import AddBlockButton, { AddBlockButtonProps } from '../AddBlockButton';

type BlocksControlProps = {
  label?: string,
  data: Block[],
  onChange(newData: Block[]): void,
  blockTypes: BlockType[],
  cardinality?: number,
  classes?: {
    root?: string,
    body?: string,
    footer?: string,
  },
  addBlockLabel?: string,
  addBlockProps?: Partial<AddBlockButtonProps>,
};

const PREFIX = 'BlockControl';
const classes = {
  root: `${PREFIX}-root`,
  label: `${PREFIX}-label`,
  body: `${PREFIX}-body`,
  footer: `${PREFIX}-footer`,
};

const Root = styled('div')(({ theme }) => ({
  border: '1px solid #eee',

  [`.${classes.label}`]: {
    padding: theme.spacing(1),
    borderBottom: '1px solid #eee',
  },

  [`.${classes.footer}`]: {
    justifyContent: 'center',
    display: 'flex',
  },

  '& .sortable-item .sortable-handle': {
    cursor: 'grab',
  },
  '& .sortable-item.sortable-chosen': {
    cursor: 'grabbing',
    background: yellow[100],
  },
}));

const BlocksControl: React.FC<BlocksControlProps> = (props) => {
  const {
    label,
    data,
    classes: propsClasses = {},
    onChange,
    blockTypes,
    cardinality = -1,
    addBlockProps = {},
    addBlockLabel,
  } = props;
  const blocksWrapperRef = useRef<HTMLDivElement>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const updateData = useCallback((cb: ((prevData: Block[]) => Block[])) => {
    const newData = cb(dataRef.current);
    onChange(newData);
  }, [onChange]);

  useEffect(() => {
    if (!blocksWrapperRef.current) {
      return undefined;
    }
    let active = true;
    let timeoutId = -1;
    let sortable: import('sortablejs')|null = null;
    (async () => {
      const Sortable = (await import('sortablejs')).default;
      timeoutId = window.setTimeout(() => {
        if (!blocksWrapperRef.current) {
          return;
        }
        if (!active) {
          return;
        }
        sortable = new Sortable(blocksWrapperRef.current, {
          animation: 150,
          draggable: '.sortable-item',
          handle: '.sortable-handle',
          onUpdate: () => {
            updateData((prevData) => {
              if (!sortable || !active) {
                return prevData;
              }
              const newData = sortable
                .toArray()
                .map((id: string) => (
                  prevData.find(
                    (block): boolean => block.id === id,
                  ))) as Block[];
              return newData;
            });
          },
        });
      }, 200);
    })();

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      if (sortable) {
        sortable.destroy();
      }
    };
  }, [updateData]);

  const handleAddBlock = (blockType: BlockType) => {
    updateData((prevData) => {
      return [
        ...prevData,
        createBlock(blockType),
      ];
    });
  };

  const handleClone = (id: string) => (withData = true) => {
    updateData((prevData) => {
      const block = prevData.find((b) => b.id === id) as Block;
      const blockType = blockTypes.find((bt) => bt.id === block.type);
      if (!blockType) {
        return prevData;
      }
      return [
        ...prevData,
        {
          ...block,
          id: uuidv4(),
          data: withData ? block.data : blockType.defaultData,
          meta: {
            ...block.meta,
            created: Date.now(),
            changed: Date.now(),
          },
        },
      ];
    });
  };

  const handleChange = (id: string) => (newBlockOrFn: Block | ((prevBlock: Block) => Block)) => {
    updateData((prevData) => {
      const prevBlock = prevData.find((b) => b.id === id) as Block;
      const newBlock = typeof newBlockOrFn === 'function' ? newBlockOrFn(prevBlock) : newBlockOrFn;
      return prevData.map((block) => {
        if (block.id !== newBlock.id) {
          return block;
        }
        return newBlock;
      });
    });
  };

  const handleDeleteBlock = (id: string) => () => {
    updateData((prevData) => {
      return prevData.filter((block) => block.id !== id);
    });
  };

  return (
    <Root className={clsx(classes.root, propsClasses.root)}>
      {label && (
        <div className={classes.label}>{label}</div>
      )}
      <div ref={blocksWrapperRef} className={clsx(classes.body, propsClasses.body)}>
        {data.map((block) => {
          const {
            type,
            id,
            meta,
          } = block;
          const blockType = blockTypes.find((bt) => bt.id === type);
          if (!blockType) {
            return null;
          }
          return (
            <BlockForm
              key={block.id}
              blockType={blockType}
              block={block}
              onChange={handleChange(id)}
              onDelete={handleDeleteBlock(id)}
              onClone={handleClone(id)}
              initialState={{
                showEditForm: Date.now() - meta.changed < 2000,
              }}
            />
          );
        })}
      </div>
      <footer className={clsx(classes.footer, propsClasses.footer)}>
        <AddBlockButton
          label={addBlockLabel}
          displayFormat="select"
          {...addBlockProps}
          data={data}
          blockTypes={blockTypes}
          onAddBlock={handleAddBlock}
          disabled={cardinality >= 0 && data.length >= cardinality}
        />
      </footer>
    </Root>
  );
};

export default BlocksControl;
