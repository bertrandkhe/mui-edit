import React, { useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import clsx from 'clsx';
import Sortable from 'sortablejs';

import { makeStyles, debounce } from '@material-ui/core';
import AddBlockButton from './AddBlockButton';
import BlockForm from './BlockForm';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: 350,
    borderLeft: `1px solid ${theme.palette.grey[100]}`,

    '& .sortable-item .sortable-handle': {
      cursor: 'grab',
    },
    '& .sortable-item.sortable-chosen': {
      cursor: 'grabbing',
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
      },
    ]);
  }

  const handleEditBlock = (id) => (blockData) => {
    setData(data.map((block) => {
      if (block.id !== id) {
        return block;
      }
      return {
        ...block,
        data: blockData,
      };
    }));
  };

  return (
    <div className={clsx([localClasses.root, classes.root])}>
      <div className={localClasses.title}>Blocks</div>
      <div ref={blocksWrapperRef}>
        {data.map((block) => {
          const { type, id } = block;
          const blockType = blockTypes.find((blockType) => blockType.id === type);
          return (
            <BlockForm
              key={id}
              blockType={blockType}
              block={block}
              onChange={debounce(handleEditBlock(id))}
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