import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import Preview from './Preview';
import Sidebar from './Sidebar';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    height: '100%',
  },
  sidebar: {
    marginLeft: 'auto',
  },
}));

const Editor = (props) => {
  const {
    initialData = [],
    onChange,
    blockTypes = [],
  } = props;
  const localClasses = useStyles();
  const [data, setData] = useState(initialData);
  const sortedBlockTypes = blockTypes.sort((a, b) => a.label < b.label ? -1 : 1);

  const handleChange = (updatedData) => {
    setData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  }

  return (
    <div className={clsx([localClasses.root])}>
      <Preview
        blockTypes={sortedBlockTypes}
        data={data}
      />
      <Sidebar
        data={data}
        setData={handleChange}
        blockTypes={sortedBlockTypes}
        classes={{
          root: clsx([localClasses.sidebar]),
        }}
      />
    </div>
  );
};

export default Editor;
