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
import { useEditorContext } from './EditorContextProvider';

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
    overflowX: 'visible',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,

    '&.open': {
      transform: 'translateX(0)',
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
  const context = useEditorContext();
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

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
              data.find(
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
  }, [data, setData]);

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
      return newBlock;
    }));
  };

  return (
    <div className={clsx(localClasses.root, classes.root, { open: !closing && open && mounted })}>
      <div className={localClasses.header}>
        {onBack && (
          <Button
            onClick={handleBack}
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
            <BlockForm
              key={block.id}
              blockType={blockType}
              block={block}
              onChange={handleChange(id)}
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
