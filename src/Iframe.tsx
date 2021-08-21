import React, {
  useState, useEffect, ForwardedRef, useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { create, Jss } from 'jss';

const Iframe = React.forwardRef((props: {
  children: React.ReactNode,
  className: string,
  title: string,
  onBodyMount?(body: HTMLElement): void,
}, ref: ForwardedRef<HTMLIFrameElement|null>) => {
  const {
    children,
    className,
    title,
    onBodyMount,
  } = props;
  const [contentRef, setContentRef] = useState<HTMLIFrameElement | null>(null);
  const [jss, setJss] = useState<Jss | null>(null);
  const iframeDoc = useMemo(() => contentRef?.contentWindow?.document, [contentRef]);

  useEffect(() => {
    if (!iframeDoc) {
      return;
    }
    const previewTitle = iframeDoc.createElement('title');
    previewTitle.innerText = 'Preview';
    iframeDoc.head.appendChild(previewTitle);
    setJss(create({
      plugins: jssPreset().plugins,
      insertionPoint: previewTitle,
    }));
  }, [iframeDoc]);

  useEffect(() => {
    if (iframeDoc && onBodyMount) {
      onBodyMount(iframeDoc.body);
    }
  }, [iframeDoc, onBodyMount]);

  const handleIframeLoad = (node: HTMLIFrameElement) => {
    return () => {
      setContentRef(node);
      if (!ref) {
        return;
      }
      if (typeof ref === 'function') {
        ref(node);
        return;
      }
      // eslint-disable-next-line no-param-reassign
      ref.current = node;
    };
  };

  return (
    <iframe
      title={title}
      className={className}
      ref={(node) => {
        if (!node || !node.contentDocument) {
          return;
        }
        if (node.contentDocument.readyState === 'complete') {
          handleIframeLoad(node)();
        } else {
          node.addEventListener('load', handleIframeLoad(node));
        }
      }}
    >
      {jss && iframeDoc?.body && createPortal(
        (
          <StylesProvider jss={jss}>
            {children}
          </StylesProvider>
        ),
        iframeDoc.body,
      )}
    </iframe>
  );
});

export default Iframe;
