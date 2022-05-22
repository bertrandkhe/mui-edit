import React, {
  useState,
  useEffect,
  ForwardedRef,
  useMemo,
} from 'react';
import IframeContent from './IframeContent';

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
  const iframeDoc = useMemo(() => contentRef?.contentWindow?.document, [contentRef]);

  useEffect(() => {
    if (!iframeDoc) {
      return;
    }
    const previewTitle = iframeDoc.createElement('title');
    previewTitle.innerText = 'Preview';
    iframeDoc.head.appendChild(previewTitle);
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
      {contentRef?.contentWindow && (
        <IframeContent window={contentRef.contentWindow}>
          {children}
        </IframeContent>
      )}
    </iframe>
  );
});

export default Iframe;
