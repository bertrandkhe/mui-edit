import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { styled } from '@mui/material/styles';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { yellow } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import { BlockType, Block } from './types';
import BlockForm from './BlockForm';
import AddBlockButton, { AddBlockButtonProps } from './AddBlockButton';
import { createBlock } from './utils/block';
import { useEditorStore } from './store';

const PREFIX = 'Sidebar';

const classes = {
  root: `${PREFIX}-root`,
  headerBtn: `${PREFIX}-headerBtn`,
  title: `${PREFIX}-title`,
  header: `${PREFIX}-header`,
  body: `${PREFIX}-body`,
  footer: `${PREFIX}-footer`,
};

const Root = styled('div')((
  {
    theme,
  },
) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    background: 'white',
    boxShadow: '-1px 0 10px rgba(0,0,0,0.2)',
    transform: 'translateX(100%)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    transitionDuration: '.2s',
    transitionProperty: 'transform',
    overflowX: 'hidden',
    top: 0,
    left: 0,
    zIndex: 10,

    '&.open': {
      transform: 'translateX(0%)',
    },

    '& .sortable-item .sortable-handle': {
      cursor: 'grab',
    },
    '& .sortable-item.sortable-chosen': {
      cursor: 'grabbing',
      background: yellow[100],
    },

    [theme.breakpoints.up('lg')]: {
      minHeight: '100%',
      maxHeight: '100%',
      position: 'absolute',
      borderLeft: `1px solid ${theme.palette.grey[100]}`,
    },
  },

  [`& .${classes.headerBtn}`]: {
    height: '100%',
    borderRadius: 0,
    boxShadow: 'none',
  },

  [`& .${classes.title}`]: {
    padding: theme.spacing(2),
  },

  [`& .${classes.header}`]: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    display: 'flex',
    alignItems: 'center',
    height: 56,
  },

  [`& .${classes.body}`]: {
    [theme.breakpoints.up('lg')]: {
      height: 'calc(100% - 92px)',
      overflowY: 'auto',
    },
  },

  [`& .${classes.footer}`]: {
    marginTop: 'auto',
    display: 'flex',
    borderTop: '1px solid #eee',
    justifyContent: 'center',
  },
}));

export interface SidebarProps {
  title: string,
  open?: boolean,
  onBack?(): void,
  addBlockDisplayFormat: AddBlockButtonProps['displayFormat'],
  onChange?(data: Block[]): void,
}

const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const {
    onBack,
    title = 'Blocks',
    open = true,
    addBlockDisplayFormat,
    onChange,
  } = props;
  const blocksWrapperRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const data = useEditorStore((state) => state.data);
  const setData = useEditorStore((state) => state.setData);
  const cardinality = useEditorStore((state) => state.cardinality);

  const updateData = useCallback((fn: ((prevData: Block[]) => Block[])) => {
    const newData = setData(fn);
    if (onChange) {
      onChange(newData);
    }
  }, [onChange, setData])

  useEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => {
      setMounted(false);
    };
  }, []);

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

  const handleBack = () => {
    setClosing(true);
    setTimeout(() => {
      requestAnimationFrame(() => {
        if (!onBack) {
          return;
        }
        onBack();
      });
    }, 200);
  };

  const handleAddBlock = (blockType: BlockType) => {
    updateData((prevData) => {
      return [
        ...prevData,
        createBlock(blockType),
      ];
    });
  };

  const handleDeleteBlock = (id: string) => () => {
    updateData((prevData) => {
      return prevData.filter((block) => block.id !== id);
    });
  };

  const blockTypes = useEditorStore((state) => state.blockTypes);
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

  return (
    <Root className={clsx(classes.root, { open: !closing && open && mounted })}>
      <div className={classes.header}>
        {onBack && (
          <Button
            onClick={handleBack}
            className={classes.headerBtn}
            variant="contained"
            color="primary"
          >
            Back
          </Button>
        )}
        <Typography className={classes.title}>{title}</Typography>
      </div>
      <div ref={blocksWrapperRef} className={classes.body}>
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
      <footer className={classes.footer}>
        <AddBlockButton
          data={data}
          blockTypes={blockTypes}
          onAddBlock={handleAddBlock}
          disabled={cardinality >= 0 && data.length >= cardinality}
          displayFormat={addBlockDisplayFormat}
        />
      </footer>
    </Root>
  );
};

export default Sidebar;
