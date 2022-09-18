import React, { RefObject, useContext } from 'react';

export type EditorContext = {
  container?: HTMLElement
  mode: 'edit' | 'view',
  isEditMode: boolean,
  isViewMode: boolean,
} & Record<string, unknown>;

export type EditorContextProviderProps = {
  context: Partial<EditorContext>,
  children: React.ReactNode,
};

export const EditorContext = React.createContext<EditorContext>({
  mode: 'edit',
  isEditMode: true,
  isViewMode: false,
});

export const useEditorContext = (): EditorContext => {
  return useContext(EditorContext);
};

export const usePreviewWindow = (): Window|undefined => {
  const context = useEditorContext();
  if (!context.previewIframeRef) {
    if (typeof window === 'undefined') {
      return undefined;
    }
    return window;
  }
  const previewIframeRef = context.previewIframeRef as RefObject<HTMLIFrameElement>;
  const previewWindow = previewIframeRef.current?.contentWindow;
  if (!previewWindow) {
    return undefined;
  }
  return previewWindow;
};

export const EditorContextProvider: React.FunctionComponent<EditorContextProviderProps> = (props) => {
  const { context, children } = props;
  switch (context.mode) {
    case 'edit':
      context.isEditMode = true;
      context.isViewMode = false;
      break;
    case 'view':
      context.isEditMode = false;
      context.isViewMode = true;
      break;
    default:
      break;
  }

  return (
    <EditorContext.Provider
      value={context as EditorContext}
    >
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContextProvider;
