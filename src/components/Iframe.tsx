import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { create, Jss } from 'jss';

const Iframe = (props: { children: React.ReactNode, className: string, title: string }) => {
  const {
    children,
    className,
    title,
  } = props;
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const [jss, setJss] = useState<Jss | null>(null);
  const mountNode = contentRef?.contentWindow?.document?.body;
  const headNode = contentRef?.contentWindow?.document?.head;

  useEffect(() => {
    if (!headNode) {
      return;
    }
    setJss(create({
      plugins: jssPreset().plugins,
      insertionPoint: headNode,
    }));
  }, [headNode]);

  return (
    <iframe
      title={title}
      className={className}
      ref={setContentRef}
    >
      {jss && mountNode && createPortal(
        (
          <StylesProvider jss={jss}>
            {children}
          </StylesProvider>
        ),
        mountNode,
      )}
    </iframe>
  );
};

export default Iframe;
