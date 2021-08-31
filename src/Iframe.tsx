import React, {
  useState, useEffect, ForwardedRef, useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import { CacheProvider } from '@emotion/react';
import createCache, { EmotionCache } from '@emotion/cache';

const chars = 'abcdefghijklmnopqrstuvwxyz';

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
  const emotionCache = useMemo<EmotionCache|null>(() => {
    if (!iframeDoc) {
      return null;
    }
    let key = 'iframe-';
    for (let i = 0; i < 10; i += 1) {
      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      key = `${key}${randomChar}`;
    }
    return createCache({
      key,
      prepend: true,
      container: iframeDoc?.head,
    });
  }, [iframeDoc]);

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
      {iframeDoc?.body && emotionCache && createPortal(
        <CacheProvider value={emotionCache}>
          {children}
        </CacheProvider>,
        iframeDoc.body,
      )}
    </iframe>
  );
});

export default Iframe;
