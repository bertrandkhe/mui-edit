import React, { useContext, useMemo } from 'react';
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

export default IframeContent;
