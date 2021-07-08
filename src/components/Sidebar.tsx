import React from 'react';
import { useRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import Sortable from 'sortablejs';
import yellow from '@material-ui/core/colors/yellow';

import { makeStyles, debounce, Button } from '@material-ui/core';
import AddBlockButton from './AddBlockButton';
import BlockForm from './BlockForm';
import { SidebarPropsInterface } from '@/types/components/SidebarPropsInterface';
import { BlockTypeInterface } from '@/types/components/BlockTypeInterface';
import { BlockDataInterface, BlockSettingsInterface } from '@/types/components/BlockInterface';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: 350,
    borderLeft: `1px solid ${theme.palette.grey[100]}`,
    boxShadow: '-1px 0 10px rgba(0,0,0,0.2)',
    marginLeft: 'auto',
    position: 'absolute',
    top: 0,
    right: -350,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    transition: '0.4s',

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
  header: {
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
    display: 'flex',
    alignItems: 'center',
  },
  headerBtn: {
    height: '100%',
    borderRadius: 0,
    boxShadow: 'none',
  },
  title: {
    padding: theme.spacing(2),
  },
  footer: {
    marginTop: 'auto',
    display: 'flex',
  },
}));

const Sidebar: React.FunctionComponent<SidebarPropsInterface> = (props) => {
  const {
    classes = {},
    data,
    blockTypes,
    setData,
    container,
    onBack,
    title = 'Blocks',
    open = true,
  } = props;
  const blocksWrapperRef = useRef(null);
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
    const sortable = new Sortable(blocksWrapperRef.current, {
      animation: 150,
      draggable: '.sortable-item',
      handle: '.sortable-handle',
      onUpdate: () => {
        const newData = sortable.toArray().map((id: string) => data.find((block) => block.id === id));
        setData(newData);
      },
    });
    return () => {
      sortable.destroy();
    };
  }, [data, setData]);

  const handleAddBlock = (blockType: BlockTypeInterface<BlockDataInterface, BlockSettingsInterface>) => {
    setData([
      ...data,
      {
        id: uuidv4(),
        type: blockType.id,
        data: blockType.defaultData,
        settings: blockType.hasSettings ? blockType.defaultSettings : undefined,
        meta: {
          created: Date.now(),
          changed: Date.now(),
        },
      },
    ]);
  };

  const handleDeleteBlock = (id: string) => () => {
    setData(data.filter((block) => block.id !== id));
  };

  const handleClone = (id: string) => (withData = true) => {
    const block = data.find((b) => b.id === id);
    const blockType = blockTypes.find((bt) => bt.id === block.type);
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

  function handleEditBlockData<D>(id: string) {
    return (blockData: D) => {
      setData(data.map((block) => {
        if (block.id !== id) {
          return block;
        }
        return {
          ...block,
          data: blockData,
          meta: {
            ...block.meta,
            changed: Date.now(),
          },
        };
      }));
    };
  }

  function handleEditBlockSettings<S>(id: string) {
    return (blockSettings: S) => {
      setData(data.map((block) => {
        if (block.id !== id) {
          return block;
        }
        return {
          ...block,
          settings: blockSettings,
          meta: {
            ...block.meta,
            changed: Date.now(),
          },
        };
      }));
    };
  }

  return (
    <div className={clsx([localClasses.root, classes.root, {open: mounted && open}])}>
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
      <div ref={blocksWrapperRef}>
        {data.map((block) => {
          const {type, id, meta} = block;
          const blockType = blockTypes.find((bt) => bt.id === type);
          return (
            <BlockForm
              editorContainer={container}
              key={id}
              blockType={blockType}
              block={block}
              onDataChange={debounce(handleEditBlockData(id), 200)}
              onSettingsChange={handleEditBlockSettings(id)}
              onDelete={handleDeleteBlock(id)}
              onClone={handleClone(id)}
              initialState={{
                showEditForm: Date.now() - meta.created < 2000,
              }}
            />
          );
        })}
      </div>
      <footer className={localClasses.footer}>
        <AddBlockButton
          blockTypes={blockTypes}
          onAddBlock={handleAddBlock}
        />
      </footer>
    </div>
  );
};

export default Sidebar;
