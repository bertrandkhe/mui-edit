import React, {
  useRef,
  useEffect,
  useState,
} from 'react';
import Sortable from 'sortablejs';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import yellow from '@material-ui/core/colors/yellow';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { BlockType, Block } from './types';
import BlockForm from './BlockForm';
import AddBlockButton from './AddBlockButton';
import { createBlock } from './utils/block';

export interface SidebarClasses {
  root?: string,
}

export interface SidebarProps {
  classes?: SidebarClasses,
  data: Block[],
  blockTypes: BlockType[],
  title: string,
  open: boolean,
  cardinality: number,
  setData(data: Block[]): void,
  onBack?(): void,
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    overflowY: 'auto',
    width: 365,
    borderLeft: `1px solid ${theme.palette.grey[100]}`,
    boxShadow: '-1px 0 10px rgba(0,0,0,0.2)',
    marginLeft: 'auto',
    position: 'absolute',
    top: 0,
    right: -365,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    transition: '0.4s',
    zIndex: 1,

    '&.open': {
      right: 0,
    },

    '& .sortable-item .sortable-handle': {
      cursor: 'grab',
    },
    '& .sortable-item.sortable-chosen': {
      cursor: 'grabbing',
      background: yellow[100],
    },
  },
  headerBtn: {
    height: '100%',
    borderRadius: 0,
    boxShadow: 'none',
  },
  title: {
    padding: theme.spacing(2),
  },
  header: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    display: 'flex',
    alignItems: 'center',
  },
  body: {
    height: 'calc(100% - 92px)',
    overflowY: 'auto',
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
    borderTop: '1px solid #eee',
    justifyContent: 'center',
  },
}));

const Sidebar: React.FunctionComponent<SidebarProps> = (props) => {
  const {
    classes = {},
    data,
    blockTypes,
    setData,
    onBack,
    title = 'Blocks',
    open = true,
    cardinality,
  } = props;
  const blocksWrapperRef = useRef<HTMLDivElement>(null);
  const localClasses = useStyles();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => {
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
    const sortable = new Sortable(blocksWrapperRef.current, {
      animation: 150,
      draggable: '.sortable-item',
      handle: '.sortable-handle',
      onUpdate: () => {
        const newData = sortable
          .toArray()
          .map((id: string) => (
            data.find(
              (block): boolean => block.id === id,
            ))) as Block[];
        setData(newData);
      },
    });
    return () => {
      sortable.destroy();
    };
  }, [data, setData]);

  const handleAddBlock = (blockType: BlockType) => {
    setData([
      ...data,
      createBlock(blockType),
    ]);
  };

  const handleDeleteBlock = (id: string) => () => {
    setData(data.filter((block) => block.id !== id));
  };

  const handleClone = (id: string) => (withData = true) => {
    const block = data.find((b) => b.id === id) as Block;
    const blockType = blockTypes.find((bt) => bt.id === block.type);
    if (!blockType) {
      return;
    }
    setData([
      ...data,
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

  const handleChange = (id: string) => (newBlock: Block) => {
    setData(data.map((block) => {
      if (block.id !== id) {
        return block;
      }
      return {
        ...newBlock,
        meta: {
          ...newBlock.meta,
          changed: Date.now(),
        },
      };
    }));
  };

  return (
    <div className={clsx([localClasses.root, classes.root, { open: mounted && open }])}>
      <div className={localClasses.header}>
        {onBack && (
          <Button
            onClick={onBack}
            size="small"
            className={localClasses.headerBtn}
            variant="contained"
            color="primary"
          >
            Back
          </Button>
        )}
        <div className={localClasses.title}>{title}</div>
      </div>
      <div ref={blocksWrapperRef} className={localClasses.body}>
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
            <React.Suspense fallback={null} key={block.id}>
              <BlockForm
                blockType={blockType}
                block={block}
                onChange={handleChange(id)}
                onDelete={handleDeleteBlock(id)}
                onClone={handleClone(id)}
                initialState={{
                  showEditForm: Date.now() - meta.created < 2000,
                }}
              />
            </React.Suspense>
          );
        })}
      </div>
      <footer className={localClasses.footer}>
        <AddBlockButton
          data={data}
          blockTypes={blockTypes}
          onAddBlock={handleAddBlock}
          disabled={cardinality >= 0 && data.length >= cardinality}
        />
      </footer>
    </div>
  );
};

export default Sidebar;