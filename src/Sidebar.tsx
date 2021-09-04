import React, {
  useRef,
  useEffect,
  useState,
} from 'react';
import { styled } from '@mui/material/styles';
import Sortable from 'sortablejs';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { yellow } from '@mui/material/colors';
import { BlockType, Block } from './types';
import BlockForm from './BlockForm';
import AddBlockButton from './AddBlockButton';
import { createBlock } from './utils/block';
import { useEditorContext } from './EditorContextProvider';

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
    minHeight: '100%',
    maxHeight: '100%',
    width: '100%',
    borderLeft: `1px solid ${theme.palette.grey[100]}`,
    boxShadow: '-1px 0 10px rgba(0,0,0,0.2)',
    transform: 'translateX(100%)',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    transitionDuration: '.2s',
    transitionProperty: 'transform',
    overflowX: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,

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
    height: 'calc(100% - 92px)',
    overflowY: 'auto',
  },

  [`& .${classes.footer}`]: {
    marginTop: 'auto',
    display: 'flex',
    borderTop: '1px solid #eee',
    justifyContent: 'center',
  },
}));

export interface SidebarProps {
  data: Block[],
  blockTypes: BlockType[],
  title: string,
  open: boolean,
  cardinality: number,
  setData(data: Block[]): void,
  onBack?(): void,
}

const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const {
    data,
    blockTypes,
    setData,
    onBack,
    title = 'Blocks',
    open = true,
    cardinality,
  } = props;
  const blocksWrapperRef = useRef<HTMLDivElement>(null);

  const context = useEditorContext();
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const dataRef = useRef<Block[]>(data);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

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
    let sortable: Sortable|null = null;
    const timeoutId = window.setTimeout(() => {
      if (!blocksWrapperRef.current) {
        return;
      }
      sortable = new Sortable(blocksWrapperRef.current, {
        animation: 150,
        draggable: '.sortable-item',
        handle: '.sortable-handle',
        onUpdate: () => {
          if (!sortable) {
            return;
          }
          const newData = sortable
            .toArray()
            .map((id: string) => (
              dataRef.current.find(
                (block): boolean => block.id === id,
              ))) as Block[];
          setData(newData);
        },
      });
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
      if (sortable) {
        sortable.destroy();
      }
    };
  }, [setData]);

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
    setData([
      ...dataRef.current,
      createBlock(blockType),
    ]);
  };

  const handleDeleteBlock = (id: string) => () => {
    setData(dataRef.current.filter((block) => block.id !== id));
  };

  const handleClone = (id: string) => (withData = true) => {
    const block = dataRef.current.find((b) => b.id === id) as Block;
    const blockType = blockTypes.find((bt) => bt.id === block.type);
    if (!blockType) {
      return;
    }
    setData([
      ...dataRef.current,
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
    ]);
  };

  const handleChange = (newBlock: Block) => {
    setData(dataRef.current.map((block) => {
      if (block.id !== newBlock.id) {
        return block;
      }
      return newBlock;
    }));
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
        <div className={classes.title}>{title}</div>
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
              onChange={handleChange}
              onDelete={handleDeleteBlock(id)}
              onClone={handleClone(id)}
              context={context}
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
        />
      </footer>
    </Root>
  );
};

export default Sidebar;
