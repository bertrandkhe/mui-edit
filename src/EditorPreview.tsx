import React from 'react';
import clsx from 'clsx';
import PreviewIframe, { PreviewInstance } from './Preview/PreviewIframe';
import { styled } from '@mui/material';
import { headerHeight } from './Header';
import { useEditorStore } from './store';

const PREFIX = 'EditorPreview';

const classes = {
  root: `${PREFIX}-root`,
  previewIframe: `${PREFIX}-previewIframe`,
};

const Root = styled('div')((
  {
    theme,
  },
) => ({
  height: `calc(100% - ${headerHeight}px)`,
  [`& .${classes.previewIframe}`]: {
    display: 'block',
    margin: 'auto',
    border: 'none',
    overflowY: 'auto',
    maxWidth: '100%',
    width: '100%',
    height: '100%',
    [theme.breakpoints.up('lg')]: {
      '&.sm': {
        maxWidth: 375,
        height: 667,
        marginTop: 30,
        boxShadow: '0 9px 10px rgba(0,0,0,0.5)',
      },
      '&.md': {
        maxWidth: 1080,
        height: 820,
        marginTop: 30,
        boxShadow: '0 9px 10px rgba(0,0,0,0.5)',
      },
    },
  },
}));

const EditorPreview: React.FC<{
  className?: string,
  onPreviewInstanceLoad?(instance: PreviewInstance): void,
}> = (props) => {
  const { className, onPreviewInstanceLoad } = props;
  const setData = useEditorStore((state) => state.setData);
  const previewWidth = useEditorStore((state) => state.previewWidth);
  const previewSrc = useEditorStore((state) => state.previewSrc);
  const setPreviewInstance = useEditorStore((state) => state.setPreviewInstance);
  if (previewSrc.length === 0) {
    return null;
  }
  return (
    <Root className={clsx(classes.root, className)}>
      <PreviewIframe
        src={previewSrc}
        className={clsx(classes.previewIframe, previewWidth)}
        onChange={setData}
        onLoad={(previewInstance) => {
          setPreviewInstance(previewInstance);
          if (onPreviewInstanceLoad) {
            onPreviewInstanceLoad(previewInstance);
          }
        }}
      />
    </Root>
  );
};

export default EditorPreview;
