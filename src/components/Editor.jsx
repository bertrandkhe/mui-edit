import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import Preview from './Preview';
import Sidebar from './Sidebar';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%',
    width: '100%',
    position: 'relative',
  },
  previewWithSidebar: {
    width: 'calc(100% - 350px)',
  },
}));

const Editor = (props) => {
  const {
    initialData = [],
    onChange,
    blockTypes = [],
    disableEditor = false,
    disablePreview = false,
    container,
    sidebarProps = {},
  } = props;
  const localClasses = useStyles();
  const [data, setData] = useState(initialData);
  const sortedBlockTypes = blockTypes.sort((a, b) => (a.label < b.label ? -1 : 1));

  const handleChange = (updatedData) => {
    setData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  };

  if (disableEditor && disablePreview) {
    return null;
  }

  const defaultSidebarProps = {
    data,
    setData: handleChange,
    blockTypes: sortedBlockTypes,
    editorContainer: container,
  };

  const mergedSidebarProps = { ...defaultSidebarProps, ...sidebarProps };

  if (disablePreview) {
    return (
      <Sidebar {...mergedSidebarProps} />
    );
  }

  if (disableEditor) {
    return (
      <Preview
        blockTypes={sortedBlockTypes}
        data={data}
      />
    );
  }

  return (
    <div className={clsx([localClasses.root])}>
      <Preview
        className={localClasses.previewWithSidebar}
        blockTypes={sortedBlockTypes}
        data={data}
      />
      <Sidebar {...mergedSidebarProps} />
    </div>
  );
};

export default Editor;
