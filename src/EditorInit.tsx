import React, { useEffect } from 'react';
import { useEditorStore } from './store';
import { Block, BlockType } from './types';

const EditorInit: React.FC<{
  data?: Block[] | void,
  isFullScreen: boolean,
  blockTypes: BlockType[],
  allowedOrigins: string[],
  isNested?: boolean,
}> = (props) => {
  const {
    data,
    blockTypes,
    isFullScreen,
    allowedOrigins,
  } = props;
  const setIsFullScreen = useEditorStore((state) => state.setIsFullScreen);

  useEffect(() => {
    setIsFullScreen(isFullScreen);
  }, [setIsFullScreen, isFullScreen]);

  const setBlockTypes = useEditorStore((state) => state.setBlockTypes);
  useEffect(() => {
    setBlockTypes(blockTypes);
  }, [blockTypes, setBlockTypes]);

  const setEditorData = useEditorStore((state) => state.setData);

  const setAllowedOrigins = useEditorStore((state) => state.setAllowedOrigins);
  useEffect(() => {
    setAllowedOrigins(allowedOrigins);
  }, [allowedOrigins]);

  // Refresh current data on data prop change
  useEffect(() => {
    if (data) {
      setEditorData(data);
    }
  }, [data]);
  return null;
};

export default EditorInit;
