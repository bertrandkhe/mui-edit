import React, {
  useState,
  useEffect,
  ForwardedRef,
  useMemo,
  useContext,
  HTMLAttributes,
} from 'react';
import ReactDOM from 'react-dom';
import { CacheProvider } from '@emotion/react';
import createCache, { EmotionCache } from '@emotion/cache';

const chars = 'abcdefghijklmnopqrstuvwxyz';

const WindowContext = React.createContext<Window|undefined>(undefined);

export const useWindow = (): Window|undefined => {
  const iframeWindow = useContext(WindowContext);
  if (iframeWindow) {
    return iframeWindow;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  return undefined;
};

const IframeContent = (props: { children: React.ReactNode, window: Window }): React.ReactPortal => {
  const { window, children } = props;
  const emotionCache = useMemo<EmotionCache>(() => {
    let key = 'iframe-';
    for (let i = 0; i < 10; i += 1) {
      const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));
      key = `${key}${randomChar}`;
    }
    return createCache({
      key,
      prepend: true,
      container: window.document.head,
    });
  }, [window]);

  return ReactDOM.createPortal(
    <CacheProvider value={emotionCache}>
      <WindowContext.Provider value={window}>
        {children}
      </WindowContext.Provider>
    </CacheProvider>,
    window.document.body,
  );
};

export type IframeProps = {
  children: React.ReactNode,
  onBodyMount?(body: HTMLElement): void,
} & HTMLAttributes<HTMLIFrameElement>;

const Iframe = React.forwardRef((props: IframeProps, ref: ForwardedRef<HTMLIFrameElement|null>) => {
  const {
    children,
    onBodyMount,
    ...otherProps
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
      {...otherProps}
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
