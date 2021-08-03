import React, { useContext } from 'react';

export type EditorContext = Record<string, unknown>;

export type EditorContextProviderProps = {
  context: EditorContext,
  children: React.ReactNode,
};

export const EditorContext = React.createContext<EditorContext>({});

export const useEditorContext = (): EditorContext => {
  return useContext(EditorContext);
};

export const EditorContextProvider: React.FunctionComponent<EditorContextProviderProps> = (props) => {
  const { context, children } = props;
  return (
    <EditorContext.Provider value={context}>
      {children}
    </EditorContext.Provider>
  );
};

export default EditorContextProvider;
