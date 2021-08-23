/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import { Editor, Range } from 'slate';
import { useSlate, ReactEditor } from 'slate-react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { usePreviewWindow } from '../EditorContextProvider';

const useStyles = makeStyles(() => ({
  root: {
    position: 'absolute',
    opacity: 0,
    transition: '.2s opacity',
    zIndex: -1,
    display: 'flex',
    width: '100%',
    top: -5000,
    left: -5000,
    borderBottom: '2px solid #eee',
    '&.active': {
      zIndex: 20,
      opacity: 1,
      top: -10,
      left:  0,
      transform: 'translateY(-100%)',
    },
  },
}));

type HoveringToolbarProps = {
  window?: Window,
  children: React.ReactNode,
};

const initialState = {
  active: false,
  // top: -5000,
  // left: -5000,
};

const HoveringToolbar: React.FunctionComponent<HoveringToolbarProps> = (props) => {
  const { children } = props;
  const [state, setState] = useState<typeof initialState>(initialState);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const editor = useSlate();
  const classes = useStyles();
  const window = usePreviewWindow();

  useEffect(() => {
    const el = rootRef.current;
    let active = true;
    let timeoutId = 0;
    if (!el || !window) {
      return undefined;
    }

    if (!ReactEditor.isFocused(editor)) {
      setState(initialState);
      return undefined;
    }
    setState({ active: true });
    return undefined;

    // timeoutId = window.setTimeout(() => {
    //   if (active) {
    //     setState({
    //       active: true,
    //       // top: rect.top + window.pageYOffset - el.offsetHeight,
    //       // left: rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2,
    //     });
    //   }
    // }, 200);
    // return () => {
    //   active = false;
    //   window.clearTimeout(timeoutId);
    // };
  }, [editor, window, editor.selection]);

  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <div
      className={clsx(classes.root, { active: state.active })}
      ref={rootRef}
      // style={{
      //   top: `${state.top}px`,
      //   left: `${state.left}px`,
      // }}
    >
      {children}
    </div>
  );
};

export default HoveringToolbar;
