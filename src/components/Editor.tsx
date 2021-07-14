import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { EditorProps } from '../types/EditorProps';
import { Block } from '../types/Block';
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

const Editor = (props: EditorProps): React.ReactElement | null => {
  const {
    initialData = [],
    onChange,
    blockTypes = [],
    disableEditor = false,
    disablePreview = false,
    sidebarProps,
  } = props;
  const localClasses = useStyles();
  const [data, setData] = useState(initialData);
  const sortedBlockTypes = blockTypes.sort((a, b) => (a.label < b.label ? -1 : 1));

  function handleChange(updatedData: Block[]): void {
    setData(updatedData);
    if (onChange) {
      onChange(updatedData);
    }
  }

  if (disableEditor && disablePreview) {
    return null;
  }

  const defaultSidebarProps = {
    data,
    setData: handleChange,
    blockTypes: sortedBlockTypes,
    title: 'Blocks',
    open: true,
  };

  const mergedSidebarProps = { ...defaultSidebarProps, ...sidebarProps };

  if (disablePreview) {
    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
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
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <Sidebar {...mergedSidebarProps} />
    </div>
  );
};

export default Editor;
