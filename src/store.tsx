import { create, createStore, useStore } from 'zustand';
import React, { useContext, useEffect, useRef } from 'react';
import { PreviewInstance } from './Preview/PreviewIframe';
import { Block, BlockType } from './types';

type PreviewState = {
  mode: 'view' | 'edit',
  setMode(mode: PreviewState['mode']): void,
  data: Block[],
  setData(data: Block[]): void,
  getData(): Block[],
};

export const usePreviewStore = create<PreviewState>((set, get) => ({
  mode: 'view',
  setMode(mode) {
    set({ mode });
  },
  data: [],
  setData(data) {
    set({ data });
  },
  getData() {
    return get().data;
  },
}));

type EditorState = {
  isFullScreen: boolean,
  isNested: boolean,
  cardinality: number,
  blockTypes: BlockType[],
  setBlockTypes(newTypes: BlockType[]): void,
  data: Block[],
  setData(
    data: Block[]
    | (
      (prevData: Block[]) => Block[]),
      areEqual?: ((prevData: Block[], newData: Block[]) => boolean)
    ): Block[],
  allowedOrigins: string[],
  setAllowedOrigins(newOrigins: string[]): void,
  previewSrc: string,
  previewWidth: 'sm' | 'md' | 'lg',
  setPreviewWidth(width: EditorState['previewWidth']): void,
  previewInstance: PreviewInstance | null,
  setPreviewInstance(instance: PreviewInstance): void,
};

type EditorStore = ReturnType<typeof createEditorStore>;

const createEditorStore = (
  initialState: Partial<
    Omit<EditorState, 'setBlockTypes' | 'setData' | 'setAllowedOrigins' | 'setPreviewWidth' | 'setPreviewInstance'>
  > = {},
) => {
  const {
    isFullScreen = false,
    isNested = false,
    cardinality = -1,
    blockTypes = [],
    data = [],
    allowedOrigins = [],
    previewSrc = '',
    previewWidth = 'lg',
    previewInstance = null,
  } = initialState;
  return (
  createStore<EditorState>((set, get) => ({
    isFullScreen,
    isNested,
    cardinality,
    blockTypes,
    setBlockTypes(newTypes) {
      const prevTypes = get().blockTypes;
      const prevTypesId = prevTypes.map((t) => t.id).join('/');
      const sortedNewTypes = newTypes.sort((a, b) => (a.label < b.label ? -1 : 1));
      const sortedNewTypesId = sortedNewTypes.sort().map((t) => t.id).join('/');
      if (sortedNewTypesId !== prevTypesId) {
        set({ blockTypes: sortedNewTypes });
      }
    },
    data,
    onDataChange: null,
    setData(data, userEqualityFn) {
      const prevData = get().data;
      const newData = Array.isArray(data) ? data : data(prevData);
      const equalityFn = userEqualityFn || ((a: Block[], b: Block[]) => {
        const aId = a.map((block) => `${block.id}:${block.meta.changed}`).join('/');
        const bId = b.map((block) => `${block.id}:${block.meta.changed}`).join('/');
        return aId === bId;
      });
      const selected = equalityFn(prevData, newData) ? prevData : newData;
      set({ data: selected });
      return selected;
    },
    allowedOrigins,
    setAllowedOrigins(newOrigins) {
      const prevOrigins = get().allowedOrigins;
      const sortedNewOrigins = newOrigins.sort();
      if (prevOrigins.join(',') !== sortedNewOrigins.join(',')) {
        set({ allowedOrigins: sortedNewOrigins });
      }
    },
    previewSrc,
    previewWidth,
    setPreviewWidth(width) {
      set({ previewWidth: width });
    },
    previewInstance,
    setPreviewInstance(instance) {
      set({ previewInstance: instance });
    },
  })))
};

const EditorContext = React.createContext<EditorStore | void>(undefined);
export const Provider: React.FC<{
  children: React.ReactNode,
  data?: Block[] | void,
} & Omit<Partial<EditorState>, 'data'>> = (props) => {
  const { children, ...editorState } = props;
  const editorStoreRef = useRef<EditorStore>();
  if (!editorStoreRef.current) {
    editorStoreRef.current = createEditorStore(editorState as EditorState);
  }

  useEffect(() => {
    const {
      data,
      allowedOrigins,
      blockTypes,
      ...other
    } = editorState;
    const editorStore = editorStoreRef.current as EditorStore;
    const currentState = editorStore.getState();
    if (data) {
      currentState.setData(data);
    }
    if (allowedOrigins) {
      currentState.setAllowedOrigins(allowedOrigins);
    }
    if (blockTypes) {
      currentState.setBlockTypes(blockTypes);
    }
    editorStore.setState(other);
  }, [editorState]);

  return (
    <EditorContext.Provider value={editorStoreRef.current}>
      {children}
    </EditorContext.Provider>
  );
};

const rootEditorStore = createEditorStore();
export const useEditorStore = (<U, >(selector: ((state: EditorState) => U)): U => {
  const store = useContext(EditorContext) || rootEditorStore;
  return useStore(store, selector);
});
