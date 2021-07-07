import React, { useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import Sortable from 'sortablejs';
import yellow from '@material-ui/core/colors/yellow';


import { makeStyles, debounce } from '@material-ui/core';
import AddBlockButton from './AddBlockButton';
import BlockForm from './BlockForm';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    overflowY: 'scroll',
    width: 460,
    borderLeft: `1px solid ${theme.palette.grey[100]}`,
    boxShadow: '-1px 0 10px rgba(0,0,0,0.2)',

    '& .sortable-item .sortable-handle': {
      cursor: 'grab',
    },
    '& .sortable-item.sortable-chosen': {
      cursor: 'grabbing',
      background: yellow[100],
    },
  },
  title: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.grey[100]}`,
  },
}))

const Sidebar = (props) => {
  const { classes, data, blockTypes, setData } = props;
  const blocksWrapperRef = useRef(null);
  const localClasses = useStyles();

  useEffect(() => {
    const sortable = new Sortable(blocksWrapperRef.current, {
      animation: 150,
      draggable: '.sortable-item',
      handle: '.sortable-handle',
      onUpdate: () => {
        const newData = sortable.toArray().map((id) => data.find((block) => block.id === id));
        setData(newData);
      },
    });
    return () => {
      sortable.destroy();
    }
  }, [data]);

  const handleAddBlock = (blockType) => {
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
  }

  const handleDeleteBlock = (id) => () => {
    setData(data.filter((block) => block.id !== id));
  };

  const handleClone = (id) => (withData = true) => {
    const block = data.find((block) => block.id === id);
    const blockType = blockTypes.find((blockType) => blockType.id === block.type);
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
      }
    ]);
  };

  const handleEditBlockData = (id) => (blockData) => {
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

  const handleEditBlockSettings = (id) => (blockSettings) => {
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

  return (
    <div className={clsx([localClasses.root, classes.root])}>
      <div className={localClasses.title}>Blocks</div>
      <div ref={blocksWrapperRef}>
        {data.map((block) => {
          const { type, id, meta } = block;
          const blockType = blockTypes.find((blockType) => blockType.id === type);
          return (
            <BlockForm
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
      <AddBlockButton
        blockTypes={blockTypes}
        onAddBlock={handleAddBlock}
      />
    </div>
  );
};

export default Sidebar;